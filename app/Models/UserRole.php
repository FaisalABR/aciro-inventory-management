<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserRole extends Pivot
{
    /** @use HasFactory<\Database\Factories\UserRoleFactory> */
    use HasFactory;

    protected $fillable = ['user_id', 'role_id'];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
