// PaypalButton.jsx
import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import Swal from "sweetalert2";

// CHANGE: Receive 'orderData' to match what OrderSummary is sending
const PaypalButton = ({ orderData, onSuccess, onCancel }) => {
  
  const onCreateOrder = async () => {
    try {
      // Use the full URL to ensure axios hits your Express server
      const response = await axios.post("http://localhost:3000/ido_shop_api/payment/create-order", orderData);
      console.log("Response from backend:", response.data);
      // PayPal strictly needs a STRING returned
      if (response.data && response.data.id) {
        return response.data.id; 
      } else {
        throw new Error("No Order ID returned from backend");
      }
    } catch (error) {
      console.error("PayPal Init Error:", error);
      Swal.fire("Error", "Could not initialize PayPal", "error");
    }
  };

  const onApprove = async (data) => {
    try {
      const response = await axios.post(`http://localhost:3000/ido_shop_api/payment/capture-payment/${data.orderID}`, {
        orderDetails: orderData // Matching orderData here too
      });

      if (response.data) {
        onSuccess(); // This triggers the clearCart and navigate in OrderSummary
      }
    } catch (error) {
      Swal.fire("Error", "Payment captured but failed to save order", "error");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <PayPalScriptProvider options={{ 
          "client-id": "AZ58q1lC9S9eJwFP--bXpHc6MKDayx_NxjUw7bMEPdoNLdihNJABfI2CAiv3D5syoyFUNS-LK7VA4ol0", 
          currency: "USD" 
      }}>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={onCreateOrder}
          onApprove={onApprove}
          onCancel={onCancel}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalButton;