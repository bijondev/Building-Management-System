<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class SendBillNotification implements ShouldQueue
{
    use Queueable;

    public $bill;
    public $type;

    /**
     * Create a new job instance.
     */
    public function __construct($bill, $type)
    {
        $this->bill = $bill;
        $this->type = $type;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $bill = $this->bill; 
        $bill->load('flat.tenant');

        $tenant = $bill->flat->tenant;
        
        if (!$tenant) {
            return; 
        }

        $email = $tenant->email;

        if ($this->type === 'created') {
            \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\BillCreatedMail($bill));
        } elseif ($this->type === 'paid') {
            \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\BillPaidMail($bill));
        }
    }
}
