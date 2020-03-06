<?php

namespace App\Controllers;

use App\Config\Database;
use App\Models\Product;
use App\Models\Rating;

class PageControllers extends Database
{

    /**
     * Get All products
     */
    public function getProducts()
    {
        $product = new Product();
        $products = $product->getProducts();
        return $products;
    }

    public function getSingleProduct($id)
    {
        $product = new Product();
        $products = $product->getSingleProduct($id);
        return $products;
    }

    public function storeRating($data)
    {
        $ratings = new Rating();

        try
        {
            $data = [
                "product_id" => $data['product_id'],
                "rating" => $data['rating']
            ];
            $request = $ratings->store($data);
            return [
                "rating" => $request,
                "success" => 1
            ];
        }
        catch (\Exception $ex) {
            return [
                "message" => $ex->getMessage(),
                "success" => 0
            ];
        }
    }

}