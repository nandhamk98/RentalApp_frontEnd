import * as React from "react";
import { useState, useEffect } from "react";
import { api } from "./api";
import { ListAdminProductCards } from "./ListAdminProductCards";

export function ListAdminProducts({ searchWord, category }) {
  const [data, setData] = useState(null);

  const deleteProduct = (id) => {
    fetch(`${api}products/` + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        console.log("success");
        fetchData();
      });
  };

  const updateProduct = (id, data) => {
    fetch(`${api}/products/` + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        fetchData();
      });
  };

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

  return data ? (
    <ListAdminProductCards
      searchWord={searchWord}
      data={data}
      deleteProduct={deleteProduct}
      updateProduct={updateProduct}
    />
  ) : (
    ""
  );
}
