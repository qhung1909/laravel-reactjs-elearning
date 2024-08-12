<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'refresh']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $refreshToken = $this->createRefreshToken();

        return $this->respondWithToken($token, $refreshToken);
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

    public function refresh(Request $request)
    {
        $accessToken = $request->header('Authorization');
        $refreshToken = $request->input('refresh_token');

        try {
            $accessToken = str_replace('Bearer ', '', $accessToken);

            $decodedAccessToken = JWTAuth::setToken($accessToken)->getPayload();

            JWTAuth::invalidate($accessToken);

            $decodedRefreshToken = JWTAuth::getJWTProvider()->decode($refreshToken);
            $user = User::find($decodedRefreshToken['sub']);

            if (!$user) {
                return response()->json([
                    'error' => 'User not found',
                    'status' => 404
                ], 404);
            }

            $newAccessToken = auth('api')->login($user);

            $newRefreshToken = $this->createRefreshToken($user);

            return $this->respondWithToken($newAccessToken, $newRefreshToken);
        } catch (JWTException $exception) {
            return response()->json([
                'error' => 'Token invalid or expired',
                'status' => 500
            ], 500);
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

    private function createRefreshToken($user = null)
    {
        if (!$user) {
            $user = auth('api')->user();
        }
        $data = [
            'sub' => $user->id,
            'random' => rand() . time(),
            'exp' => time() + config('jwt.refresh_ttl'),
        ];

        $refreshToken = JWTAuth::getJWTProvider()->encode($data);
        return $refreshToken;
    }
}
