<?php

namespace App\Services;

use App\Exceptions\User\EmailAlreadyExistsException;
use App\Exceptions\User\UserCreationException;
use App\Exceptions\User\UserDeletionException;
use App\Models\User;
use App\Models\UserRole;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

interface UserServiceInterface
{
    public function create(array $data);

    public function getAllUsers($search, $perPage);

    public function getUserByUUID($uuid);

    public function update($data, $uuid);

    public function delete($uuid);
}

class UserService implements UserServiceInterface
{
    public function create(array $data)
    {
        if (User::where('email', $data['email'])->exists()) {
            throw new EmailAlreadyExistsException;
        }

        try {
            DB::beginTransaction();
            $user = User::create(
                [
                    'name'       => $data['name'],
                    'email'      => $data['email'],
                    'password'   => $data['password'],
                    'noWhatsapp' => $data['noWhatsapp'],
                ]
            );

            UserRole::create([
                'user_id' => $user['user_id'],
                'role_id' => $data['roles'],
            ]);

            DB::commit();

            return $user;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Gagal membuat pengguna' . $e->getMessage(), ['exception' => $e]);
            throw new UserCreationException('Terjadi masalah saat membuat pengguna. Silakan coba lagi nanti.');
        }
    }

    public function getAllUsers($search = null, $perPage = 10)
    {
        try {
            $data = User::select('user_id', 'uuid', 'name', 'email', 'noWhatsapp')->with(['roles:id,name'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                            ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"])
                            ->orWhereRaw('LOWER("noWhatsapp") LIKE ?', ["%{$search}%"]);
                    });
                })->paginate($perPage)
                ->withQueryString();

            return $data;
        } catch (\Exception $e) {
            Log::error('Gagal mendapatkan semua user ' . $e->getMessage(), ['exception' => $e]);
            throw new Exception('Terjadi kesalahan dalam server');
        }
    }

    public function getUserByUUID($uuid)
    {
        try {
            $user = User::where('uuid', $uuid)->with(['roles:id,name'])->firstOrFail();

            return $user;
        } catch (\Exception $e) {
            Log::error('Gagal mendapatkan pengguna denga ID: ' . $e->getMessage(), ['exception' => $e]);
            throw new UserCreationException('Pengguna tidak ditemukan');
        }
    }

    public function update($data, $uuid)
    {
        if (User::where('email', $data['email'])->exists()) {
            throw new EmailAlreadyExistsException;
        }
        try {
            $user          = User::where('uuid', $uuid)->with(['roles:id,name'])->first();
            $currentRoleId = $user['roles'][0]['id'];
            $newRoleId     = $data['roles'];

            if ($currentRoleId != $newRoleId) {
                $userRole = UserRole::where('user_id', $user['user_id'])
                    ->where('role_id', $currentRoleId)->first();

                $userRole->update([
                    'role_id',
                    $newRoleId,
                ]);
            }

            $user->update([
                'name'       => $data['name'],
                'email'      => $data['email'],
                'noWhatsapp' => $data['noWhatsapp'],
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Gagal memperbaharui user: ' . $e->getMessage(), ['exception' => $e]);
            throw new UserCreationException('Terjadi masalah saat update pengguna. Silakan coba lagi nanti.');
        }
    }

    public function delete($uuid)
    {
        $user = User::where('uuid', $uuid)->first();

        if (! $user) {
            throw new UserDeletionException('Pengguna belum terdaftar');
        }

        try {
            $user->delete();

            return true;
        } catch (\Exception $e) {
            Log::error("Gagal menghapus user dengan ID {$uuid}" . $e->getMessage(), ['exception' => $e]);
            throw new UserDeletionException('Terjadi kesalahan dalam menghapus user. Silahkan coba lagi nanti');
        }
    }
}
