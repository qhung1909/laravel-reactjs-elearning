<?php

return [
    'paths' => ['api/*', 'login/google', 'login/google/callback', 'broadcasting/auth'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://192.168.1.53:5173',
        'http://192.168.1.53:5174',
        'http://192.168.1.7:5173',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
