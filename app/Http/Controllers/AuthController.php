<?php

namespace App\Http\Controllers;

use Google_Client;
use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;
use Google\Service\Oauth2;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Jobs\SendWelcomeEmail;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'login', 
            'refresh', 
            'googleLogin',
            'redirectToAuth',
            'handleGoogleCallback'
        ]]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request()->only('email', 'password');
    
        $user = User::where('email', $credentials['email'])->first();
        
        if ($user) {
            if ($user->locked_until && \Carbon\Carbon::parse($user->locked_until)->isFuture()) {
                $remainingTime = \Carbon\Carbon::now()->diffInMinutes(\Carbon\Carbon::parse($user->locked_until));
                return response()->json([
                    'error' => "Tài khoản của bạn đã bị khóa. Vui lòng thử lại sau {$remainingTime} phút."
                ], 403);
            }
    
            if ($user->locked_until && \Carbon\Carbon::parse($user->locked_until)->isPast()) {
                $user->status = 1;
                $user->locked_until = null;
                $user->save();
            }
        }
    
        if (!$token = auth('api')->attempt($credentials)) {
            if ($user) {
                $user->failed_attempts = ($user->failed_attempts ?? 0) + 1;
    
                if ($user->failed_attempts >= 5) {
                    $lockoutMinutes = 2; 
                    if ($user->lockout_count > 0) {
                        $lockoutMinutes = 2 * pow(2, $user->lockout_count);
                    }
                    
                    $user->locked_until = \Carbon\Carbon::now()->addMinutes($lockoutMinutes);
                    $user->status = 0;
                    $user->failed_attempts = 0;
                    $user->lockout_count = ($user->lockout_count ?? 0) + 1;
                    $user->save();
    
                    Log::error('Account locked due to multiple failed attempts', [
                        'email' => $credentials['email'],
                        'lockout_minutes' => $lockoutMinutes,
                        'lockout_count' => $user->lockout_count
                    ]);
    
                    return response()->json([
                        'error' => "Tài khoản của bạn đã bị khóa trong {$lockoutMinutes} phút do đăng nhập sai nhiều lần."
                    ], 403);
                }
    
                $user->save();
    
                Log::error('Failed login attempt', [
                    'email' => $credentials['email'],
                    'remaining_attempts' => 5 - $user->failed_attempts
                ]);
    
                return response()->json([
                    'error' => 'Email hoặc mật khẩu không đúng. Bạn còn ' . (5 - $user->failed_attempts) . ' lần thử.'
                ], 401);
            }
    
            return response()->json([
                'error' => 'Email hoặc mật khẩu không đúng.'
            ], 401);
        }
    
        $user = auth('api')->user();
        if (!$user || !$user->getJWTIdentifier()) {
            return response()->json(['error' => 'User ID is null or invalid'], 401);
        }
    
        if ($user->verification_token !== null) {
            return response()->json(['error' => 'Tài khoản của bạn chưa được xác thực.'], 403);
        }
    
        $user->failed_attempts = 0;
        $user->locked_until = null;
        $user->lockout_count = 0;
        $user->status = 1;
        $user->save();
    
        $refreshToken = $this->createRefreshToken($user->user_id);
        return $this->respondWithToken($token, $refreshToken);
    }

    private function createRefreshToken($userId)
    {
        $data = [
            'sub' => $userId,
            'random' => rand() . time(),
            'exp' => time() + config('jwt.refresh_ttl')
        ];

        return JWTAuth::getJWTProvider()->encode($data);
    }

    public function me()
    {
        try {
            return response()->json(auth()->user());
        } catch (\Throwable $th) {
            Log::error('Unauthorized access attempt: ' . $th->getMessage());
            return response()->json([
                'error' => 'Unauthorized',
                'status' => 401
            ], 401);
        }
    }

    public function logout()
    {
        $cookie = cookie('token', '', -1);
        return response()->json(['message' => 'Successfully logged out'])->withCookie($cookie);
    }

    public function refresh()
    {
        $refreshToken = request()->refresh_token;
        if (!$refreshToken) {
            return response()->json(['error' => 'No refresh token provided'], 400);
        }

        try {
            $decoded = JWTAuth::getJWTProvider()->decode($refreshToken);
            $user = User::find($decoded['sub']);
            if (!$user) {
                Log::error('User not found', ['sub' => $decoded['sub']]);
                return response()->json(['error' => 'User not found'], 404);
            }
            $token = auth('api')->login($user);
            $refreshToken = $this->createRefreshToken($user->user_id);
            return $this->respondWithToken($token, $refreshToken);
        } catch (JWTException $exception) {
            Log::error('Invalid refresh token: ' . $exception->getMessage());
            return response()->json(['error' => 'Refresh token invalid'], 500);
        }
    }

    private function respondWithToken($token, $refreshToken)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }

    public function redirectToAuth(Request $request)
    {
        try {
            $client = new Google_Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->setRedirectUri(config('services.google.redirect'));

            $client->setScopes([
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ]);

            $state = $request->query('state');
            $client->setState($state);

            $authUrl = $client->createAuthUrl();

            return response()->json(['auth_url' => $authUrl]);
        } catch (\Exception $e) {
            Log::error('Google Auth URL Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to generate auth URL',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function handleGoogleCallback(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        try {
            $client = new Google_Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->setRedirectUri(config('services.google.redirect'));

            $token = $client->fetchAccessTokenWithAuthCode($request->code);

            if (!$client->getAccessToken()) {
                throw new \Exception('Failed to get access token');
            }

            if (isset($token['error'])) {
                throw new \Exception($token['error_description'] ?? 'Unknown Google authentication error');
            }

            $googleService = new Oauth2($client);
            $googleUser = $googleService->userinfo->get();

            if (!$googleUser->getEmail()) {
                throw new \Exception('No email found from Google');
            }

            $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getPicture(),
                'role' => 'user',
                'status' => 1,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(16))
            ]);

            try {
                SendWelcomeEmail::dispatch($user);
            } catch (\Exception $e) {
                Log::error('SendWelcomeEmail failed: ' . $e->getMessage());
            }        
        } else {
            $user->update([
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getPicture(),
                'status' => 1,
                'email_verified_at' => now(),
            ]);
        }


            if (!$user) {
                Log::error('User is null after updateOrCreate');
                throw new \Exception('User creation or update failed');
            }

            $token = JWTAuth::fromUser($user);

            $refreshToken = $this->createRefreshToken($user->user_id);

            return $this->respondWithToken($token, $refreshToken);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Google login failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
