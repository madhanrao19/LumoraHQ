<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// Classification: Public — mirrors published curriculum content, no personal data.
//
// Tracks which content is currently RAG-eligible per ADR-0022 (index on
// publish, remove on unpublish/supersede/opt-out). Row presence = indexed.
// Deliberately has no embedding column yet — pgvector isn't installed on
// this Postgres instance, and real embeddings need actual provider
// credentials. Add the vector column and the job that populates it once
// both exist; this table is the eligibility ledger that job will read from.
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rag_documents', function (Blueprint $table) {
            $table->id();
            $table->morphs('documentable');
            $table->timestamp('indexed_at');
            $table->timestamps();

            $table->unique(['documentable_type', 'documentable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rag_documents');
    }
};
