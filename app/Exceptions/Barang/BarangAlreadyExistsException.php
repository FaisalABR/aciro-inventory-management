<?php

namespace App\Exceptions\Barang;

use Exception;
use Throwable;

class BarangAlreadyExistsException extends Exception
{
    public function __construct(
        string $message = 'Barang sudah terdaftar.',
        int $code = 422,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }
}
