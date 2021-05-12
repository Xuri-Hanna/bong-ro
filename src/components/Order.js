import React, { useState, useEffect } from 'react'
import cartService from '../services/cartService'
import CartProduct from "./CartUtils/CartProduct";
import { Link, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField'
import { useFormik } from "formik"
import orderService from '../services/orderService'

const Order = () => {
    const [user, setUser] = useState(null)
    const [data, setData] = useState([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [notification, setNotification] = useState(null);
    const [success, setSuccess] = useState(false)
    const history = useHistory()

    const getTotalPrice = () => {
        let total = 0;
        if (data) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].previousPrice) {
                    total += data[i].previousPrice;
                } else {
                    total += data[i].unitPrice;
                }
            }
        }
        return total;
    };

    const handleNotification = (message, success) => {
        setNotification(message);
        setSuccess(success)
        setTimeout(() => setNotification(null), 3000);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    const OrderForm = () => {
        const formik = useFormik({
            initialValues: {
                address: "",
                creditCartNumber: "",
                expirationDate: "",
                cvcNumber: ""
            },

            onSubmit: async (values) => {
                console.log("order", values);
                try {
                    const response = await orderService.createOrder(values['address'])
                    if (response.status) {
                        handleNotification("Order is created", true);
                        await sleep(3000);
                        history.push("/")
                    } else {
                        handleNotification("Wrong Credentials. Please try again", false);
                    }
                } catch (exception) {
                    handleNotification("Something is wrong", false);
                }
            },
            validateOnChange: false,
            validateOnBlur: false,
        });

        return (
            <div>

                <div>

                    <form
                        onSubmit={formik.handleSubmit}
                        className="orderForm"
                        data-testid="form"
                    >

                        <TextField
                            variant="outlined"
                            type="text"
                            id="text"
                            label="Address for Order"
                            {...formik.getFieldProps("address")}
                        />


                        <TextField
                            variant="outlined"
                            type="text"
                            id="creditCartNumber"
                            label="Credit Cart Number"
                            {...formik.getFieldProps("creditCartNumber")}
                        />

                        <TextField
                            variant="outlined"
                            type="text"
                            id="expirationDate"
                            label="Expiration Date"
                            {...formik.getFieldProps("expirationDate")}
                        />

                        <TextField
                            variant="outlined"
                            type="text"
                            id="cvcNumber"
                            label="CVC Number"
                            {...formik.getFieldProps("cvcNumber")}
                        />


                        <Button type="submit" variant="contained" color="primary">
                            Satın Al
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    useEffect(() => {
        setUser(JSON.parse(window.localStorage.getItem("logged")))
        cartService.getCartProducts().then((response) => {
            if (response.status) {
                setData(response.cart);
            }
        });
        setTotalPrice(getTotalPrice())
    }, [])

    if (user) {
        return (
            <div>
                {notification && <Alert severity={success ? "info" : "error"}>{notification}</Alert>}
                {data?.length !== 0 ? (
                    <div className="cart_div_order">
                        <Grid direction="column" spacing={5}>
                            {data?.map((product) => (
                                <CartProduct
                                    product={product}
                                    showButton={false}
                                />
                            ))}
                        </Grid>

                        <OrderForm />

                        {/* <div className="checkout_price">
                            <Typography
                                variant="body"
                                component="h2"
                                gutterBottom
                            >
                                Total Price : {totalPrice}$
                            </Typography>
                            <Link to="/order"><Button variant="outlined" color="secondary">Checkout</Button></Link>
                        </div> */}
                    </div>
                ) : (
                    <Alert severity="info">
                        There is no item in the cart
                    </Alert>
                )}
            </div>
        )
    } else {
        return (
            <p>Loading user</p>
        )
    }

}

export default Order