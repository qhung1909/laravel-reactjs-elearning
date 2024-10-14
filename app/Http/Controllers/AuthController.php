<?php

namespace App\Http\Controllers;

use Google_Client;
use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh', 'googleLogin']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {

        $credentials = request()->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth('api')->user();

        if (!$user || !$user->getJWTIdentifier()) {
            return response()->json(['error' => 'User ID is null or invalid'], 401);
        }

        if ($user->verification_token !== null) {
            return response()->json(['error' => 'Your account is not verified.'], 403);
        }

        $refreshToken = $this->createRefreshToken();

        return $this->respondWithToken($token, $refreshToken);
    }


    private function createRefreshToken()
    {
        $data = [
            'sub' => auth('api')->user()->user_id,
            'random' => rand() . time(),
            'exp' => time() + config('jwt.refresh_ttl')
        ];
        $refreshToken = JWTAuth::getJWTProvider()->encode($data);;
        return $refreshToken;
    }
    public function me()
    {
        try {
            return response()->json(auth()->user());
        } catch (\Throwable $th) {
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
                return response()->json(['error' => 'User not found'], 404);
            }
            $token = auth('api')->login($user);
            $refreshToken = $this->createRefreshToken();

            return $this->respondWithToken($token, $refreshToken);
        } catch (JWTException $exception) {
            return response()->json(['error' => 'Refresh token invalid'], 500);
        }
    }


    private function respondWithToken($token, $refreshToken)
    {
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 30
        ]);
    }


    // public function redirectToAuth()
    // {
    //     return response()->json([
    //         'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
    //     ]);
    // }

    // public function handleGoogleCallback()
    // {
    //     try {
    //         $client = new Client([
    //             'verify' => 'C:\laragon\etc\ssl\cacert.pem', 
    //         ]);

    //         Socialite::driver('google')->setHttpClient($client);

    //         $googleUser = Socialite::driver('google')->stateless()->user();

    //         $user = User::where('google_id', $googleUser->id)->first();

    //         if (!$user) {
    //             $user = User::create([
    //                 'name' => $googleUser->name,
    //                 'email' => $googleUser->email,
    //                 'google_id' => $googleUser->id,
    //                 'avatar' => $googleUser->avatar,
    //                 'role' => 'user',
    //                 'status' => 1,
    //             ]);
    //         } else {
    //             $user->avatar = $googleUser->avatar;
    //             $user->save();
    //         }

    //         auth()->login($user);

    //         $accessToken = auth('api')->login($user);
    //         $refreshToken = $this->createRefreshToken($user);

    //         $frontendUrl = 'http://localhost:5173';
    //         return response()->json([
    //             'access_token' => $accessToken,
    //             'refresh_token' => $refreshToken,
    //             'redirect_url' => $frontendUrl,
    //         ]);

    //     } catch (\Exception $e) {
    //         return response()->json(['error' => 'Đăng nhập Google thất bại 22'], 500);
    //     }
    // }
}
