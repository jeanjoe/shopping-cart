<?php

namespace App\Config;

use App\Config\Config;

class Database extends config
{
    private $host;
    private $user;
    private $password;
    private $database;
    private $dns;

    protected $connection;

    /**
     * Create Databse Connection
     * @return object $connection;
     */
    public function __construct()
    {
        parent::__construct();

        $this->database = $_ENV['DB_NAME'];
        $this->host = $_ENV['DB_HOST'];
        $this->user = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASSWORD'];
        $this->dns = "mysql:host=". $this->host .";dbname=". $this->database;

        try
        {
            $this->connection = new \PDO($this->dns, $this->user, $this->password);
            $this->connection->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            return $this->connection;
        }
        catch (\PDOException $ex)
        {
            die("Unable to establish Connection => " . $ex); 
        }
    }
    
}
