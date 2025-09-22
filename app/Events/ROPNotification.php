<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ROPNotification implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;
    public $role;

    /**
     * Create a new event instance.
     */
    public function __construct(string $message, string $role)
    {
        $this->message = $message;
        $this->role = $role;
    }

    public function broadcastOn(): array
    {
        return ["private-notifications.{$this->role}"];
    }

    public function broadcastAs(): string
    {
        return 'ROPNotification';
    }
}
