<?php

namespace App\Controllers;

use App\Models\Product;
use App\Models\Rating;

class PageControllers
{
    /**
     * GET All products
     */
    public function getProducts()
    {
        $product = new Product();
        $products = $product->getProductsWithRatings();
        return $products;
    }

    /**
     * GET single Product
     */
    public function getSingleProduct($id)
    {
        $product = new Product();
        $products = $product->getSingleProduct($id);
        return $products;
    }

    /**
     * POST product ratings
     */
    public function storeRating($data)
    {
        $ratings = new Rating();

        try
        {
            $request = $ratings->store($data);
            return $request;
        }
        catch (\Exception $ex) {
            return [
                "message" => $ex->getMessage(),
                "success" => 0
            ];
        }
    }

}