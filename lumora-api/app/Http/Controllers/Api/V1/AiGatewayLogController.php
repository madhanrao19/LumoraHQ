<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AiGatewayLogResource;
use App\Models\AiGatewayLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AiGatewayLogController extends Controller
{
    /**
     * List a student's AI Gateway audit log. Admin or their linked Parent
     * only — UserPolicy::viewAuditLog excludes self-access (ADR-0021).
     */
    public function index(Request $request, User $student): AnonymousResourceCollection
    {
        $request->user()->can('viewAuditLog', $student) || abort(403);

        return AiGatewayLogResource::collection(
            AiGatewayLog::where('user_id', $student->id)->latest()->get()
        );
    }
}
