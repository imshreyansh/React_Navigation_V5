import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'



export const getUserDetailsById = (id) => {
    return axios
        .get(`${URL}/api/employee/getEmployeeById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getPeriodOfTrainer = (data) => {
    return axios
        .post(`${URL}/api/master/getPeriodOfTrainer`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getAllMemberFromTrainer = (id) => {
    return axios
        .post(`${URL}/api/employee/getAllMemberOfTrainer/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const starRating = (data) => {
    return axios
        .post(`${URL}/api/employee/trainerRating`, data)
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