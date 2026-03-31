/**
 * GET /api/avatar/[userId]
 * Returns avatar status + signed GLB URL when ready.
 *
 * RULE: GLB URL is always presigned — never a raw storage path.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireApiKey } from '@/lib/apiKeyMiddleware';
import { getSignedAvatarUrl, avatarStoragePath } from '@/lib/avatarCache';
import { avatarJobs } from '@/app/api/avatar/generate/route';
import type { AvatarJob } from '@/types';

interface RouteContext {
  params: Promise<{ userId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  // 1. Auth
  const { ctx, error: authError } = await requireApiKey(req);
  if (authError) return authError;

  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  // 2. Look up job by userId
  const job: AvatarJob | undefined = avatarJobs.get(`user_${userId}`) ?? avatarJobs.get(userId);

  if (!job) {
    return NextResponse.json(
      { userId, status: 'not_found', message: 'No avatar job found for this user' },
      { status: 404 }
    );
  }

  // 3. If ready, attach signed GLB URL
  if (job.status === 'ready') {
    const storagePath = avatarStoragePath(userId);
    const glbUrl = await getSignedAvatarUrl(storagePath);

    return NextResponse.json({
      userId,
      jobId: job.jobId,
      status: 'ready',
      glbUrl,
      signedExpiry: new Date(Date.now() + 3600 * 1000).toISOString(),
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      marketplaceId: ctx.marketplaceId,
    });
  }

  // 4. Still processing
  return NextResponse.json({
    userId,
    jobId: job.jobId,
    status: job.status,
    progress: job.progress ?? 0,
    createdAt: job.createdAt,
    error: job.error,
    marketplaceId: ctx.marketplaceId,
  });
}
