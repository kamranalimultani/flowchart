<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FlowController;
use App\Http\Controllers\FormTemplateController;
use App\Http\Controllers\MockApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/mock/create', [MockApiController::class, 'create']);
Route::get('/mock/{slug}', [MockApiController::class, 'fetch']);

// form tempaltes

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('/form-templates', FormTemplateController::class);
    Route::get('/forms/all', [FormTemplateController::class, 'fetchAll']);

    Route::post('/flows', [FlowController::class, 'store']);
    Route::get('/flows', [FlowController::class, 'index']);
    Route::put('/flows/{id}', [FlowController::class, 'update']);
    Route::get('/flows/{fileName}', [FlowController::class, 'getFlowByFileName']);
    Route::put('/flow/form-assign/{id}', [FlowController::class, 'assignForm']);
    Route::delete('/flows/{id}', [FlowController::class, 'destroy']);
    Route::get('/auth/me', [AuthController::class, 'me']);

});