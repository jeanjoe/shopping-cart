<?php

namespace App\Config;

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
    public function getAll($table, $fields)
    {
        $data = [];
        $query = $this->executePDOQuery(
            "SELECT product.*, ratings.rating FROM " . $table . " AS product LEFT JOIN ratings ON ratings.id=product.id"
        );
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
    public function getSingle($query)
    {
        $request = $this->executePDOQuery($query);
        $item = $request->fetch(\PDO::FETCH_ASSOC);
        return $item;
    }

    public function create($table, $fields, $values)
    {
        $query = "INSERT INTO " . $table . " (" . $fields . ") VALUES " . $values. " ; ";
        $statement = $this->connection->prepare($query);
        $statement->execute();
        return $this->connection->lastInsertId();
    }

    /**
     * Perform custome Query where user enters raw MySQL Query
     *
     * @param $query
     * @return array $result
     */
    public function customQuery($query)
    {
        $result = [];
        $query = $this->executePDOQuery($query);
        while ($row = $query->fetch(\PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        return $result;
    }

    /**
     * EXECUTE PDO query
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
