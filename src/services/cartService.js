import axios from 'axios'

let token = null

const setToken = newToken => {
    token = newToken
}

const addProductCard = async (id) => {
    const url = `/api/cart/${id}`
    const bodyToSend = { token }
    const response = await axios.post(url, bodyToSend)
    return response.data
}

const getCartProducts = async () => {
    const url = "/api/cart"
    /* var data = JSON.stringify({ token })
    console.log(data)
    var config = {
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    }; */
    const response = await axios.get(url, {params: {token}})
    return response.data
}

const cartService = { addProductCard, setToken, getCartProducts }

export default cartService