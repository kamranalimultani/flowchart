<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\FlowController;
use App\Http\Controllers\FlowSharedController;
use App\Http\Controllers\FormResponseController;
use App\Http\Controllers\FormTemplateController;
use App\Http\Controllers\MockApiController;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/payment/verify', [AuthController::class, 'verifyPayment']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/mock/create', [MockApiController::class, 'create']);
Route::get('/mock/{slug}', [MockApiController::class, 'fetch']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/create-checkout', [AuthController::class, 'createCheckout']);
Route::post('/lemon-squeezy/webhook', [AuthController::class, 'webhook']);
Route::get('/test-api-connection', [AuthController::class, 'testApiConnection']);


// form tempaltes
Route::post('/forms/shared', [FormTemplateController::class, 'fetchFormsForShared']);
Route::post('/form-responses', [FormResponseController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::post('/flows/share/{flow}', [FlowSharedController::class, 'share']);
    Route::apiResource('/form-templates', FormTemplateController::class);
    Route::get('/forms/all', [FormTemplateController::class, 'fetchAll']);

    Route::post('/flows', [FlowController::class, 'store'])->middleware('check.flow.limit');
    Route::get('/flows', [FlowController::class, 'index']);
    Route::put('/flows/{id}', [FlowController::class, 'update']);
    Route::get('/flows/{fileName}', [FlowController::class, 'getFlowByFileName']);
    Route::put('/flow/form-assign/{id}', [FlowController::class, 'assignForm']);
    Route::delete('/flows/{id}', [FlowController::class, 'destroy']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/form-responses/{flowId}/{formTemplateId}/{nodeId}', [FormResponseController::class, 'index']);

    Route::get('/company/users', [AuthController::class, 'companyUsers'])->middleware('check.admin.user');
    Route::post('/users', [AuthController::class, 'store'])->middleware('check.admin.user');
    Route::put('/users/{id}', [AuthController::class, 'update'])->middleware('check.admin.user');
    Route::get('/form-responses/download', [FormResponseController::class, 'downloadCsv'])->middleware('check.admin.user');

});

// Public Blog Routes
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);

// Super Admin Blog Routes
Route::middleware(['auth:sanctum', 'check.superadmin'])->group(function () {
    Route::get('/admin/blogs', [BlogController::class, 'adminIndex']);
    Route::get('/admin/blogs/{id}', [BlogController::class, 'adminShow']);
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);
});