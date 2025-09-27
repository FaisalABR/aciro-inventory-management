<?php

namespace App\Http\Controllers;

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

        $paginated_data = $query->paginate($perPage);

        return Inertia::render('Stock', [
            'data'    => $paginated_data,
            'filters' => [
                'search'    => $search,
                'statusROP' => $statusROP,
                'statusITR' => $statusITR,
            ],
        ]);
    }
}
