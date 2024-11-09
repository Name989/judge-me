<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ReviewReplyController;
use App\Http\Controllers\ImageController;
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

Route::get('/', function () {
    return "Hello API";
});

Route::post('/reviews/{id}', [ReviewController::class, 'updateStatus']);
Route::post('/review-reply/{id}', [ReviewReplyController::class, 'update']);
Route::post('/review-reply', [ReviewReplyController::class, 'create']);
Route::delete('/review-reply/{id}', [ReviewReplyController::class, 'delete']);
Route::get('/reviews/fetchdata', [ReviewController::class, 'fetchdata']);
Route::get('/reviews/data', [ReviewController::class, 'index']);
Route::post('/reviews', [ReviewController::class, 'create']);
Route::post('/upload-image', [ImageController::class, 'uploadImage']);