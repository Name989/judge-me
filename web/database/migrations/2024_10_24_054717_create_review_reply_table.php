<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReviewReplyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::create('review_reply', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('review_id'); // foreign key to reviews table
        $table->text('reply');
        $table->timestamps();

        // Add foreign key constraints if needed
        $table->foreign('review_id')->references('id')->on('reviews')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('review_reply');
    }
}
