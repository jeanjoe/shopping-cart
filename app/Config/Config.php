<?php

namespace App\Config;

use Symfony\Component\Dotenv\Dotenv;


class Config {

    public function __construct()
    {
        $dotenv = new Dotenv();
        $dotenv->load('.env');
    }
}
