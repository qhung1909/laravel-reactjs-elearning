<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;
/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::routes(['middleware' => ['auth:api']]);

Broadcast::channel('user.{userId}', function ($user, $userId) {
    \Illuminate\Support\Facades\Log::info('Channel authorization attempt', [
        'user_id' => $user->user_id,
        'requested_channel_user_id' => $userId
    ]);
    
    return (int) $user->user_id === (int) $userId;
});