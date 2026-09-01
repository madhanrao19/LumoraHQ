<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin accounts are seeded, not self-registered — no public signup
        // endpoint exists for this privileged role.
        User::factory()->admin()->create([
            'name' => 'Lumora Admin',
            'email' => 'admin@lumora.test',
        ]);
    }
}
