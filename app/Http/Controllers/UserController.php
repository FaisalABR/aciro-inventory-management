<?php

namespace App\Http\Controllers;

use App\Services\UserServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    private $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $users = $this->userService->getAllUsers();

        return Inertia::render('KelolaUser/Index', [
            'data' => $users,
            'message' => "Sukses mengirim data"
        ]);
    }

    public function showCreate()
    {
        return Inertia::render('KelolaUser/FormUser', [
            "isUpdate" => false,
        ]);
    }

    public function showEdit($uuid)
    {
        $user = $this->userService->getUserByUUID($uuid);

        if (!$user) {
            return redirect()->back()->with("error", "Tidak ada user ini");
        }

        return Inertia::render('KelolaUser/FormUser', [
            "isUpdate" => true,
            "data" => $user,
        ]);
    }


    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'noWhatsapp' => 'required',
            'roles' => 'required',
        ]);

        $user = $this->userService->create($validated);

        if (!$user) {
            return redirect()->back()->with('error', 'User gagal ditambahkan!');
        }

        return redirect('/kelola-user')->with('success', 'User berhasil ditambahkan!');
    }

    public function destroy($uuid)
    {

        $result = $this->userService->delete($uuid);

        if (!$result) {
            return redirect()->back()->with('error', 'User gagal dihapus!');
        }

        return redirect()->back()->with('success', 'User berhasil dihapus!');
    }

    public function update(Request $request, $uuid)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'noWhatsapp' => 'required',
            'roles' => 'required',
        ]);

        $result = $this->userService->update($validated, $uuid);
        if (!$result) {
            return redirect()->back()->with('error', 'User gagal diperbaharui!');
        }

        return redirect('/kelola-user')->with('success', 'User berhasil diperbaharui!');
    }
}
