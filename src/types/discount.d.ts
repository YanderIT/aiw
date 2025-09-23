export interface DiscountCode {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed_amount' | 'bonus_credits';
  value: number;
  min_amount?: number;
  max_uses?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  product_ids?: string;
  user_limit?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DiscountCodeUsage {
  id: number;
  discount_code_id: number;
  user_uuid: string;
  order_no: string;
  discount_amount: number;
  bonus_credits: number;
  used_at: string;
}

export interface DiscountValidationResult {
  valid: boolean;
  message: string;
  discount_code?: DiscountCode;
  discount_amount?: number;
  bonus_credits?: number;
  final_amount?: number;
}

export interface ApplyDiscountRequest {
  code: string;
  product_id: string;
  amount: number;
  user_uuid: string;
}