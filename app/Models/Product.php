<?php

namespace App\Models;

use App\Config\Crud;

class Product extends Crud
{
    protected $table = 'products';

    /**
     * GET ALL PRODUCTS
     *
     * @return array $products
     */
    public function getProducts()
    {
        $products = $this->getData($this->table, '*');
        return $products;
    }

    /**
     * GET SINGLE PRODUCT
     *
     * @param integer $id
     * @return object $product
     */
    public function getSingleProduct($id)
    {
        $query = "SELECT * FROM products WHERE id=" . $id . " LIMIT 1";
        $product = $this->getSingleItem($query);
        return $product;
    }
}
