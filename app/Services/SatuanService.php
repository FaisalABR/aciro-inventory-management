<?php

namespace App\Services;

use App\Models\Satuan;

interface SatuanServiceInterface
{
    public function create(array $data);
    public function getAll();
    public function get($satuan);
    public function update($data, $uuid);
    public function delete($uuid);
    public function getOptions();
};

class SatuanService implements SatuanServiceInterface
{
    public function create(array $data)
    {
        $satuan = Satuan::create($data);

        if (!$satuan) {
            return false;
        }

        return true;
    }

    public function getAll()
    {
        $data = Satuan::all();
        return $data;
    }

    public function get($uuid)
    {
        $satuan = Satuan::where('uuid', $uuid)->first();

        if (!$satuan) {
            return false;
        }


        return $satuan;
    }

    public function update($data, $uuid)
    {
        $satuan = Satuan::where('uuid', $uuid)->first();

        if (!$satuan) {
            return false;
        }

        $satuan->update($data);

        return true;
    }

    public function delete($uuid)
    {
        $satuan = Satuan::where('uuid', $uuid)->first();

        if (!$satuan) {
            return false;
        }

        $satuan->delete();
        return true;
    }

    public function getOptions()
    {
        $data = Satuan::all();

        $options = $data->map(function ($satuan) {
            return [
                'value' => $satuan->id,
                'label' => $satuan->name,
            ];
        });

        return $options;
    }
}
