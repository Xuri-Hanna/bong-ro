import axios from 'axios'

const getToken = () => {
    const logged = window.localStorage.getItem('logged')
    return JSON.parse(logged).token
}

const createOrder = async (address) => {
    let token = getToken()
    let body = {
        address,
        token
    }
    const url = "/api/order"

    const response = await axios.post(url, body)
    return response.data
}


const getAllOrders = async () => {
    const url = "/api/orders"
    const response = await axios.get(url)
    return response.data
}

const updateOrderStatus = async (id, value) => {
    const url = `/api/order/${id}`
    const response = await axios.put(url, {
        status: value
    })
    return response.data
}

const getUserOrders = async (id) => {
    const url = `/api/orders/${id}`
    const response = await axios.get(url)
    return response.data
}

const orderService = { createOrder, getAllOrders, updateOrderStatus, getUserOrders }

export default orderService