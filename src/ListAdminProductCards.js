import * as React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { ToastContainer, toast } from "react-toastify";

export function ListAdminProductCards({
  searchWord,
  data,
  deleteProduct,
  updateProduct,
}) {
  return (
    <div className="product-list-container">
      {data
        .filter((product) => product.productName.startsWith(searchWord))
        .map((product) => (
          <AdminProductCard
            productName={product.productName}
            imgUrl={product.imgUrl}
            price={product.price}
            currency={product.currency}
            id={product._id}
            quantity={product.quantity}
            key={product._id}
            category={product.category}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
          />
        ))}
      <ToastContainer />
    </div>
  );
}
function AdminProductCard({
  productName,
  imgUrl,
  price,
  currency,
  id,
  category,
  quantity,
  deleteProduct,
  updateProduct,
}) {
  const [noOfItems, setNoOfItems] = useState(quantity);
  const [newPrice, setPrice] = useState(price);
  const [newCategory, setCategory] = useState(category);

  return (
    <div className="cart-card">
      <div className="cart-content">
        <img src={imgUrl} className="cart-product-pic" alt={productName} />
        <div className="cart-product-content">
          <div>
            <p>{productName}</p>
          </div>
          <Box sx={{ minWidth: 120, marginBottom: "20px" }}>
            <FormControl variant="standard">
              <TextField
                required
                id="outlined-required"
                label="Quantity"
                variant="standard"
                value={noOfItems}
                onChange={(event) => {
                  setNoOfItems(event.target.value);
                }}
                style={{ width: "30vw" }}
              />
            </FormControl>
          </Box>
          <div>
            <Box sx={{ minWidth: 120, marginBottom: "20px" }}>
              <FormControl variant="standard">
                <TextField
                  required
                  id="outlined-required"
                  label="Price/Hr"
                  variant="standard"
                  value={newPrice}
                  onChange={(event) => {
                    setPrice(event.target.value);
                  }}
                  style={{ width: "30vw" }}
                />
              </FormControl>
            </Box>
          </div>
          <div>
            <Box sx={{ minWidth: 120 }}>
              <FormControl variant="standard">
                <TextField
                  required
                  id="outlined-required"
                  label="Category"
                  variant="standard"
                  value={newCategory}
                  onChange={(event) => {
                    setCategory(event.target.value);
                  }}
                  style={{ width: "30vw" }}
                />
              </FormControl>
            </Box>
          </div>
          <div className="buttonGroup">
            <Button
              variant="outlined"
              className="product-cart"
              color="primary"
              onClick={() => {
                const obj = {
                  productName: productName,
                  imgUrl: imgUrl,
                  price: newPrice,
                  quantity: noOfItems,
                  category: newCategory,
                };
                updateProduct(id, obj);
                toast.info("Updated the item", {
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
              update
            </Button>
            <Button
              variant="outlined"
              className="product-cart"
              color="error"
              onClick={() => {
                deleteProduct(id);
                toast.error("Deleted the item", {
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
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
