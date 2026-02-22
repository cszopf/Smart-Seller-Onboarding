import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  const { agentUserId } = await request.json();

  if (!agentUserId) {
    return NextResponse.json({ error: 'Missing agentUserId' }, { status: 400 });
  }

  const agent = db.agents.get(agentUserId);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // In production:
  // const session = await stripe.identity.verificationSessions.create({
  //   type: 'document',
  //   metadata: { agentUserId },
  // });
  // return NextResponse.json({ client_secret: session.client_secret, url: session.url });

  const mockSessionId = `vs_${Math.random().toString(36).substr(2, 9)}`;
  agent.stripeIdentityVerificationSessionId = mockSessionId;
  agent.verificationStatus = 'pending';
  db.agents.set(agentUserId, agent);

  return NextResponse.json({
    verificationSessionId: mockSessionId,
    client_secret: 'mock_secret_123',
    url: `https://verify.stripe.com/mock/${mockSessionId}`,
  });
}
