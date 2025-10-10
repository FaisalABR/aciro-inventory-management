<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{

    use HasFactory;

    /**
     * Kolom yang bisa diisi secara mass-assignment.
     */
    protected $fillable = [
        'role',
        'message',
        'is_read',
    ];

    /**
     * Casting otomatis agar tipe data sesuai.
     */
    protected $casts = [
        'is_read' => 'boolean',
    ];

    /**
     * Scope untuk filter berdasarkan role.
     */
    public function scopeForRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope untuk notifikasi yang belum dibaca.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }
}
