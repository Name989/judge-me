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

    public function create(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'required|string|max:255',
            'product_name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'via' => 'required|string|max:255',
            'image_url'=> 'required|string|max:255'
        ]);             

        try {
            // Explicitly set values to avoid mass assignment issues
            $review = Review::create([
                'customer_name' => $validatedData['customer_name'],
                'rating' => $validatedData['rating'],
                'title' => $validatedData['title'],
                'product_name' => $validatedData['product_name'],
                'description' => $validatedData['description'],
                'status' => $validatedData['status'],
                'type' => $validatedData['type'],
                'via' => $validatedData['via'],
                'image_url' => $validatedData['image_url']
            ]);

            return response()->json([
                'message' => 'Review created successfully',
                'data' => $review
            ], 201);

        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error("Failed to create review: " . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create review',
                'exception'=>  $e->getMessage()
            ], 500);
        }
    }

    public function fetchdata()
{
    // Retrieve only published reviews from the database
    $reviews = Review::where('status', 'Published')->get();
    return response()->json($reviews);
}
}