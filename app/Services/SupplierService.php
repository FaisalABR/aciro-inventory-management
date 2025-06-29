<?php

namespace App\Services;

use App\Models\Supplier;

interface SupplierServiceInterface
{
    public function create(array $data);
    public function getAll();
    public function get($uuid);
    public function update($data, $uuid);
    public function delete($uuid);
};

class SupplierService implements SupplierServiceInterface
{
    public function create(array $data)
    {
        $supplier = Supplier::create($data);

        if (!$supplier) {
            return false;
        }

        return true;
    }

    public function getAll()
    {
        $data = Supplier::all();
        return $data;
    }

    public function get($uuid)
    {
        $supplier = Supplier::where('uuid', $uuid)->first();

        if (!$supplier) {
            return false;
        }


        return $supplier;
    }

    public function update($data, $uuid)
    {
        $supplier = Supplier::where('uuid', $uuid)->first();

        if (!$supplier) {
            return false;
        }

        $supplier->update($data);

        return true;
    }

    public function delete($uuid)
    {
        $supplier = Supplier::where('uuid', $uuid)->first();

        if (!$supplier) {
            return false;
        }

        $supplier->delete();
        return true;
    }
}
