<?php

namespace App\Exceptions\User;

use Exception;
use Throwable;

class EmailAlreadyExistsException extends Exception
{
    public function __construct(
        string $message = "Email sudah terdaftar.",
        int $code = 422,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
