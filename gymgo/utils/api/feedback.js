import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'

export const addFeedback = (data) => {
    return axios
        .post(`${URL}/api/feedback/addFeedback`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getMemberFeedback = (data) => {
    return axios
        .post(`${URL}/api/feedback/getMemberFeedback`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getFeedbackList = (data) => {
    return axios
        .post(`${URL}/api/feedback/getFeedbackList`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const updateFeedback = (data, id) => {
    return axios
        .put(`${URL}/api/feedback/updateFeedback/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

export const getFeedbackById = (id) => {
    return axios
        .get(`${URL}/api/feedback/getFeedbackById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


export const getActiveStatusRegisterMembers = (data) => {
    return axios
        .post(`${URL}/api/member/getActiveStatusRegisterMembers`, data)
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