<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewWidgetSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('review_widget_settings', function (Blueprint $table) {
            $table->id();
                
            // Installation Settings
            $table->boolean('installed')->default(false);

            // Theme Settings
            $table->boolean('show_review_date')->default(true);
            $table->string('widget_theme')->default('default');
            $table->boolean('border_around_widget')->default(false);
            $table->string('border_style')->nullable();

            // Color Settings
            $table->string('primary_color', 7)->default('#39c997'); // HEX color
            $table->string('star_color', 7)->default('#f59d47');    // HEX color

            // Media Upload Settings
            $table->boolean('allow_photo_upload')->default(true);
            $table->boolean('allow_video_upload')->default(true);
            $table->boolean('media_grid')->default(false);

            // Judge.me Models
            $table->boolean('show_product_models')->default(false);

            // Search and Pagination Settings
            $table->boolean('enable_review_search')->default(false);
            $table->boolean('enable_keyword_search')->default(false);
            $table->string('default_sorting_method')->default('Most Recent');
            $table->integer('reviews_per_page')->default(5);

            // Formatting Settings
            $table->string('review_length')->default('full');
            $table->boolean('limit_reviews')->default(false);

            // Store and Reviewer Details
            $table->boolean('show_reviewer_location')->default(false);
            $table->boolean('show_country_flag')->default(false);
            $table->boolean('show_avatar_icon')->default(false);
            $table->string('reviewer_name_format')->default('full_name');

            // Engagement Settings
            $table->boolean('enable_review_upvotes')->default(false);
            $table->boolean('enable_social_sharing')->default(false);

            // Review Source
            $table->boolean('show_review_source')->default(true);
            $table->boolean('show_collection_policy')->default(false);

            // Custom Forms
            $table->string('custom_form_display')->default('horizontal');

            // Advanced Settings
            $table->text('custom_css')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('review_widget_settings');
    }
}
