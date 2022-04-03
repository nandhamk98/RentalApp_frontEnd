import * as React from "react";
import { useState, useContext } from "react";
import { CartContext } from "./context/CartContext";
import { CostContext } from "./context/CostContext";
import DateTimePicker from "react-datetime-picker";
import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/Delete";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

export function CartItemCard({
  imgUrl,
  productName,
  price,
  currency,
  quantity,
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
