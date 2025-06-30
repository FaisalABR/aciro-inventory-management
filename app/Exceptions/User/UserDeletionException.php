<?php

namespace App\Exceptions\User;

use Exception;
use Throwable;

class UserDeletionException extends Exception
{
    public function __construct(
        string $message = "Pengguna belum terdaftar.",
        int $code = 500,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
