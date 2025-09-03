import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
  key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
});

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export const createOrder = async (params: CreateOrderParams) => {
  try {
    const order = await razorpay.orders.create({
      amount: params.amount * 100, // Convert to paise
      currency: params.currency || 'INR',
      receipt: params.receipt || `rcpt_${Date.now()}`,
      notes: params.notes,
    });
    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create payment order');
  }
};
