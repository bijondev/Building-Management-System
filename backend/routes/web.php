<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/emails', function () {
    return '<h1>Email Previews</h1>
            <ul>
                <li><a href="/test-email/created">Bill Created Email</a></li>
                <li><a href="/test-email/paid">Bill Paid Email</a></li>
            </ul>';
});

Route::get('/test-email/created', function () {
    $bill = App\Models\Bill::with('flat', 'category')->first();
    if (!$bill) return "No bills found.";
    return new App\Mail\BillCreatedMail($bill);
});

Route::get('/test-email/paid', function () {
    $bill = App\Models\Bill::with('flat', 'category')->first();
    if (!$bill) return "No bills found.";
    // create a fake paid status for preview if needed, or just use the bill
    $bill->status = 'paid'; 
    return new App\Mail\BillPaidMail($bill);
});
