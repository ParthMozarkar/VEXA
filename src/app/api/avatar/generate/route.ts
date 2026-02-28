/**
 * POST /api/avatar/generate
 * Accepts: photo (base64 or multipart) + body measurements
 * Returns: { job_id, status: "queued" }
 *
 * RULES:
 * - Photo MUST NOT be stored; UV texture only, original discarded
 * - Auth via x-vexa-key middleware
 * - No SMPL-X inference here — forwards to Python microservice
 * - Measurement data is PII — no logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/apiKeyMiddleware';
import { validateMeasurements } from '@/lib/measurementUtils';
import type { BodyMeasurements, AvatarJob } from '@/types';

// In-memory job store (replace with Redis/DB in production)
export const avatarJobs = new Map<string, AvatarJob>();

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Validate API key
  const { ctx, error: authError } = await requireApiKey(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
  }

  const { userId, measurements, photoBase64 } = body as {
    userId?: string;
    measurements?: BodyMeasurements;
    photoBase64?: string;
  };

  // 2. Validate required fields
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  if (!measurements || typeof measurements !== 'object') {
    return NextResponse.json({ error: 'measurements payload is required' }, { status: 400 });
  }

  // 3. Validate measurements (PII-safe: no measurement values in logs)
  const validationErrors = validateMeasurements(measurements, 'cm');
  if (validationErrors.length > 0) {
    return NextResponse.json(
      { error: 'Invalid measurements', details: validationErrors },
      { status: 422 }
    );
  }

  if (!photoBase64 || typeof photoBase64 !== 'string') {
    return NextResponse.json({ error: 'photoBase64 is required' }, { status: 400 });
  }

  // 4. Create job record
  const jobId = generateJobId();
  const now = new Date().toISOString();

  const job: AvatarJob = {
    jobId,
    userId,
    status: 'queued',
    progress: 0,
    createdAt: now,
  };

  avatarJobs.set(jobId, job);

  // 5. Fire-and-forget to Python microservice (non-blocking)
  // In production: replace with actual Python service URL
  const pythonServiceUrl = process.env.PYTHON_SERVICE_URL ?? 'http://localhost:8000';
  
  // Simulate async dispatch (do NOT await — return immediately)
  simulatePythonPipeline(jobId, userId).catch(() => {
    // Silent fail — Python service will call back via webhook
  });

  // 6. Return job_id immediately — client polls /api/avatar/[userId]
  return NextResponse.json(
    {
      job_id: jobId,
      status: 'queued',
      pollUrl: `/api/avatar/${userId}`,
      message: 'Avatar generation queued. Use pollUrl to check status.',
      marketplaceId: ctx.marketplaceId,
    },
    { status: 202 }
  );
}

/**
 * Simulates the Python pipeline for dev/demo.
 * In production: Python service calls back via /api/webhook/avatar-ready
 */
async function simulatePythonPipeline(jobId: string, userId: string): Promise<void> {
  const job = avatarJobs.get(jobId);
  if (!job) return;

  await sleep(500);
  setJobStatus(jobId, 'processing', 20);

  await sleep(1500);
  setJobStatus(jobId, 'processing', 60);

  await sleep(1500);
  setJobStatus(jobId, 'processing', 90);

  await sleep(500);
  // Mark ready — in production the Python service POSTs to webhook
  const readyJob: AvatarJob = {
    ...job,
    status: 'ready',
    progress: 100,
    completedAt: new Date().toISOString(),
  };
  avatarJobs.set(jobId, readyJob);

  // Also store by userId for polling
  avatarJobs.set(`user_${userId}`, readyJob);
}

function setJobStatus(jobId: string, status: AvatarJob['status'], progress: number): void {
  const existing = avatarJobs.get(jobId);
  if (existing) {
    avatarJobs.set(jobId, { ...existing, status, progress });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
