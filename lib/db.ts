/**
 * In-memory store for prototype data.
 * In a real app, this would be a database like PostgreSQL or MongoDB.
 */

export interface Invoice {
  invoiceId: string;
  stripeCheckoutSessionId: string;
  status: 'paid' | 'unpaid';
  amount: number;
  currency: string;
  agentEmail: string;
  agentName?: string;
  createdAt: string;
  paidAt?: string;
}

export interface AgentUser {
  agentUserId: string;
  email: string;
  phone?: string;
  name?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'failed';
  stripeIdentityVerificationSessionId?: string;
  stripeIdentityVerificationReportId?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface SellerClient {
  sellerClientId: string;
  invoiceId?: string; // Optional now
  agentUserId: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  propertyAddress: string;
  notes?: string;
  sellerAuthStatus: 'not_started' | 'requested' | 'signed';
  priorPolicyStatus: 'unknown' | 'requested' | 'received' | 'not_available';
  createdAt: string;
}

// Mock Database
export const db = {
  invoices: new Map<string, Invoice>(),
  agents: new Map<string, AgentUser>(),
  sellerClients: new Map<string, SellerClient>(),
  tokens: new Map<string, { agentUserId: string; expires: number }>(),
};

// Seed some data for testing
const seedInvoiceId = 'inv_123';
db.invoices.set(seedInvoiceId, {
  invoiceId: seedInvoiceId,
  stripeCheckoutSessionId: 'cs_test_123',
  status: 'paid',
  amount: 450.00,
  currency: 'usd',
  agentEmail: 'alex@premier.com',
  agentName: 'Alex Sterling',
  createdAt: new Date().toISOString(),
  paidAt: new Date().toISOString(),
});

const seedAgentId = 'agent_123';
db.agents.set(seedAgentId, {
  agentUserId: seedAgentId,
  email: 'alex@premier.com',
  name: 'Alex Sterling',
  verificationStatus: 'unverified',
  createdAt: new Date().toISOString(),
});
