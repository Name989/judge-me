<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index()
    {
        // Retrieve all reviews from the database
        $reviews = Review::all();
        return response()->json($reviews);
    }

    
   public function updateStatus(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'status' => 'required|string|max:255', // Adjust validation rules as necessary
        ]);

        // Find the review by ID
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        // Update the review status
        $review->status = $request->input('status');
        $review->save();

        return response()->json(['message' => 'Review status updated successfully']);
    }
}