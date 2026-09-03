<?php

use App\AiGateway\Agents\TutorAgent;
use App\AiGateway\AiGateway;
use App\AiGateway\PromptLibrary;
use App\Enums\AiTier;
use App\Enums\ContentStatus;
use App\Enums\TutorOutcome;
use App\Enums\UserRole;
use App\Models\AiGatewayLog;
use App\Models\Lesson;
use App\Models\Topic;
use App\Models\TutorMessage;
use App\Models\User;
use App\Notifications\TutorEscalationRaised;
use Illuminate\Support\Facades\Notification;

test('classifier output parsing fails closed to Block on anything unrecognized', function () {
    expect(TutorOutcome::fromClassifierOutput('PASS'))->toBe(TutorOutcome::Pass);
    expect(TutorOutcome::fromClassifierOutput('redirect'))->toBe(TutorOutcome::Redirect);
    expect(TutorOutcome::fromClassifierOutput('BLOCK.'))->toBe(TutorOutcome::Block);
    expect(TutorOutcome::fromClassifierOutput('Escalate now'))->toBe(TutorOutcome::Escalate);
    expect(TutorOutcome::fromClassifierOutput('[null-provider] Classify...'))->toBe(TutorOutcome::Block);
});

test('a question with no matching published lesson is redirected without calling the answer model', function () {
    $student = User::factory()->create(['role' => UserRole::Student]);
    $agent = new TutorAgent(new AiGateway(new PromptLibrary));

    $message = $agent->ask($student, 'What is the boiling point of unobtainium?');

    expect($message->outcome)->toBe(TutorOutcome::Redirect);
    expect($message->user_id)->toBe($student->id);
    $this->assertDatabaseCount('ai_gateway_logs', 0);
});

test('a grounded question is classified before being returned, failing closed with no real classifier configured', function () {
    $topic = Topic::factory()->create();
    Lesson::factory()->create([
        'topic_id' => $topic->id,
        'title' => 'Photosynthesis',
        'body' => 'Photosynthesis converts sunlight into chemical energy in plants.',
        'status' => ContentStatus::Published,
    ]);
    $student = User::factory()->create(['role' => UserRole::Student]);
    $agent = new TutorAgent(new AiGateway(new PromptLibrary));

    $message = $agent->ask($student, 'How does photosynthesis work?');

    // Null provider can't produce a real PASS classification, so this must
    // fail closed rather than leak an unclassified answer to the student.
    expect($message->outcome)->toBe(TutorOutcome::Block);
    expect($message->answer)->not->toContain('Photosynthesis converts sunlight');
    $this->assertDatabaseCount('ai_gateway_logs', 2); // answer + classification
});

test('a student can ask the tutor via the API', function () {
    $topic = Topic::factory()->create();
    Lesson::factory()->create([
        'topic_id' => $topic->id,
        'title' => 'Fractions',
        'body' => 'A fraction represents part of a whole.',
        'status' => ContentStatus::Published,
    ]);
    $student = User::factory()->create(['role' => UserRole::Student]);

    $this->actingAs($student, 'sanctum')
        ->postJson('/api/v1/tutor/ask', ['question' => 'What are fractions?'])
        ->assertCreated()
        ->assertJsonPath('data.outcome', TutorOutcome::Block->value);
});

test('an escalated outcome notifies the student\'s linked parents and admins', function () {
    // The null provider can never produce ESCALATE itself (it always fails
    // closed to Block, tested above), so the Gateway is mocked here purely
    // to reach the one branch that provider can't exercise.
    Notification::fake();

    $topic = Topic::factory()->create();
    Lesson::factory()->create([
        'topic_id' => $topic->id,
        'title' => 'Photosynthesis',
        'body' => 'Photosynthesis converts sunlight into chemical energy in plants.',
        'status' => ContentStatus::Published,
    ]);
    $student = User::factory()->create(['role' => UserRole::Student]);
    $parent = User::factory()->create(['role' => UserRole::Parent]);
    $unrelatedParent = User::factory()->create(['role' => UserRole::Parent]);
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $parent->students()->attach($student->id, ['status' => 'active']);

    $gateway = Mockery::mock(AiGateway::class);
    $gateway->shouldReceive('complete')
        ->withArgs(fn ($tier) => $tier === AiTier::HigherQuality)
        ->andReturn(new AiGatewayLog(['output' => 'A concerning answer.']));
    $gateway->shouldReceive('complete')
        ->withArgs(fn ($tier) => $tier === AiTier::SafetyClassification)
        ->andReturn(new AiGatewayLog(['output' => 'ESCALATE']));

    $agent = new TutorAgent($gateway);
    $message = $agent->ask($student, 'How does photosynthesis work?');

    expect($message->outcome)->toBe(TutorOutcome::Escalate);
    Notification::assertSentTo($parent, TutorEscalationRaised::class);
    Notification::assertSentTo($admin, TutorEscalationRaised::class);
    Notification::assertNotSentTo($unrelatedParent, TutorEscalationRaised::class);
});

test('a parent can view their own linked student\'s tutor conversation, but not another student\'s', function () {
    $parent = User::factory()->create(['role' => UserRole::Parent]);
    $student = User::factory()->create(['role' => UserRole::Student]);
    $otherStudent = User::factory()->create(['role' => UserRole::Student]);
    $parent->students()->attach($student->id, ['status' => 'active']);
    TutorMessage::factory()->create(['user_id' => $student->id]);

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$student->id}/tutor-messages")
        ->assertOk()
        ->assertJsonCount(1, 'data');

    $this->actingAs($parent, 'sanctum')
        ->getJson("/api/v1/students/{$otherStudent->id}/tutor-messages")
        ->assertForbidden();
});
