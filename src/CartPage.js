import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "./context/CartContext";
import "react-toastify/dist/ReactToastify.css";
import { api } from "./api";
import { ListCart } from "./ListCart";
// import dotenv from "dotenv";

export function loadScript(src) {
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
    fetch(`${api}/products/list-cart`, {
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
