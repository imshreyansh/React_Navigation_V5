import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'



export const getAllShiftByBranch = (data) => {
    return axios
        .post(`${URL}/api/shift/getAllShiftByBranch`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getAllEmployeeShiftByShiftAndBranchAndEmployee = (data) => {
    return axios
        .post(`${URL}/api/shift/getAllEmployeeShiftByShiftAndBranchAndEmployee`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const bookAppointment = (data) => {
    return axios
        .post(`${URL}/api/appointment/bookAppointment`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getMemberAppointmentHistory = (data) => {
    return axios
        .post(`${URL}/api/appointment/getMemberAppointmentHistory`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getMemberTraffic = (data) => {
    return axios
        .post(`${URL}/api/appointment/getMemberTraffics`, data)
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