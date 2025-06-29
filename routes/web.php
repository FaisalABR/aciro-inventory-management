<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SatuanController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth
Route::post("/login", [AuthController::class, "login"]);
Route::get("/login", [AuthController::class, "index"])->name("login");

Route::middleware(['auth'])->group(function () {
    Route::get("/unauthorized", function () {
        return Inertia::render('Unauthorized');
    });

    Route::get("/home", function () {
        return redirect("/");
    });
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->middleware("permission:view-dashboard");

    // Kelola User
    Route::get("/kelola-user", [UserController::class, 'index'])->middleware("permission:view-kelola-user");
    Route::get("/kelola-user/create", [UserController::class, 'showCreate']);
    Route::post("/kelola-user/create", [UserController::class, 'create']);
    Route::get("/kelola-user/edit/{uuid}", [UserController::class, 'showEdit']);
    Route::put("/kelola-user/edit/{uuid}", [UserController::class, 'update']);
    Route::delete("/kelola-user/delete/{uuid}", [UserController::class, 'destroy']);

    // Kelola Barang Masuk
    Route::get('/barang-masuk', function () {
        return Inertia::render('BarangMasuk', [
            'name' => 'Faisal',
        ]);
    })->middleware("permission:view-barang-masuk");


    // Kelola Master Satuan
    Route::get('/master/satuan', [SatuanController::class, 'index'])->middleware("permission:view-master-satuan");;
    Route::get('/master/satuan/create', [SatuanController::class, 'showCreate']);
    Route::post('/master/satuan/create', [SatuanController::class, 'create']);
    Route::get('/master/satuan/edit/{uuid}', [SatuanController::class, 'showEdit']);
    Route::put('/master/satuan/edit/{uuid}', [SatuanController::class, 'update']);
    Route::delete('/master/satuan/delete/{uuid}', [SatuanController::class, 'destroy']);


    Route::get('/logout', [AuthController::class, "logout"]);


    Route::get('/barang-keluar', function () {
        return Inertia::render('BarangKeluar', [
            'name' => 'Faisal',
        ]);
    })->middleware("permission:view-barang-keluar");

    Route::get('/barang-stock', function () {
        return Inertia::render('Stock', [
            'name' => 'Faisal',
        ]);
    });

    Route::get('/orders', function () {
        return Inertia::render('Order', [
            'name' => 'Faisal',
        ]);
    });

    // Master Page
    Route::get('/master', function () {
        return redirect("/master/satuan");
    });

    Route::get('/master/supplier', function () {
        return Inertia::render('Master/Supplier', [
            'name' => 'Faisal',
        ]);
    });

    Route::get('/master/kategori', function () {
        return Inertia::render('Master/Kategori', [
            'name' => 'Faisal',
        ]);
    });
});
