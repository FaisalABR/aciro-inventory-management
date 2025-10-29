<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $statusITR = $request->input('statusITR', null);
        $statusROP = $request->input('statusROP', null);
        $perPage   = $request->input('per_page', null);
        $search    = $request->input('search');

        $query = Stock::with(['barangs']);

        if ($search) {
            $query->whereHas('barangs', function ($q) use ($search) {
                $q->where('name', 'ILIKE', "%{$search}%");
            });
        }

        if ($statusITR || $statusROP) {
            $query->where(function ($q) use ($statusITR, $statusROP) {
                if ($statusITR) {
                    $q->where('status_itr', 'ILIKE', "%{$statusITR}%");
                }
                if ($statusROP) {
                    $q->orWhere('status_rop', 'ILIKE', "%{$statusROP}%");
                }
            });
        }

        $aggregateKategori = Kategori::with([
            // Load relasi barangs, lalu load relasi stocks di dalam barangs
            'barang.stock' => function ($query) use ($request) {
                // Kita bisa menerapkan filter ROP/ITR/Search di sini, 
                // tapi akan memengaruhi baris yang ditampilkan.

                // Contoh: Filter berdasarkan nama barang
                if ($request->search) {
                    $query->whereHas('barangs', function ($q) use ($request) {
                        $q->where('name', 'ILIKE', "%{$request->search}%");
                    });
                }
            }
        ])
            // Filter kategori berdasarkan nama jika ada
            ->when($request->search, function ($query) use ($request) {
                return $query->orWhere('name', 'ILIKE', "%{$request->search}%");
            })
            ->get();


        $paginated_data = $query->paginate($perPage);

        return Inertia::render('Stock', [
            'data'    => [
                'per_barang' => $paginated_data,
                'aggregate_kategori' => $aggregateKategori,
            ],
            'filters' => [
                'search'    => $search,
                'statusROP' => $statusROP,
                'statusITR' => $statusITR,
            ],
        ]);
    }
}
