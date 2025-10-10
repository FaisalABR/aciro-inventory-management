<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('notifications.{role}', function ($user, $role) {

    if (! $user) {
        Log::warning('No user found in broadcast channel authorization');

        return false;
    }

    // Super admin has access to all channels
    $isSuperAdmin = $user->hasRole('admin_sistem');
    $hasRole      = $user->hasRole($role);
    $authorized   = $isSuperAdmin || $hasRole;

    Log::info('Role check result', [
        'user_id'        => $user->user_id,
        'role'           => $role,
        'has_role'       => $hasRole,
        'is_super_admin' => $isSuperAdmin,
        'authorized'     => $authorized,
    ]);

    return $authorized;
});
