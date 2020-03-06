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
    public function getData($table, $fields)
    {
        $data = [];
        $query = $this->executePDOQuery(
            "SELECT product.*, ratings.rating FROM " . $table  ." AS product LEFT JOIN ratings ON ratings.id=product.id"
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
    public function getSingleItem($query)
    {
        $request = $this->executePDOQuery($query);
        $item = $request->fetch(\PDO::FETCH_ASSOC);
        return $item;
    }

    /**
     * Create or Update a resource
     *
     * @param string $table
     * @param array $data
     * @param array $updateData
     *
     * @return boolean
     */
    public function createOrUpdate($table, $data = [], $updateData = [])
    {
        $keys = array_keys($data);
        $values = $this->setValueFieldsFromArray($data);
        $updateString = $this->stringifyArrayKeyValueWithComma($updateData);

        $query = "INSERT INTO " . $table . " (" . implode(',', $keys) . ") VALUES (" . $values . ") ON DUPLICATE KEY UPDATE " . $updateString;
        $statement = $this->connection->prepare($query);
        $statement->execute($data);
        return $this->connection->lastInsertId();
    }

    /**
     * SET Table value fields from array keys
     *
     * @param array $data
     *
     * @return string without last comma ,
     */
    public function setValueFieldsFromArray($data = [])
    {

        $string = '';
        $keys = array_keys($data);
        foreach ($keys as $key) {
            $string = $string . ':' . $key . ',';
        }
        return substr($string, 0, -1);
    }

    /**
     * Stringify Array Key Value with comma
     *
     * @param array $data
     *
     * @return string without last comma
     */
    public function stringifyArrayKeyValueWithComma($array = [])
    {
        $stringData = '';
        foreach ($array as $key => $value) {
            $stringData = $stringData . '' . $key . '=' . $value . ',';
        }
        return substr($stringData, 0, -1);
    }

    public function customQuery($query)
    {
        $result = $this->executePDOQuery($query);
        return $result;
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
