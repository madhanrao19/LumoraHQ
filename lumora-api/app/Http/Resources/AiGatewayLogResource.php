<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AiGatewayLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tier' => $this->tier,
            'provider' => $this->provider,
            'model' => $this->model,
            'prompt_key' => $this->prompt_key,
            'output' => $this->output,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
