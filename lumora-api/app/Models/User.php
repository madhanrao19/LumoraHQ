<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    /**
     * The students linked to this user (when this user is a Parent).
     */
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'parent_student_links', 'parent_id', 'student_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * The parents linked to this user (when this user is a Student).
     */
    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'parent_student_links', 'student_id', 'parent_id')
            ->withPivot('status')
            ->withTimestamps();
    }

    public function isStudent(): bool
    {
        return $this->role === UserRole::Student;
    }

    public function isParent(): bool
    {
        return $this->role === UserRole::Parent;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }
}
