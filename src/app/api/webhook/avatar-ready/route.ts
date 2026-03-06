/**
 * POST /api/webhook/avatar-ready
 * Callback from Python microservice when GLB generation completes.
 * Validates shared webhook secret, updates job store.
 *
 * RULE: No API-key validation here (Python service doesn't have marketplace key)
 *       — validate VEXA_WEBHOOK_SECRET instead.
 */

import { NextRequest, NextResponse } from 'next/server';
import { avatarJobs } from '@/app/api/avatar/generate/route';
import { invalidateAvatarUrl, avatarStoragePath } from '@/lib/avatarCache';
import type { AvatarReadyWebhook, AvatarJob } from '@/types';

const WEBHOOK_SECRET = process.env.VEXA_WEBHOOK_SECRET ?? 'dev_webhook_secret';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Validate webhook secret
  const secret = req.headers.get('x-vexa-webhook-secret');
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Payload required' }, { status: 400 });
  }

  const { jobId, userId, status, glbPath, error, timestamp } = body as Partial<AvatarReadyWebhook>;

  if (!jobId || !userId || !status) {
    return NextResponse.json({ error: 'jobId, userId, status are required' }, { status: 422 });
  }

  // 2. Update job store
  const existing: AvatarJob | undefined = avatarJobs.get(jobId);

  const updatedJob: AvatarJob = {
    jobId,
    userId,
    status,
    progress: status === 'ready' ? 100 : undefined,
    createdAt: existing?.createdAt ?? timestamp ?? new Date().toISOString(),
    completedAt: status === 'ready' ? (timestamp ?? new Date().toISOString()) : undefined,
    error: error ?? undefined,
  };

  avatarJobs.set(jobId, updatedJob);
  avatarJobs.set(`user_${userId}`, updatedJob);

  // 3. Invalidate stale URL cache if new GLB arrived
  if (status === 'ready' && glbPath) {
    invalidateAvatarUrl(avatarStoragePath(userId));
  }

  return NextResponse.json({ received: true, jobId, status });
}
