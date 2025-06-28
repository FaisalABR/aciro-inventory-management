<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;

interface AuthServiceInterface
{
    public function login(array $credentials);
    public function logout();
    public function getUser();
}


class AuthService implements AuthServiceInterface
{

    public function login(array $credentials)
    {
        if (Auth::attempt($credentials)) {
            request()->session()->regenerate();
            return true;
        }

        return false;
    }
    public function logout()
    {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
    }

    public function getUser()
    {
        return 0;
    }
}
