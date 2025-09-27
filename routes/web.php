<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BarangController;
use App\Http\Controllers\BarangKeluarController;
use App\Http\Controllers\BarangMasukController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HeaderDeadstockController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', [AuthController::class, 'index'])->name('login');

// Supplier View
Route::get('/suppliers/{uuid}/views', [PurchaseOrderController::class, 'showSupplierPortal']);
Route::put('/suppliers/{uuid}/views', [PurchaseOrderController::class, 'konfirmasi']);

Route::middleware(['auth'])->group(function () {
    Route::get('/unauthorized', function () {
        return Inertia::render('Unauthorized');
    });

    Route::get('/home', function () {
        return redirect('/');
    });

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->middleware('permission:view-dashboard');

    // Kelola User
    Route::get('/kelola-user', [UserController::class, 'index'])->middleware('permission:view-kelola-user');
    Route::get('/kelola-user/create', [UserController::class, 'showCreate']);
    Route::post('/kelola-user/create', [UserController::class, 'create']);
    Route::get('/kelola-user/edit/{uuid}', [UserController::class, 'showEdit']);
    Route::put('/kelola-user/edit/{uuid}', [UserController::class, 'update']);
    Route::delete('/kelola-user/delete/{uuid}', [UserController::class, 'destroy']);

    // Kelola Master Satuan
    Route::get('/master/satuan', [SatuanController::class, 'index'])->middleware('permission:view-master-satuan');
    Route::get('/master/satuan/create', [SatuanController::class, 'showCreate']);
    Route::post('/master/satuan/create', [SatuanController::class, 'create']);
    Route::get('/master/satuan/edit/{uuid}', [SatuanController::class, 'showEdit']);
    Route::put('/master/satuan/edit/{uuid}', [SatuanController::class, 'update']);
    Route::delete('/master/satuan/delete/{uuid}', [SatuanController::class, 'destroy']);

    // Kelola Master supplier
    Route::get('/master/supplier', [SupplierController::class, 'index'])->middleware('permission:view-master-supplier');
    Route::get('/master/supplier/create', [SupplierController::class, 'showCreate']);
    Route::post('/master/supplier/create', [SupplierController::class, 'create']);
    Route::get('/master/supplier/edit/{uuid}', [SupplierController::class, 'showEdit']);
    Route::put('/master/supplier/edit/{uuid}', [SupplierController::class, 'update']);
    Route::delete('/master/supplier/delete/{uuid}', [SupplierController::class, 'destroy']);

    // Kelola Master Barang
    Route::get('/master/barang', [BarangController::class, 'index']);
    Route::get('/master/barang/create', [BarangController::class, 'showCreate']);
    Route::post('/master/barang/create', [BarangController::class, 'create']);
    Route::get('/master/barang/edit/{uuid}', [BarangController::class, 'showEdit']);
    Route::put('/master/barang/edit/{uuid}', [BarangController::class, 'update']);
    Route::delete('/master/barang/delete/{uuid}', [BarangController::class, 'destroy']);

    // Kelola Barang Masuk
    Route::get('/barang-masuk', [BarangMasukController::class, 'index'])->middleware('permission:view-barang-masuk');
    Route::get('/barang-masuk/create', [BarangMasukController::class, 'showCreate']);
    Route::get('/barang-masuk/{uuid}', [BarangMasukController::class, 'showDetail']);
    Route::post('/barang-masuk/create', [BarangMasukController::class, 'create']);
    Route::delete('/barang-masuk/delete/{uuid}', [BarangMasukController::class, 'destroy']);

    // Kelola Permintaan Barang Keluar
    Route::get('/permintaan-barang-keluar', [BarangKeluarController::class, 'index'])->middleware('permission:view-permintaan-barang-keluar');
    Route::get('/permintaan-barang-keluar/create', [BarangKeluarController::class, 'showCreate']);
    Route::get('/permintaan-barang-keluar/{uuid}', [BarangKeluarController::class, 'showDetail']);
    Route::post('/permintaan-barang-keluar/create', [BarangKeluarController::class, 'create']);
    Route::put('/permintaan-barang-keluar/{uuid}/approved', [BarangKeluarController::class, 'verifikasi']);

    // Kelola Barang Keluar
    Route::get('/barang-keluar', [BarangKeluarController::class, 'indexEksekusi']);
    Route::post('barang-keluar/{uuid}/execute', [BarangKeluarController::class, 'execute']);

    // View Stock
    Route::get('/barang-stock', [StockController::class, 'index']);

    // Kelola Purchase Order
    Route::get('/purchase-orders', [PurchaseOrderController::class, 'index']);
    Route::get('/purchase-orders/create', [PurchaseOrderController::class, 'showCreate']);
    Route::post('/purchase-orders/create', [PurchaseOrderController::class, 'create']);
    Route::get('/purchase-orders/{uuid}', [PurchaseOrderController::class, 'showDetail']);
    Route::get('/purchase-orders/edit/{uuid}', [PurchaseOrderController::class, 'showEdit']);
    Route::put('/purchase-orders/edit/{uuid}', [PurchaseOrderController::class, 'update']);
    Route::put('/purchase-orders/{uuid}/approved', [PurchaseOrderController::class, 'verifikasi']);

    // Kelola Laporan Deadstock
    Route::get('/laporan-deadstocks', [HeaderDeadstockController::class, 'index']);
    Route::post('/laporan-deadstocks/create', [HeaderDeadstockController::class, 'evaluasiITR']);
    Route::get('/laporan-deadstocks/{uuid}', [HeaderDeadstockController::class, 'showDetail']);

    Route::get('/logout', [AuthController::class, 'logout']);

    // Master Page
    Route::get('/master', function () {
        return redirect('/master/satuan');
    });

    Route::get('/master/kategori', function () {
        return Inertia::render('Master/Kategori', [
            'name' => 'Faisal',
        ]);
    });
});
