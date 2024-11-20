<?php

namespace App\Http\Controllers;
use App\Models\ReviewWidgetSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Import DB facade

class ReviewWidgetSettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
     public function getSettings($id)
    {
        try {
            // Find settings by ID
            $settings = ReviewWidgetSettings::findOrFail($id);

            return response()->json($settings, 200); // Return the settings as JSON
        } catch (\Exception $e) {
            return response()->json(['error' => 'Settings not found'], 404); // Return an error response
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
{
    // Validate the incoming data
    $validatedData = $request->validate([
        'installed' => 'nullable|boolean',
        'show_review_date' => 'nullable|boolean',
        'widget_theme' => 'nullable|string|max:255',
        'border_around_widget' => 'nullable|boolean',
        'border_style' => 'nullable|string|max:255',
        'primary_color' => 'nullable|string|max:7',
        'star_color' => 'nullable|string|max:7',
        'default_sorting_method' => 'nullable|string|max:255',
        'reviews_per_page' => 'nullable|integer|min:1',
        'review_length' => 'nullable|string|max:255',
        'reviewer_name_format' => 'nullable|string|max:255',
        'enable_social_sharing' => 'nullable|boolean',
        'show_review_source' => 'nullable|boolean',
        'show_collection_policy' => 'nullable|boolean',
    ]);

    try {
        // Find the setting by ID
        $settings = ReviewWidgetSettings::findOrFail(1);

        // Update the main table fields
        $settings->update([
            'installed' => $validatedData['installed'] ?? $settings->installed,
            'show_review_date' => $validatedData['show_review_date'] ?? $settings->show_review_date,
            'widget_theme' => $validatedData['widget_theme'] ?? $settings->widget_theme,
            'border_around_widget' => $validatedData['border_around_widget'] ?? $settings->border_around_widget,
            'border_style' => $validatedData['border_style'] ?? $settings->border_style,
            'primary_color' => $validatedData['primary_color'] ?? $settings->primary_color,
            'star_color' => $validatedData['star_color'] ?? $settings->star_color,
            'default_sorting_method' => $validatedData['default_sorting_method'] ?? $settings->default_sorting_method,
            'reviews_per_page' => $validatedData['reviews_per_page'] ?? $settings->reviews_per_page,
            'review_length' => $validatedData['review_length'] ?? $settings->review_length,
            'reviewer_name_format' => $validatedData['reviewer_name_format'] ?? $settings->reviewer_name_format,
            'enable_social_sharing' => $validatedData['enable_social_sharing'] ?? $settings->enable_social_sharing,
            'show_review_source' => $validatedData['show_review_source'] ?? $settings->show_review_source,
            'show_collection_policy' => $validatedData['show_collection_policy'] ?? $settings->show_collection_policy,
        ]);

        return response()->json(['message' => 'Review widget settings updated successfully'], 200);

    } catch (\Exception $e) {
        // Handle exceptions
        return response()->json(['error' => 'Unable to update settings: ' . $e->getMessage()], 500);
    }
}
    

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

