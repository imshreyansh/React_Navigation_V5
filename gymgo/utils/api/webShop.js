import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'

//Get and Search Stocks
export const getAndSearchStock = (data) => {
    return axios
        .post(`${URL}/api/pos/getAllStocks`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get item by id
export const getStockById = (id) => {
    return axios
        .get(`${URL}/api/pos/getStocksById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Add to cart
export const addToCart = (data) => {
    return axios
        .post(`${URL}/api/pos/addToCart`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get item by id
export const getMemberCartById = (id) => {
    return axios
        .get(`${URL}/api/pos/getCartOfMember/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//remove from cart
export const removeFromCart = (data) => {
    return axios
        .post(`${URL}/api/pos/removeCart`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All offer
export const getAllOffer = () => {
    return axios
        .get(`${URL}/api/offer/getAllOffer/`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

errorHandlerAlert = (err) => {
    if (err.response.status >= 500) {
        showMessage({
            message: 'Server Error',
            type: "danger",
        })

    } else if (err.response.status >= 400 && err.response.status < 500) {
        showMessage({
            message: err.response.data.message,
            type: "danger",
        })

    }
}