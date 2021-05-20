import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'



//Get All Announcements
export const getAllAnnouncements = () => {
    return axios
        .post(`${URL}/api/announcement/getAllAnnouncement`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Announcements by id
export const getAnnouncementById = (id) => {
    return axios
        .get(`${URL}/api/announcement/getAnnouncementById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Add read by user
export const addReadByUser = (obj) => {
    return axios
        .post(`${URL}/api/announcement/addMemberRead`, obj)
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