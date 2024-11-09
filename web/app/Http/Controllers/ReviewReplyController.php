<?php

namespace App\Http\Controllers;
use App\Models\ReviewReply;
use Illuminate\Http\Request;

class ReviewReplyController extends Controller
{
     public function index()
    {
        // Retrieve all reviews from the database
        $reviewReply = ReviewReply::all();
        return response()->json($reviewReply);
    }

    public function update(Request $request, $id){

        $request->validate([
            'reply' => 'required|string',
        ]);

        $reviewReply = ReviewReply::find($id);

          if (!$reviewReply) {
            return response()->json(['message' => 'Review not found'], 404);
        }
         $reviewReply->fill($request->only(['reply']));

         $reviewReply->save();

         return response()->json(['message' => 'Review updated successfully']);
    }

   public function create(Request $request)
{
    $request->validate([
        'review_id' => 'required|exists:reviews,id',
        'reply' => 'required|string',
    ]);

    try {
        // Explicitly set values to avoid mass assignment issues
        $reviewReply = ReviewReply::create([
            'review_id' => $request->input('review_id'),
            'reply' => $request->input('reply'),
        ]);

        return response()->json(['message' => 'Review reply created successfully', 'data' => $reviewReply], 201);

    } catch (\Exception $e) {
        // Catch and log any errors
        \Log::error("Failed to create review reply: " . $e->getMessage());
        return response()->json(['message' => 'Failed to create review reply'], 500);
    }
}
public function delete(Request $request, $id)
{
    $reviewReply = ReviewReply::find($id);
    if (!$reviewReply) {
        return response()->json(['message' => 'Review reply not found'], 404);
        }
        $reviewReply->delete();
        return response()->json(['message' => 'Review reply deleted successfully']);
}

}
