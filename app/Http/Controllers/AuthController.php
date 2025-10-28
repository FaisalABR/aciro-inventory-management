<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use App\Services\AuthServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthServiceInterface $authService)
    {
        $this->authService = $authService;
    }

    public function index()
    {
        if (Auth::check()) {
            return redirect('/');
        }

        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if ($this->authService->login($credentials)) {
            return redirect('/barang-stock')->with('success', 'Anda berhasil login');
        }

        return back()->with(
            'error',
            'Email atau password salah!'
        );
    }

    public function logout()
    {
        $this->authService->logout();

        return redirect('/login');
    }

    public function register(Request $request)
    {
        // Validate input
        $request->validate([
            'name' => 'required',
            'email' => 'required|string|email|max:255|unique:users',
            'noWhatsapp' => 'required',
            'password' => 'required|string',
            'password_confirmation' => 'required',
            'role_id' => 'required'
        ]);

        // Cek manual password confirmation
        if ($request->password !== $request->password_confirmation) {
            return redirect()->back()
                ->withInput() // biar data sebelumnya tetap ada di form
                ->with('error', 'Password dan konfirmasi password tidak sama.');
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'noWhatsapp' => $request->noWhatsapp,
        ]);

        $user->roles()->attach($request->role_id);

        return redirect("/login")->with('success', "Anda berhasil registrasi!");
    }

    public function viewRegister()
    {
        if (Auth::check()) {
            return redirect('/');
        }

        $data = Role::all();

        $options = $data->map(function ($role) {
            return [
                'value' => $role->id,
                'label' => $role->name,
            ];
        });

        return Inertia::render('Register', [
            'data' => [
                'options' => $options
            ]
        ]);
    }
}
