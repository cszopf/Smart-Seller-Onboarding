import { NextResponse } from 'next/server';
import { db, SellerClient } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { invoiceId, agentUserId, sellerName, sellerEmail, sellerPhone, propertyAddress, notes } = body;

  if (!agentUserId || !sellerName || !sellerEmail) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const sellerClientId = `client_${Math.random().toString(36).substr(2, 9)}`;
  const client: SellerClient = {
    sellerClientId,
    invoiceId,
    agentUserId,
    sellerName,
    sellerEmail,
    sellerPhone,
    propertyAddress,
    notes,
    sellerAuthStatus: 'not_started',
    priorPolicyStatus: 'unknown',
    createdAt: new Date().toISOString(),
  };

  db.sellerClients.set(sellerClientId, client);

  // Generate handoff token
  const handoffToken = Math.random().toString(36).substr(2, 32);
  db.tokens.set(handoffToken, {
    agentUserId,
    expires: Date.now() + 1000 * 60 * 15, // 15 mins
  });

  return NextResponse.json({
    sellerClientId,
    handoffToken,
  });
}
