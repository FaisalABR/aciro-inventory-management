<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserRole;

interface UserServiceInterface
{
    public function create(array $data);
    public function getAllUsers();
    public function getUserByUUID($uuid);
    public function update($data, $uuid);
    public function delete($uuid);
};

class UserService implements UserServiceInterface
{
    public function create(array $data)
    {
        $user = User::create(
            [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'noWhatsapp' => $data['noWhatsapp'],
            ]
        );

        if (!$user) {
            return false;
        }

        UserRole::create([
            "user_id" => $user["id"],
            "role_id" => $data["roles"]
        ]);

        return true;
    }

    public function getAllUsers()
    {
        $data = User::select('id', 'uuid', 'name', 'email', 'noWhatsapp')->with(['roles:id,name'])->get();
        return $data;
    }

    public function getUserByUUID($uuid)
    {
        $user = User::where('uuid', $uuid)->with(['roles:id,name'])->first();

        if (!$user) {
            return false;
        }


        return $user;
    }

    public function update($data, $uuid)
    {
        $user = User::where('uuid', $uuid)->with(['roles:id,name'])->first();
        $currentRoleId = $user["roles"][0]["id"];
        $newRoleId = $data['roles'];

        if (!$user) {
            return false;
        }

        if ($currentRoleId != $newRoleId) {
            $userRole = UserRole::where('user_id', $user["id"])
                ->where('role_id', $currentRoleId)->first();

            $userRole->update([
                'role_id',
                $newRoleId
            ]);
        }

        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'noWhatsapp' => $data['noWhatsapp'],
        ]);


        return true;
    }

    public function delete($uuid)
    {
        $user = User::where('uuid', $uuid)->first();

        if (!$user) {
            return false;
        }

        $user->delete();
        return true;
    }
}
