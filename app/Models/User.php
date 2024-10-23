<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;
    protected $table = 'users';
    protected $primaryKey = 'user_id';

    protected $fillable = [
        'email',
        'name',
        'password',
        'google_id',
        'role',
        'avatar',
        'status',
        'verification_token',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
    ];


    public function getJWTIdentifier()
    {

        return $this->user_id;
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function quizSessions()
    {
        return $this->hasMany(QuizSession::class);
    }
}
