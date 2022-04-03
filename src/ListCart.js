import * as React from "react";
import { useState, useContext } from "react";
import { CartContext } from "./context/CartContext";
import { CostContext } from "./context/CostContext";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import { api } from "./api";
import { CartItemCard } from "./CartItemCard";
import { loadScript } from "./CartPage";

export function ListCart({ data }) {
  const { cart } = useContext(CartContext);
  const [cost, setCost] = useState(null);

  //   dotenv.config();
  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch(`${api}/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: cost }),
    }).then((t) => t.json());

    console.log(data);

    const options = {
      key: process.env.KEY_ID,
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: "Donation",
      description: "Thank you for nothing. Please give us some money",
      image:
        "data:image/png;base64,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",
      handler: function (response) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
        toast.info(`Payment got Successful ${response.razorpay_payment_id}`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      },
      prefill: {
        name: "nand",
        email: "nand@gmail.com",
        phone_number: "9899999999",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const history = useHistory();
  return (
    <CostContext.Provider value={{ cost, setCost }}>
      <div className="list-cart">
        <Button
          variant="outlined"
          className="back-button"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            history.goBack();
          }}
        >
          Back
        </Button>
        {data.map((product) => (
          <CartItemCard
            productName={product.productName}
            price={product.price}
            currency={product.currency}
            imgUrl={product.imgUrl}
            quantity={product.quantity}
            category={product.category}
            key={product._id}
            id={product._id}
          />
        ))}
        {cart.length > 0 ? (
          <Button
            variant="outlined"
            className="back-button"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={displayRazorpay}
          >
            buy
          </Button>
        ) : (
          ""
        )}
        <ToastContainer />
      </div>
    </CostContext.Provider>
  );
}
