<?php

namespace App\Jobs;

use App\Services\WhatsappService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendWhatsappJob implements ShouldQueue
{
    use Queueable;

    protected $text;
    protected $phone;

    /**
     * Create a new job instance.
     */
    public function __construct($phone, $text)
    {
        $this->text = $text;
        $this->phone = $phone;
    }

    /**
     * Execute the job.
     */
    public function handle(WhatsappService $whatsapp): void
    {
        $whatsapp->sendWA($this->phone, $this->text);
    }
}
