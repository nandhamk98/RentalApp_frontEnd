import * as React from "react";
import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { CartContext } from "./context/CartContext";
import { api } from "./api";

export function ListProducts({ searchWord, category }) {
  const [data, setData] = useState(null);

  const fetchData = () => {
    if (category === "All" || category === "Categories") {
      fetch(`${api}/products`)
        .then((products) => products.json())
        .then((products) => setData(products));
    } else {
      fetch(`${api}/products/category/` + category)
        .then((products) => products.json())
        .then((products) => setData(products));
    }
  };

  useEffect(fetchData, [category]);

  return data ? <ListProductCards searchWord={searchWord} data={data} /> : "";
}

function ListProductCards({ searchWord, data }) {
  return (
    <div className="product-list-container">
      {data
        .filter((product) => product.productName.startsWith(searchWord))
        .map((product) => (
          <ProductCard
            productName={product.productName}
            imgUrl={product.imgUrl}
            price={product.price}
            currency={product.currency}
            id={product._id}
            key={product._id}
          />
        ))}
    </div>
  );
}

function ProductCard({ productName, imgUrl, price, currency, id }) {
  const { cart, setCart } = useContext(CartContext);
  const setState = () => {
    return cart.filter((identity) => identity === id).length === 0
      ? false
      : true;
  };
  const [addState, setAddState] = useState(setState());

  return (
    <div className="product-card">
      <img src={imgUrl} className="product-pic" alt={productName} />
      <div className="product-name">
        <p>{productName}</p>
      </div>
      <div className="product-price">
        <p className="price">
          {currency}
          {price}
        </p>
        {addState ? (
          <Button
            variant="contained"
            className="product-cart"
            color="error"
            endIcon={<ShoppingCartIcon />}
            onClick={() => {
              setAddState(!addState);
              setCart(cart.filter((ids) => ids !== id));
            }}
          >
            Added
          </Button>
        ) : (
          <Button
            variant="contained"
            className="product-cart"
            color="primary"
            endIcon={<ShoppingCartIcon />}
            onClick={() => {
              setAddState(!addState);
              setCart([...cart, id]);
            }}
          >
            rent
          </Button>
        )}
      </div>
    </div>
  );
}
