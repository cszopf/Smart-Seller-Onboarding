import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentUserId = searchParams.get('agentUserId');

  if (!agentUserId) {
    return NextResponse.json({ error: 'Missing agentUserId' }, { status: 400 });
  }

  const agent = db.agents.get(agentUserId);
  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
  }

  // Simulate verification logic for prototype
  // In a real app, we'd check Stripe API or wait for webhook
  if (agent.verificationStatus === 'pending') {
    // Auto-verify after 5 seconds for demo purposes if needed, 
    // but here we'll just return the current status.
    // Let's simulate a "success" if they've been pending for a bit.
  }

  return NextResponse.json({
    status: agent.verificationStatus,
  });
}

// Helper for prototype to manually "verify" an agent
export async function POST(request: Request) {
  const { agentUserId, status } = await request.json();
  const agent = db.agents.get(agentUserId);
  if (agent) {
    agent.verificationStatus = status || 'verified';
    if (agent.verificationStatus === 'verified') {
      agent.verifiedAt = new Date().toISOString();
    }
    db.agents.set(agentUserId, agent);
    return NextResponse.json({ success: true, agent });
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
