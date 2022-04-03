import "./App.css";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useState, useContext } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Switch, useHistory, Route } from "react-router-dom";
import BusinessTwoToneIcon from "@mui/icons-material/BusinessTwoTone";
import LocalPhoneTwoToneIcon from "@mui/icons-material/LocalPhoneTwoTone";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import FormControl from "@mui/material/FormControl";
import { ProductPage } from "./Product";
import { CartContext } from "./context/CartContext";
import { CartPage } from "./CartPage";
import TextField from "@mui/material/TextField";
import emailjs from "@emailjs/browser";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

function App() {
  const history = useHistory();

  const [cart, setCart] = useState([]);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <CartContext.Provider
      value={{ cart, setCart, username, setUserName, password, setPassword }}
    >
      <div className="App">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ marginRight: "auto" }}
              >
                Rental App
              </Typography>
              <Button
                style={{ marginLeft: "auto" }}
                color="inherit"
                onClick={() => history.push("/")}
              >
                Home
              </Button>
              <Button color="inherit" onClick={() => history.push("/products")}>
                Products
              </Button>
              <Button color="inherit" onClick={() => history.push("/contact")}>
                Contact Us
              </Button>
              {username ? (
                <Button color="inherit">{username}</Button>
              ) : (
                <Button color="inherit" onClick={() => history.push("/signup")}>
                  Signup
                </Button>
              )}
              {username ? (
                <Button
                  color="inherit"
                  onClick={() => {
                    setUserName("");
                    setPassword("");
                    history.push("/");
                  }}
                >
                  Log out
                </Button>
              ) : (
                <Button color="inherit" onClick={() => history.push("/login")}>
                  Login
                </Button>
              )}
            </Toolbar>
          </AppBar>
        </Box>
        <Switch>
          <Route path="/products">
            <ProductPage />
          </Route>
          <Route path="/contact" exact>
            <ContactPage />
          </Route>
          <Route path="/cart">
            <CartPage />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </CartContext.Provider>
  );
}

function Homepage() {
  return (
    <div>
      <h1>Welcome to Rental List webSite</h1>
    </div>
  );
}

function Signup() {
  const history = useHistory();

  const [name, setName] = useState();
  const { username, setUserName, password, setPassword } =
    useContext(CartContext);

  const loginUser = (data) => {
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((data) => {
        history.push("/");
      });
  };

  return (
    <div className="inputField">
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-name"
          label="Username"
          style={{ width: "100%", margin: "10px" }}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <TextField
          id="outlined-name"
          label="Password"
          style={{ width: "100%", margin: "10px" }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </Box>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          const obj = {
            username: username,
            password: password,
          };

          // setMovies([...movies, obj]);
          setUserName(name);
          loginUser(obj);
        }}
      >
        Sign up
      </Button>
    </div>
  );
}

function Login() {
  const history = useHistory();

  const { username, setUserName, password, setPassword } =
    useContext(CartContext);

  const [name, setName] = useState();

  const loginUser = (data) => {
    fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((data) => {
        history.push("/");
      });
  };

  const createUser = (data) => {
    fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((data) => {
        loginUser(data);
      });
  };

  return (
    <div className="inputField">
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-name"
          label="Username"
          style={{ width: "100%", margin: "10px" }}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <TextField
          id="outlined-name"
          label="Password"
          style={{ width: "100%", margin: "10px" }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
      </Box>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => {
          const obj = {
            username: username,
            password: password,
          };

          setUserName(name);
          // setMovies([...movies, obj]);
          createUser(obj);
        }}
      >
        Login
      </Button>
    </div>
  );
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const YOUR_SERVICE_ID = "service_irqfaqs";
  const YOUR_TEMPLATE_ID = "template_rzo9jtw";
  const YOUR_USER_ID = "aGb_Yh8bfLMu4WlzP";
  const template_params = {
    full_name: name,
    email: email,
    message: msg,
  };
  function sendEmail(e) {
    e.preventDefault(); //This is important, i'm not sure why, but the email won't send without it

    emailjs
      .send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, template_params, YOUR_USER_ID)
      .then(
        (result) => {
          window.location.reload(); //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior)
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  return (
    <div>
      <h1>Contact Us</h1>
      <div className="contactUsContact">
        <div className="contactDetail">
          <div className="alignbetween">
            <BusinessTwoToneIcon />
            <div className="alignDetailLeft">
              <span>Address</span>
              <br></br>
              130A , Rajiv gandhi Nagar,<br></br>
              Sowripalyam, <br></br>
              Coimbatore -28
            </div>
          </div>
          <div className="alignbetween">
            <LocalPhoneTwoToneIcon />
            <div className="alignDetailLeft">
              <span>Phone</span>
              <br></br>
              9698412358
            </div>
          </div>
          <div className="alignbetween" sx={{ textAlign: "left" }}>
            <EmailTwoToneIcon />
            <div className="alignDetailLeft">
              <span>E-mail</span>
              <br></br>
              nandhakumar@gmail.com
            </div>
          </div>
        </div>
        <div className="contactForm">
          <h4>Send Message</h4>
          <form onSubmit={sendEmail}>
            <div className="contactFormContent">
              <FormControl variant="standard">
                <TextField
                  required
                  id="outlined-required"
                  label="Full Name"
                  variant="standard"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  style={{ width: "30vw" }}
                />
              </FormControl>
            </div>
            <div className="contactFormContent">
              <FormControl variant="standard">
                <TextField
                  required
                  id="outlined-required"
                  label="Email"
                  variant="standard"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  style={{ width: "30vw" }}
                />
              </FormControl>
            </div>
            <div className="contactFormContent">
              <FormControl variant="standard">
                <TextField
                  required
                  id="outlined-required"
                  label="Message"
                  variant="standard"
                  value={msg}
                  onChange={(event) => {
                    setMsg(event.target.value);
                  }}
                  style={{ width: "30vw" }}
                />
              </FormControl>
            </div>
            <Button
              variant="outlined"
              className="product-cart"
              color="primary"
              endIcon={<SendIcon />}
              type="submit"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
