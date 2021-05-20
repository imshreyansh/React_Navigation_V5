import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'


//Add Member Water Intake
export const addWaterInTake = (data) => {
    return axios
        .post(`${URL}/api/member/addWaterInTake`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Update Member Water Intake
export const updateMemberWaterInTake = (data) => {

    return axios
        .post(`${URL}/api/member/updateMemberWaterInTake`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get Member Water Intake
export const getMemberWaterInTake = (data) => {

    return axios
        .post(`${URL}/api/member/getMemberWaterInTake`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Add Reminder
export const addMemberReminder = (data) => {

    return axios
        .post(`${URL}/api/member/addMemberReminder`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get Reminder
export const getMemberReminderByDate = (data) => {

    return axios
        .post(`${URL}/api/member/getMemberReminderByDate`, data)
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