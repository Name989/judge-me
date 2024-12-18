<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Review;
class ReviewReply extends Model
{
    use HasFactory;
     protected $table = 'review_reply';

    protected $fillable = [
        'review_id',
        'reply',
    ];

     public function review()
    {
        return $this->belongsTo(Review::class, 'review_id');
    }
}
