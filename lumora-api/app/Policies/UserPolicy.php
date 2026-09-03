<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     *
     * Only Admins list all accounts — used by the Filament admin panel.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the model.
     *
     * Admins can view anyone. Anyone can view themselves. Parents can view
     * only their own linked students — the relationship check that makes
     * ADR-0018's "role + relationship in one mechanism" real. Nothing else
     * is granted, including Students viewing their own parents' records.
     */
    public function view(User $user, User $model): bool
    {
        if ($user->isAdmin() || $user->is($model)) {
            return true;
        }

        if ($user->isParent() && $model->isStudent()) {
            return $user->students()->whereKey($model->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can view the model's AI Gateway audit log.
     *
     * Deliberately narrower than view(): Admins can view any student's log,
     * and Parents only their own linked students', but a Student can never
     * view their own — ADR-0021 treats the audit log as an oversight
     * mechanism, not a self-service chat-history feature.
     */
    public function viewAuditLog(User $user, User $model): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isParent() && $model->isStudent()) {
            return $user->students()->whereKey($model->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return false;
    }
}
