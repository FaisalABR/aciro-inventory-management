<?php

namespace App\Exceptions\User;

use Exception;
use Throwable;

class UserCreationException extends Exception
{
    public function __construct(
        string $message = 'Gagal membuat pengguna.',
        int $code = 500,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
