<?php

namespace App\Services;

use App\Models\Supplier;

interface SupplierServiceInterface
{
    public function create(array $data);

    public function getAll($search, $perPage);

    public function get($uuid);

    public function update($data, $uuid);

    public function delete($uuid);

    public function getOptions();
}

class SupplierService implements SupplierServiceInterface
{
    public function create(array $data)
    {
        $supplier = Supplier::create($data);

        if (! $supplier) {
            return false;
        }

        return true;
    }

    public function getAll($search, $perPage)
    {
        $query = Supplier::query();
        if ($search) {
            $query->where('name', 'ILIKE', "%{$search}%")->orWhere('contactPerson', 'ILIKE', "%{$search}%");
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    public function get($uuid)
    {
        $supplier = Supplier::where('uuid', $uuid)->first();

        if (! $supplier) {
            return false;
        }

        return $supplier;
    }

    public function update($data, $uuid)
    {
        $supplier = Supplier::where('uuid', $uuid)->first();

        if (! $supplier) {
            return false;
        }

        $supplier->update($data);

        return true;
    }

    public function delete($uuid)
    {
        $supplier = Supplier::where('uuid', $uuid)->first();

        if (! $supplier) {
            return false;
        }

        $supplier->delete();

        return true;
    }

    public function getOptions()
    {
        $data = Supplier::all();

        $options = $data->map(function ($supplier) {
            return [
                'value' => $supplier->supplier_id,
                'label' => $supplier->name,
            ];
        });

        return $options;
    }
}
