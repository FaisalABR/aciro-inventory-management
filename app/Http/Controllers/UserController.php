<?php

namespace App\Http\Controllers;

use App\Exceptions\User\EmailAlreadyExistsException;
use App\Exceptions\User\UserCreationException;
use App\Exceptions\User\UserDeletionException;
use App\Services\UserServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    private $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        try {
            $search  = $request->input('search');
            $perPage = $request->input('per_page', 10); // default 10
            $page    = $request->input('page', 1);

            $users = $this->userService->getAllUsers($search, $perPage);

            return Inertia::render('KelolaUser/Index', [
                'data'    => $users,
                'filters' => [
                    'search' => $search,
                ],
                'message' => 'Sukses mengirim data',
            ]);
        } catch (\Exception $e) {
            return redirect('/kelola-user')->with('error', $e->getMessage());
        }
    }

    public function showCreate()
    {
        return Inertia::render('KelolaUser/FormUser', [
            'isUpdate' => false,
        ]);
    }

    public function showEdit($uuid)
    {
        try {
            $user = $this->userService->getUserByUUID($uuid);

            return Inertia::render('KelolaUser/FormUser', [
                'isUpdate' => true,
                'data'     => $user,
            ]);
        } catch (UserCreationException $e) {
            return redirect('/kelola-user')->with('error', $e->getMessage());
        } catch (\Exception $e) {
            return redirect('/kelola-user')->with('error', 'Terjadi kesalahan server saat mengambil data pengguna.');
        }
    }

    public function create(Request $request)
    {
        try {
            $validated = $request->validate([
                'name'       => 'required',
                'email'      => 'required|email',
                'password'   => 'required',
                'noWhatsapp' => 'required',
                'roles'      => 'required',
            ]);

            $this->userService->create($validated);

            return redirect('/kelola-user')->with('success', 'User berhasil ditambahkan!');
        } catch (EmailAlreadyExistsException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (UserCreationException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Terjadi error tak terduga saat membuat pengguna: '.$e->getMessage(), ['exception' => $e]);

            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }

    public function destroy($uuid)
    {
        try {
            $this->userService->delete($uuid);

            return redirect()->back()->with('success', 'User berhasil dihapus!');
        } catch (UserDeletionException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Terjadi error tak terduga saat menghapus pengguna: '.$e->getMessage(), ['exception' => $e]);

            return redirect()->back()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }

    public function update(Request $request, $uuid)
    {
        try {

            $validated = $request->validate([
                'name'       => 'required',
                'email'      => 'required|email',
                'noWhatsapp' => 'required',
                'roles'      => 'required',
            ]);

            $result = $this->userService->update($validated, $uuid);
            if (! $result) {
                return redirect()->back()->with('error', 'User gagal diperbaharui!');
            }

            return redirect('/kelola-user')->with('success', 'User berhasil diperbaharui!');
        } catch (EmailAlreadyExistsException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (UserCreationException $e) {
            return redirect()->back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Terjadi error tak terduga saat membuat pengguna: '.$e->getMessage(), ['exception' => $e]);

            return redirect()->back()->withInput()->with('error', 'Terjadi kesalahan server. Silakan coba lagi nanti.');
        }
    }
}
