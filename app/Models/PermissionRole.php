<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PermissionRole extends Pivot
{
    /** @use HasFactory<\Database\Factories\PermissionRoleFactory> */
    use HasFactory;

        protected $fillable = ['role_id', 'permission_id'];

    // Relasi ke Role
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    // Relasi ke Permission
    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }

}
