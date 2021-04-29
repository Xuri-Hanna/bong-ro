import { CircularProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import cartService from "../services/cartService";
import CartProduct from "./CartUtils/CartProduct";

const Cart = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [success, setSuccess] = useState(true);

  useEffect(() => {
    const logged = window.localStorage.getItem("logged");
    if (logged) {
      console.log("I am logged", logged);
      setUser(true);
      cartService.getCartProducts().then((response) => {
        if (response.status) {
          setData(response.cart);
          setLoading(false);
        }
      });
    } else {
      setUser(false);
      const cart_without_user = window.localStorage.getItem(
        "cart_without_login"
      );
      console.log(cart_without_user);
      if (cart_without_user) {
        cartService
          .getProductWithoutUser(cart_without_user)
          .then((response) => {
            if (response.status) {
              setData(response.cart);
            }
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } else {
        handleNotification("There is no product", false);
        setLoading(false);
      }
    }
  }, []);

  const handleNotification = (message, isSuccess) => {
    setNotification(message);
    setSuccess(isSuccess);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (id) => {
    try {
      const response = await cartService.deleteProduct(id);
      console.log("response", response.user.products);
      if (response.status) {
        handleNotification("Product is deleted from the cart", true);
        setData(response.user.products);
      } else {
        handleNotification("There is a problem", false);
      }
    } catch (exception) {
      handleNotification("There is a problem", false);
    }
  };

  const handleDeleteUserless = (id) => {
    try {
      setLoading(true);
      const cart = window.localStorage.getItem("cart_without_login");
      if (!cart) {
        throw new Error("cannot find cart on local");
      }

      let currentCart = JSON.parse(cart);
      const index = currentCart.indexOf(id);
      if (index < 0) {
        throw new Error(`cannot delete {id}`);
      }
      setData(data.filter((product) => product !== data[index]));
      currentCart.splice(index, 1);

      window.localStorage.setItem(
        "cart_without_login",
        JSON.stringify(currentCart)
      );
    } catch (exception) {
      handleNotification("There is a problem", false);
      console.log(exception.message);
    }
    setLoading(false);
  };

  const ToShow = () => {
    if (user) {
      return (
        <div>
          <Grid direction="column" spacing={5}>
            {data?.map((product) => (
              <CartProduct product={product} handleDelete={handleDelete} />
            ))}
          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          <Grid direction="column" spacing={5}>
            {data?.map((product) => (
              <CartProduct
                product={product}
                handleDelete={handleDeleteUserless}
              />
            ))}
          </Grid>
        </div>
      );
    }
  };

  const LoadingScreen = () => (
    <div>
      <p>Loading products in cart</p>
      <CircularProgress />
    </div>
  );

  return (
    <div>
      {notification ? <Alert severity="info">{notification}</Alert> : null}
      {loading ? <LoadingScreen /> : <ToShow />}
    </div>
  );
};

export default Cart;
