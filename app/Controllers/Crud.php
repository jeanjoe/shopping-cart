<?php

namespace App\Controllers;

use App\Config\Database;


class Crud extends Database
{

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Handle FETCH HTTP Requests
     * 
     * @param string $query
     * @return array $data
     */
    public function getData($query)
    {
        $data = [];
        $query = $this->executePDOQuery($query);
        while ($row = $query->fetch(\PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }
        return $data;
    }

    /**
     * SINGLE ITEM HTTP REQUEST
     * 
     * @param string $query - provide query to fetch single item
     * 
     * @return object $item - return single item from database
     */
    public function getSingleItem($query)
    {
        $request = $this->executePDOQuery($query);
        $item = $request->fetch(\PDO::FETCH_ASSOC);
        return $item;
    }

    /**
     * EXECUTE PDO QUERY
     * 
     * @param string $query
     * 
     * @return object $response
     */
    public function executePDOQuery($query)
    {
        $execute = $this->connection->query($query);
        return $execute;
    }
}