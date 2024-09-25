<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Exception;
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
    private function createRefreshToken(){
        $data = [
            'sub' => auth('api')->user()->id,
            'random' => rand().time(),
            'exp' =>time() + config('jwt.refresh_ttl')
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
            if(!$user){
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


}
