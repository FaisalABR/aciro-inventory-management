<?php

namespace App\Services;

use App\Models\Kategori;

interface KategoriServiceInterface
{
    public function create(array $data);

    public function getAll($search, $perPage);

    public function get($kategori);

    public function update($data, $uuid);

    public function delete($uuid);

    public function getOptions();
}

class KategoriService implements KategoriServiceInterface
{
    public function create(array $data)
    {
        $kategori = Kategori::create($data);

        if (! $kategori) {
            return false;
        }

        return true;
    }

    public function getAll($search = null, $perPage = 10)
    {
        $query = Kategori::query();

        if ($search) {
            $query->where('name', 'ILIKE', "%{$search}%"); // PostgreSQL case-insensitive
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function get($uuid)
    {
        $kategori = Kategori::where('uuid', $uuid)->first();

        if (! $kategori) {
            return false;
        }

        return $kategori;
    }

    public function update($data, $uuid)
    {
        $kategori = Kategori::where('uuid', $uuid)->first();

        if (! $kategori) {
            return false;
        }

        $kategori->update($data);

        return true;
    }

    public function delete($uuid)
    {
        $kategori = Kategori::where('uuid', $uuid)->first();

        if (! $kategori) {
            return false;
        }

        $kategori->delete();

        return true;
    }

    public function getOptions()
    {
        $data = Kategori::all();

        $options = $data->map(function ($satuan) {
            return [
                'value' => $satuan->kategori_id,
                'label' => $satuan->name,
            ];
        });

        return $options;
    }
}
