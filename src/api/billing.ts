/**
 * Billing API — pricing catalogue, credit balance, Razorpay flow.
 * Mirrors `app/routers/billing.py` on the backend.
 */

import apiClient from './client';
import {
  CreateOrderResponse,
  CreditsResponse,
  PlansResponse,
  VerifyOrderRequest,
  VerifyOrderResponse,
} from '../types';

export const billingApi = {
  /** Public — list plans */
  async getPlans(): Promise<PlansResponse> {
    const r = await apiClient.get<PlansResponse>('/api/billing/plans');
    return r.data;
  },

  /** Auth — current user balance */
  async getCredits(): Promise<CreditsResponse> {
    const r = await apiClient.get<CreditsResponse>('/api/billing/credits');
    return r.data;
  },

  /** Auth — create a Razorpay order for a plan */
  async createOrder(planId: string): Promise<CreateOrderResponse> {
    const r = await apiClient.post<CreateOrderResponse>('/api/billing/orders', {
      plan_id: planId,
    });
    return r.data;
  },

  /** Auth — verify a successful checkout, returns updated balance */
  async verifyOrder(payload: VerifyOrderRequest): Promise<VerifyOrderResponse> {
    const r = await apiClient.post<VerifyOrderResponse>('/api/billing/orders/verify', payload);
    return r.data;
  },
};
