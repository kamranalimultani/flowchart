<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_responses', function (Blueprint $table) {
            $table->id();

            // Relation to Flow (diagram)
            $table->foreignId('flow_id')->constrained('flows')->onDelete('cascade');

            // Relation to FormTemplate (survey definition)
            $table->foreignId('form_template_id')->constrained('form_templates')->onDelete('cascade');

            // Node id from mxGraph
            $table->string('node_id');

            // User who submitted (optional)
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();

            // Actual response JSON
            $table->json('response');

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_responses');
    }
};
