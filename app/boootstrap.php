<?php

use Symfony\Component\Dotenv\Dotenv;

require __DIR__ . '/../vendor/autoload.php';

/**
 * Auto load .env file
 */
$dotenv = new Dotenv();
$dotenv->load('.env');
