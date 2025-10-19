import {
  Elements,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";
import type { RootState } from "../redux/store";
import type { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return toast.error("Stripe has not loaded yet");
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return toast.error("Card element not found");
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setIsProcessing(false);
        return toast.error(error.message || "Payment failed");
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const orderData: NewOrderRequest = {
          shippingInfo,
          orderItems: cartItems,
          subtotal,
          tax,
          discount,
          shippingCharges,
          total,
          user: user?._id!,
        };

        const res = await newOrder(orderData);
        dispatch(resetCart());
        responseToast(res, navigate, "/orders");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="checkout-container">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2 style={{ marginBottom: "20px" }}>Complete Your Payment</h2>
      <form onSubmit={submitHandler}>
        <div
          style={{
            padding: "15px",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            marginBottom: "20px",
            backgroundColor: "#fff",
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: isProcessing ? "#ccc" : "#5469d4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          {isProcessing ? "Processing..." : `Pay ₹${total}`}
        </button>
      </form>
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
        <p>Test Card: 4242 4242 4242 4242</p>
        <p>Expiry: Any future date | CVC: Any 3 digits</p>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { total } = useSelector((state: RootState) => state.cartReducer);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post("http://localhost:3000/api/v1/payment/create", {
          amount: total, // send total amount
        });
        setClientSecret(data.clientSecret);
        console.log(data.clientSecret);
      } catch (err: any) {
        toast.error("Failed to initialize payment");
        console.error(err);
      }
    };

    createPaymentIntent();
  }, [total]);

  if (!clientSecret) return <p>Loading payment...</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
        backgroundColor: "#f6f9fc",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Elements stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  );
};

export default Checkout;
