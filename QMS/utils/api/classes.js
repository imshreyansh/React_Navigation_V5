import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'



//Get All Classes By Branch
export const getAllClassesByBranch = (data) => {
    return axios
        .post(`${URL}/api/classes/getAllClassesByBranch`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get  Classe By id
export const getClassById = (id) => {
    return axios
        .get(`${URL}/api/classes/getClassById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//pay for Classes 
export const payForClasses = (data) => {
    return axios
        .post(`${URL}/api/classes/purchaseClassByMember`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Schedule for Classes 
export const getSchedule = (data) => {
    return axios
        .post(`${URL}/api/classes/getCustomerClassesScheduleByDates`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get  All Events
export const getAllEvents = () => {
    return axios
        .get(`${URL}/api/event/getAllEventForAdmin`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get  Events By dates
export const getEventsByDate = (date) => {

    return axios
        .post(`${URL}/api/event/getEventsByDate`, date)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All Classes of Trainer
export const getMyClasses = (data) => {
    return axios
        .post(`${URL}/api/classes/getMyClasses`, data)
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