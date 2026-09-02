<?php

// AI Gateway config: which provider/model fills each capability tier
// (ADR-0016). Changing a tier's model is a config change here, not a new
// ADR or a code change in feature modules.
return [
    'tiers' => [
        'economical' => [
            'provider' => env('AI_ECONOMICAL_PROVIDER', 'null'),
            'model' => env('AI_ECONOMICAL_MODEL'),
        ],
        'higher_quality' => [
            'provider' => env('AI_HIGHER_QUALITY_PROVIDER', 'null'),
            'model' => env('AI_HIGHER_QUALITY_MODEL'),
        ],
        'safety_classification' => [
            'provider' => env('AI_SAFETY_PROVIDER', 'null'),
            'model' => env('AI_SAFETY_MODEL'),
        ],
    ],
];
