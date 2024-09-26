<?php

namespace App\Http\Controllers;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Events\MyEvent;
class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $message = $request->input('message'); 
        event(new MyEvent($message));

        $client = new Client([
            'verify' => false 
        ]);

        

        return response()->json(['status' => 'Message sent!']);
    }
}
