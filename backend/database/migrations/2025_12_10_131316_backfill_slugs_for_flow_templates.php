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
        // Iterate over all templates and update slug
        $templates = DB::table('flow_templates')->whereNull('slug')->orWhere('slug', '')->get();

        foreach ($templates as $template) {
            $slug = \Illuminate\Support\Str::slug($template->title);
            $count = DB::table('flow_templates')->where('slug', $slug)->where('id', '!=', $template->id)->count();
            if ($count > 0) {
                $slug = $slug . '-' . ($count + 1);
            }
            
            DB::table('flow_templates')->where('id', $template->id)->update(['slug' => $slug]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('flow_templates', function (Blueprint $table) {
            //
        });
    }
};
