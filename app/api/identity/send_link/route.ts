import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { agentUserId, destination } = await request.json();

  if (!agentUserId || !destination) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  const token = Math.random().toString(36).substr(2, 16);
  db.tokens.set(token, {
    agentUserId,
    expires: Date.now() + 1000 * 60 * 60, // 1 hour
  });

  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const link = `${appUrl}/identity/continue?t=${token}`;

  // In production, send via SendGrid or Twilio
  console.log(`[PROTOTYPE] Sending verification link to ${destination}: ${link}`);

  return NextResponse.json({
    success: true,
    link, // Return link for prototype testing
  });
}
