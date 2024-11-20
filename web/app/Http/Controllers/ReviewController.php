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
        // // Validate the request data
        // $validatedData = $request->validate([
        //     'customer_name' => 'required|string|max:255',
        //     'rating' => 'required|integer|min:1|max:5',
        //     'title' => 'required|string|max:255',
        //     'product_name' => 'required|string|max:255',
        //     'description' => 'required|string|max:255',
        //     'status' => 'required|string|max:255',
        //     'type' => 'required|string|max:255',
        //     'via' => 'required|string|max:255',
           
        // ]);             

        try {
            // Explicitly set values to avoid mass assignment issues
            $review = Review::firstOrcreate([
                'customer_name' => $request->customer_name,
                'rating' =>$request->rating,
                'title' =>$request->title,
                'product_name' => $request->product_name,
                'description' => $request->description,
                'status' => $request->status,
                'type' => $request->type,
                'via' => $request->via,
                'product_Id' => $request->product_Id

                
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

    public function fetchdata(Request $request)
{
    // Retrieve only published reviews from the database
     $productId = $request->input('product_Id');

    $reviews = Review::where('status', 'Published')
    ->where('product_Id', $productId)
    ->get();
    return response()->json($reviews);
}
}