<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $apiSecret = $request->header('x-api-secret') ?? $request->query('api_secret');

        $isApiSecretValid = $apiSecret === env('API_SECRET');

        $isUserAdmin = Auth::check() && Auth::user()->role === 'admin';

        if ($isUserAdmin || $isApiSecretValid) {
            return $next($request);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
