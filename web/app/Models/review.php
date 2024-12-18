<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\ReviewReply;

class Review extends Model
{
    use HasFactory;

    // Specify the table name (optional if it matches the plural form of the model)
    protected $table = 'reviews';

    // Define the fillable properties
    protected $fillable = [
        'customer_name', 
        'product_name', 
        'created_at', 
        'updated_at', 
        'rating', 
        'title', 
        'description', 
        'status', 
        'type', 
        'via',
        'image_url'
    ];

    public function replies()
    {
        return $this->hasMany(ReviewReply::class, 'review_id');
    }

    // If you have custom date columns, you can define them here
    protected $dates = ['created_at', 'updated_at'];
}
