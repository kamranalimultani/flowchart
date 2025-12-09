<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            if (Schema::hasColumn('blogs', 'author_id')) {
                try {
                    $table->dropForeign(['author_id']);
                } catch (\Exception $e) {
                    // Ignore if FK doesn't exist
                }
                $table->dropColumn('author_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('blogs', function (Blueprint $table) {
            if (!Schema::hasColumn('blogs', 'author_id')) {
                $table->unsignedBigInteger('author_id')->nullable();
            }
        });
    }
};
