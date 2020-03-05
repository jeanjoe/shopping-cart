<?php

namespace App\Config;

use Symfony\Component\Dotenv\Dotenv;


class Env {

    public function __construct()
    {
        $dotenv = new Dotenv();
        $dotenv->load('.env');
    }
}
