<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FlowController;
use App\Http\Controllers\FormTemplateController;
use App\Http\Controllers\MockApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/mock/create', [MockApiController::class, 'create']);
Route::get('/mock/{slug}', [MockApiController::class, 'fetch']);

// form tempaltes
Route::apiResource('form-templates', FormTemplateController::class);

// Route::middleware('auth:sanctum')->group(function () {
Route::post('/flows', [FlowController::class, 'store']);
Route::get('/flows', [FlowController::class, 'index']);
Route::put('/flows/{id}', [FlowController::class, 'update']);
Route::delete('/flows/{id}', [FlowController::class, 'destroy']);
