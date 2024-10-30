<?php

namespace App\Http\Controllers;

use App\Models\Email;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
use App\Jobs\SendMassEmail;
use Illuminate\Support\Facades\Log;
use Exception;

class EmailController extends Controller
{
    protected $templatePath;

    public function __construct()
    {
        $this->templatePath = resource_path('views/emails/');
    }

    public function index()
    {
        $emails = Email::all();
        return response()->json($emails);
    }

    public function store(Request $request)
{
    try {
        $validatedData = $request->validate([
            'name_email' => 'required|string|max:255|unique:emails',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'scheduled_time' => 'required|date|after:now',
            'recipient_email' => 'sometimes|required|email',
        ]);

        Log::info('Validated data:', $validatedData);

        $email = Email::create($validatedData);
        
        Log::info('Created email:', $email->toArray());
        
        // Tạm thời comment lại phần này để test việc tạo record
        // $this->handleEmailTemplate($email);
        
        return response()->json([
            'message' => 'Email template created successfully',
            'data' => $email
        ], 201);
        
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation error:', $e->errors());
        return response()->json([
            'error' => 'Validation failed',
            'details' => $e->errors()
        ], 422);
        
    } catch (\Exception $e) {
        Log::error('Error creating email template:', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Failed to create email template',
            'message' => $e->getMessage()
        ], 500);
    }
}

    public function show($email_id)
    {
        if(!$email_id){
            return response()->json([
                'status' => '404',
                'message' => 'Email không tồn tại'
            ]);
        }
        $email = Email::findOrFail($email_id);
        return response()->json($email);
    }

    public function update(Request $request, $email_id)
    {
        $email = Email::findOrFail($email_id);

        $validatedData = $request->validate([
            'name_email' => 'sometimes|required|string|max:255|unique:emails,name_email,' . $email_id,
            'subject' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
            'scheduled_time' => 'sometimes|required|date|after:now',
            'recipient_email' => 'sometimes|required|email',
        ]);

        try {
            $email->update($validatedData);
            $this->handleEmailTemplate($email);
            
            return response()->json($email);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to update email template'], 500);
        }
    }

    public function destroy($email_id)
    {
        $email = Email::findOrFail($email_id);

        try {
            $this->deleteEmailTemplate($email);
            $email->delete();
            return response()->json(null, 204);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to delete email template'], 500);
        }
    }

    protected function handleEmailTemplate(Email $email)
    {
        if (!File::exists($this->templatePath)) {
            File::makeDirectory($this->templatePath, 0755, true);
        }

        $templateFileName = $email->name_email . '.blade.php';
        File::put($this->templatePath . $templateFileName, $this->getTemplateContent());
    }

    protected function deleteEmailTemplate(Email $email)
    {
        $templateFileName = $email->name_email . '.blade.php';
        $fullPath = $this->templatePath . $templateFileName;

        if (File::exists($fullPath)) {
            File::delete($fullPath);
        }
    }

    protected function getTemplateContent()
    {
        return view('email.template-base')->render();
    }

    public function sendEmail(Request $request, $email_id)
    {
        $request->validate([
            'recipient_email' => 'required|email'
        ]);

        try {
            $email = Email::findOrFail($email_id);
            
            if (now()->lt($email->scheduled_time)) {
                return response()->json(['message' => 'Email is scheduled for future delivery'], 422);
            }

            Mail::send('emails.' . $email->name_email, 
                ['email' => $email], 
                function ($message) use ($email, $request) {
                    $message->to($request->recipient_email)
                            ->subject($email->subject);
                }
            );

            return response()->json(['message' => 'Email sent successfully']);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }

    public function sendMassEmail($email_id)
    {
        try {
            $email = Email::findOrFail($email_id);
            
            if (now()->lt($email->scheduled_time)) {
                return response()->json([
                    'message' => 'Email is scheduled for future delivery',
                    'scheduled_time' => $email->scheduled_time
                ], 422);
            }
    
            $users = User::where('has_email', 1)
                        ->whereNotNull('email')
                        ->get();
    
            if ($users->isEmpty()) {
                return response()->json([
                    'message' => 'No eligible recipients found',
                    'total_recipients' => 0
                ], 422);
            }
    
            foreach ($users->chunk(50) as $chunk) {
                SendMassEmail::dispatch($email, $chunk)
                            ->onQueue('emails') 
                            ->delay(now()->addSeconds(3));
            }
    
            return response()->json([
                'message' => 'Mass email job has been queued', 
                'total_recipients' => $users->count()
            ]);
    
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Failed to queue mass email: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get email sending statistics
     */
    public function getEmailStats($email_id)
    {
        try {
            $email = Email::findOrFail($email_id);
            
            return response()->json([
                'email_name' => $email->name_email,
                'total_sent' => $email->sent_count ?? 0,
                'failed_count' => $email->failed_count ?? 0,
                'last_sent' => $email->last_sent_at,
            ]);

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to get email statistics'], 500);
        }
    }

}