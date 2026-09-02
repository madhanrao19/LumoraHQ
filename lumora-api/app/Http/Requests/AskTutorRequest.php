<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AskTutorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Only Students talk to the Tutor.
     */
    public function authorize(): bool
    {
        return $this->user()->isStudent();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:2000'],
        ];
    }
}
