<?php

use App\Http\Controllers\BarangController;
use App\Http\Controllers\BarangKeluarController;
use App\Http\Controllers\PurchaseOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route Anda di sini
Route::get('/barang-by-supplier', [BarangController::class, 'getOptions']);
Route::post('/check-rop', [BarangKeluarController::class, 'checkROP']);
Route::post('/barang-keluar/{uuid}/check-execute', [BarangKeluarController::class, 'checkExecute']);
Route::get('/po-scan/{uuid}', [PurchaseOrderController::class, 'showDetailScan']);
