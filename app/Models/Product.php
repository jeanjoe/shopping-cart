<?php

namespace App\Models;

use App\Controllers\Crud;


class Product extends Crud
{

    /**
     * GET ALL PRODUCTS
     * 
     * @return array $products
     */
    public function getProducts()
    {
        $query = "SELECT * FROM products";
        $products = $this->getData($query);
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
        $query = "SELECT * FROM products WHERE id=". $id ." LIMIT 1";
        $product = $this->getSingleItem($query);
        return $product;
    }
}
