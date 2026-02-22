import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get('invoiceId');
  const sessionId = searchParams.get('sessionId');

  if (!invoiceId || !sessionId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  // In production, we would verify with Stripe:
  // const session = await stripe.checkout.sessions.retrieve(sessionId);
  // if (session.payment_status !== 'paid') throw Error...

  const invoice = db.invoices.get(invoiceId);

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  }

  if (invoice.stripeCheckoutSessionId !== sessionId) {
    return NextResponse.json({ error: 'Invalid session for this invoice' }, { status: 403 });
  }

  // Ensure agent exists
  let agent = Array.from(db.agents.values()).find(a => a.email === invoice.agentEmail);
  if (!agent) {
    const agentUserId = `agent_${Math.random().toString(36).substr(2, 9)}`;
    agent = {
      agentUserId,
      email: invoice.agentEmail,
      name: invoice.agentName,
      verificationStatus: 'unverified',
      createdAt: new Date().toISOString(),
    };
    db.agents.set(agentUserId, agent);
  }

  return NextResponse.json({
    invoice,
    agent,
  });
}
