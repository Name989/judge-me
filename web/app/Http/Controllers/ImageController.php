<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str; // Add this line
class ImageController extends Controller
{
    public function uploadImage(Request $request)
    {
        // Validate the incoming request to ensure the 'image' field is present
        $request->validate([
            'image' => 'required|string',
        ]);

        // Extract the base64 string from the request
        $base64String = $request->input('image');

        // Ensure the string is valid and contains image data
        if (preg_match('/^data:image\/(png|jpeg|jpg);base64,/', $base64String)) {
            // Remove the base64 metadata (i.e., "data:image/png;base64," or similar)
            $base64String = preg_replace('/^data:image\/(png|jpeg|jpg);base64,/', '', $base64String);

            // Generate a random file name
            $fileName = Str::random(16) . '.'. $this->getImageExtension($base64String);

            // Decode the base64 string into binary data
            $imageData = base64_decode($base64String);

            // Store the image locally (in the 'public/images' directory)
            $filePath = 'images/' . $fileName;

            // Save the file to the storage folder
            Storage::disk('public')->put($filePath, $imageData);

            // Return success response with image URL
            return response()->json([
                'message' => 'Image uploaded successfully',
                'image_url' => asset('storage/' . $filePath),
            ]);
        }

        return response()->json(['message' => 'Invalid image data'], 400);
    }

    // Helper function to determine the image extension from base64 data
    private function getImageExtension($base64String)
    {
        if (preg_match('/^data:image\/(png);base64,/', $base64String)) {
            return 'png';
        }
        return 'jpg'; // Default to 'jpg' if it's not PNG
    }
}
