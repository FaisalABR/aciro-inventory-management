<?php

namespace App\Services;

interface WhatsappServiceInterface
{
    public function sendWA($direction, $message);
}

class WhatsappService implements WhatsappServiceInterface
{
    protected $url;

    protected $secret;

    protected $account;

    public function __construct()
    {
        $this->url     = config('services.whapify.url');
        $this->secret  = config('services.whapify.key');
        $this->account = config('services.whapify.account');
    }

    public function sendWA($direction, $message)
    {
        $data = [
            'secret'    => $this->secret,
            'account'   => $this->account,
            'recipient' => $direction,
            'type'      => 'text',
            'message'   => $message,
        ];

        // Initialize cURL session
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        // Execute the request
        $response  = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        // Handle the response
        if ($http_code === 200) {
            echo 'Success: '.$response;

            return [
                'success' => true,
                'message' => 'Succesfully send whatsapp',
            ];
        } else {
            echo 'Error: HTTP Code '.$http_code.', Response: '.$response;

            return [
                'success' => false,
                'message' => 'Failed send whatsapp',
            ];
        }

        // Close cURL session
        curl_close($ch);
    }
}
