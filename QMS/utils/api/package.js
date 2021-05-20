import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'



//Get All Packages 
export const getAllPackage = () => {
    return axios
        .get(`${URL}/api/master/getAllPackage`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Packages By ID
export const getPackagesByID = (id) => {
    return axios
        .get(`${URL}/api/master/getPackageById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get Packages By ID
export const getTrainerByBranchId = (id) => {
    return axios
        .get(`${URL}/api/master/getUniqueTrainerByBranch/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Pay At Gym Mobile
export const payAtGymMobile = (data, id) => {
    return axios
        .post(`${URL}/api/member/payAtGymMobile/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Pay Online
export const payOnline = (data) => {
    return axios
        .post(`${URL}/api/member/createPayForMobile`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Start package for the first time
export const startPackage = (data) => {
    return axios
        .post(`${URL}/api/member/startPackage`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get  package VAT default
export const getDefaultVat = (data) => {
    return axios
        .post(`${URL}/api/finance/getDefaultVat`, data)
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