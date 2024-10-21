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
        // Validate the request data for the fields that might be updated
        $request->validate([
            'status' => 'nullable|string|max:255', // Optional field
            'title' => 'nullable|string|max:255', // Optional field
            'description' => 'nullable|string',   // Optional field
            'type' => 'nullable|string',
        ]);

        // Find the review by ID
        $review = Review::find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found'], 404);
        }

        // Update status, title, and description together if they exist in the request
        $review->fill($request->only(['status', 'title', 'description','type']));

        // Save the changes to the database
        $review->save();

        return response()->json(['message' => 'Review updated successfully']);
    }
}