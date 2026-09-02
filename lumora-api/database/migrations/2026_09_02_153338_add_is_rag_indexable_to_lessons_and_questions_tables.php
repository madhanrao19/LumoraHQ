<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Classification: Public — ADR-0020
// Per-item RAG opt-out (ADR-0022): included by default, excluded only by
// deliberate choice — e.g. a time-sensitive notice that shouldn't be cited
// as standing knowledge.
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->boolean('is_rag_indexable')->default(true)->after('status');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->boolean('is_rag_indexable')->default(true)->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn('is_rag_indexable');
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('is_rag_indexable');
        });
    }
};
