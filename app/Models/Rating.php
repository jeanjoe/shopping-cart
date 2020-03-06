<?php

namespace App\Models;

use App\Config\Crud;

class Rating extends Crud
{
    /**
     * Define table for the model
     */
    protected $table = 'ratings';

    /**
     * Store the user rating
     *
     * @param array $data
     *
     * @return array $response
     */
    public function store($data = [])
    {
        $response = $this->create($this->table, 'product_id,rating', $this->flattenArray($data));
        return $response;
    }

    public function flattenArray($array = [])
    {
        $outerValue = '';
        foreach($array as $array1) {
            $innerValue = '';
            foreach ($array1 as $value) {
                $innerValue = $innerValue . ''. $value .',';
            }
            $innerValue = '(' . substr($innerValue, 0, -1) .')';
            $outerValue = $outerValue .''. $innerValue .',';
            
        }
        $outerValue = substr($outerValue, 0, -1);
        return $outerValue;
    }

}
