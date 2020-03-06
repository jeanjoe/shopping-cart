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
        $products = $this->getAll($this->table, '*');
        return $products;
    }

    public function getProductsWithRatings()
    {
        $query = "SELECT product.*, ratings.rating FROM products AS product LEFT JOIN ratings ON ratings.id=product.id";
        $products = $this->customQuery($query);
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
        $product = $this->getSingle($query);
        return $product;
    }
}
