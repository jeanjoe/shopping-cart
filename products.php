<?php

require_once('app/boootstrap.php');
header("Content-Type: application/json");

use App\Models\Product;

$product = new Product();

/**
 * HANDLE ALL PRODUCTS & SINGLE PRODUCTS
 * 
 * if no query data, return all products
 */
if (isset($_GET['product_id']))
{
    $id = $_GET['product_id'];
    $singleProduct = $product->getSingleProduct($id);
    $response = ["status" => 1, "product" => $singleProduct];

    if (!$singleProduct)
    {
        $response = ["status" => 0, "message" => "Unable to find this product"];
    }
    
}
else
{
    $response = $product->getProducts();
}

echo json_encode($response);
