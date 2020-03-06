<?php

require_once 'app/boootstrap.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use App\Controllers\PageControllers;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$data = json_decode(file_get_contents('php://input'), true);
$response = ['message' => 'API ROUTES WORKS'];

/**
 * HANDLE ALL ROUTES
 * 
 * products | Single product | GET
 * ratings | POST
 */
if (isset($uri[2]))
{
    switch ($uri[2])
    {
        case 'products':
            if (isset($uri[3]))
            {
                $singleProduct = (new PageControllers())->getSingleProduct($uri[3]);
                $response = ["status" => 1, "product" => $singleProduct];
            }
            else {
                $response = (new PageControllers())->getProducts();
            }
            
            break;

        case 'ratings':
            if ($_SERVER["REQUEST_METHOD"] == 'POST')
            {
                $response = (new PageControllers())->storeRating($data);
            }
            else {
                $response = [ "message" => "GET,PUT,DELETE Methods not implementated"];
            } 

            break;

        default:
            $response = ["error" =>  "Unmatched API routes"];
            break;
    }
}

echo json_encode($response);
