<?php

namespace App\Models;

use App\Config\Crud;

class Rating extends Crud
{
    /**
     * Define table for the model
     */
    protected $table = 'ratings';

    /**
     * Store the user rating
     *
     * @param array $data
     *
     * @return array $response
     */
    public function store($data = [])
    {
        $data = array_merge($data, ["ip_address" => $this->getIpAddress()]);
        $response = $this->createOrUpdate($this->table, $data, ['rating' => $data['rating']]);
        return $response;
    }

    public function getAll()
    {
        $this->getAll();
    }

    /**
     * Get Client IP Address
     *
     * @return string $ip
     */
    public function getIpAddress()
    {
        $ip = $_SERVER['REMOTE_ADDR'];
        return $ip;
    }

}
