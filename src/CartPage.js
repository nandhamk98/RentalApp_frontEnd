import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "./context/CartContext";
import { CostContext } from "./context/CostContext";
import { useHistory } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dotenv from "dotenv";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export function CartPage() {
  const [data, setData] = useState(null);

  const { cart } = useContext(CartContext);

  const fetchData = () => {
    fetch("http://localhost:4000/products/list-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    })
      .then((products) => products.json())
      .then((products) => setData(products));
  };

  useEffect(fetchData, [cart]);
  return data ? <ListCart data={data} /> : "";
}

function ListCart({ data }) {
  const { cart } = useContext(CartContext);
  const [cost, setCost] = useState(null);

  dotenv.config();

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch("http://localhost:4000/razorpay", {
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
      //   image: "https://example.com/your_logo",
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

function CartItemCard({
  imgUrl,
  productName,
  price,
  currency,
  quantity,
  category,
  id,
}) {
  const date = new Date();
  const newdate = new Date();
  newdate.setDate(newdate.getDate() + 1);

  const { setCost } = useContext(CostContext);

  const [fromTime, setFromTime] = useState(date);
  const [toTime, setToTime] = useState(newdate);
  const [noOfItems, setNoOfItems] = useState(1);
  const calculateCost = () => {
    let hours = parseInt((Math.abs(toTime - fromTime) / (1000 * 60 * 60)) % 24);
    let days = parseInt((toTime - fromTime) / (1000 * 60 * 60 * 24));
    let minutes = parseInt(
      (Math.abs(toTime.getTime() - fromTime.getTime()) / (1000 * 60)) % 60
    );
    hours = minutes >= 30 ? hours + 1 : hours;
    console.log(days, hours, minutes);
    console.log(days * 24 * price + hours * price);
    return days * 24 * price + hours * price;
  };

  const { cart, setCart } = useContext(CartContext);

  function getMenuItems() {
    let arr = [];
    for (let i = 1; i <= quantity; i++) {
      arr.push(
        <MenuItem value={i} key={i}>
          {i}
        </MenuItem>
      );
    }
    return arr;
  }

  function calculateEndCost() {
    let endCost = calculateCost() * noOfItems;
    setCost(endCost);
    return endCost;
  }

  return (
    <div className="cart-card">
      <div className="cart-content">
        <img src={imgUrl} className="cart-product-pic" alt={productName} />
        <div className="cart-product-content">
          <div>
            <p>{productName}</p>
            <p>
              {currency}
              {price} / hr
            </p>
          </div>
          <div className="cart-time">
            <div>
              <p>From</p>
              <DateTimePicker
                onChange={(value) => {
                  setFromTime(value);
                  //   setCost(calculateCost());
                }}
                value={fromTime}
              />
            </div>
            <div>
              <p>To</p>
              <DateTimePicker
                value={toTime}
                onChange={(value) => {
                  setToTime(value);
                  //   setCost(calculateCost());
                }}
              />
            </div>
          </div>
          <div className="cart-quantity">
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Quantity</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={noOfItems}
                  label="Quantity"
                  onChange={(event) => {
                    setNoOfItems(event.target.value);
                  }}
                >
                  {getMenuItems().map((item) => {
                    return item;
                  })}
                </Select>
              </FormControl>
            </Box>
          </div>
          <div className="cart-action">
            <div>
              <p>
                {currency}
                {calculateEndCost()}
              </p>
            </div>
            <div>
              <Button
                variant="contained"
                className="product-cart"
                color="error"
                endIcon={<DeleteIcon />}
                onClick={() => {
                  setCart(cart.filter((ids) => id !== ids));
                  toast.error("Removed from Cart", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                }}
              >
                delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
