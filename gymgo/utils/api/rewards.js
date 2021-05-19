import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'



//Get All Gift Cards
export const getAllGiftCards = () => {
    return axios
        .get(`${URL}/api/reward/getAllGiftcard`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Gift Cards by id
export const getGiftcardById = (id) => {
    return axios
        .get(`${URL}/api/reward/getGiftcardById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All Policy
export const getAllPolicy = () => {
    return axios
        .get(`${URL}/api/reward/getAllPolicy`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Policy by id
export const getPolicyById = (id) => {
    return axios
        .get(`${URL}/api/reward/getPolicyById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All offers
export const getAllOffer = () => {
    return axios
        .get(`${URL}/api/offer/getAllOffer`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All offers
export const generateCode = (obj) => {
    return axios
        .post(`${URL}/api/reward/referFriend`, obj)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All User Transactions
export const getUserTransactions = (obj) => {
    return axios
        .post(`${URL}/api/reward/getMemberTransaction`, obj)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Redeeem Offer
export const redeemOffer = (obj) => {
    return axios
        .post(`${URL}/api/reward/redeemOffer`, obj)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//cancel Redeeem Offer
export const cancelRedeem = (obj) => {
    return axios
        .post(`${URL}/api/reward/cancelRedeem`, obj)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Redeeem Offer
export const getRedeemOffer = (obj) => {
    return axios
        .post(`${URL}/api/reward/getRedeemCode`, obj)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Check Referral code
export const checkReferralCodeValidity = (obj) => {

    return axios
        .post(`${URL}/api/reward/checkReferralCodeValidity`, obj)
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