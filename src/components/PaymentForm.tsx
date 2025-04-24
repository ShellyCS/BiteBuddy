import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { orders as ordersApi } from '../lib/api';

interface PaymentFormProps {
  clientSecret: string;
  orderId: number;
  amount: number;
  onSuccess: () => void;
}

export default function PaymentForm({ clientSecret, orderId, amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Check the payment intent status
    if (clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case "succeeded":
            setMessage("Payment succeeded!");
            updateOrderPaymentStatus("completed");
            onSuccess();
            break;
          case "processing":
            setMessage("Your payment is processing.");
            break;
          case "requires_payment_method":
            setMessage("Please provide your payment details.");
            break;
          default:
            setMessage("Something went wrong.");
            break;
        }
      });
    }
  }, [stripe, clientSecret, onSuccess]);

  const updateOrderPaymentStatus = async (status: string) => {
    try {
      await ordersApi.updatePaymentStatus(orderId.toString(), status);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/profile?payment_success=true&order_id=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || "An unexpected error occurred");
        toast.error(error.message || "Payment failed. Please try again.");
        await updateOrderPaymentStatus("failed");
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage("Payment succeeded!");
        toast.success("Payment successful!");
        await updateOrderPaymentStatus("completed");
        onSuccess();
      } else {
        setMessage("Your payment is being processed.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      <div className="mb-8">
        <h3 className="text-md font-medium mb-2">Billing Address</h3>
        <AddressElement options={{
          mode: 'billing',
          fields: {
            phone: 'always',
          },
          validation: {
            phone: {
              required: 'always',
            },
          },
        }} />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-md font-semibold">Total: ${amount.toFixed(2)}</div>
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="bg-yellow-500 text-white py-3 px-6 rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </button>
      </div>
      
      {message && (
        <div className={`mt-4 p-3 rounded-md text-center ${
          message.includes("succeeded") 
            ? "bg-green-50 text-green-700" 
            : message.includes("processing")
              ? "bg-yellow-50 text-yellow-700"
              : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}
    </form>
  );
}