import "./App.css";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useState, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import { ListProducts } from "./ListProducts";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";
import { CartContext } from "./context/CartContext";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function ProductPage() {
  const [searchValue, setSearchValue] = useState("");
  const [valuePass, setValuePass] = useState(searchValue);
  const { cart } = useContext(CartContext);
  const history = useHistory();
  const [category, setCategory] = useState("Categories");
  return (
    <div className="product">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <FormControl sx={{ minWidth: 200, marginRight: "10px" }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "5px",
                }}
                onChange={(event) => {
                  setCategory(event.target.value);
                }}
              >
                <MenuItem value={"Categories"}>Categories</MenuItem>
                <MenuItem value={"All"}>All </MenuItem>
                <MenuItem value={"Road bikes"}>Road bikes</MenuItem>
                <MenuItem value={"Mountain bikes"}>Mountain bikes</MenuItem>
                <MenuItem value={"Cruisers"}>Cruisers</MenuItem>
                <MenuItem value={"Adventure bikes"}>Adventure bikes</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="filled-basic"
              variant="outlined"
              placeholder="search"
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                flexGrow: 1,
              }}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
            />
            <IconButton
              type="submit"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={() => {
                setValuePass(searchValue);
              }}
            >
              <SearchIcon />
            </IconButton>
            <Button
              variant="contained"
              color="warning"
              endIcon={
                <Badge badgeContent={cart.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              }
              onClick={() => {
                history.push("/cart");
              }}
            >
              Cart
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <ListProducts searchWord={valuePass} category={category} />
    </div>
  );
}

export { ProductPage };
