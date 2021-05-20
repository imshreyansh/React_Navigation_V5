import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'
const ApnsToFcmKey = `key=AAAAyNGfEtM:APA91bFNcEgb-ALf2GFBJTQi58WUkcEiEb21TBjWmEuw4LumdDTNVyNw715sFL0FFR01FEFQvgnvnsk5C-hMbbJZscJbKrKPUxKlpBzfUD9DQNz7doeh-vZlfpXRKhPDAupnjfUTgIqM`
//Get notifications
export const getUserNotification = (data) => {
    return axios
        .post(`${URL}/api/notification/getUserNotification`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Read User notifications
export const readUserNotifications = (data) => {
    return axios
        .post(`${URL}/api/notification/readNotification`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Clear notifications
export const clearUserNotifications = (data) => {
    return axios
        .post(`${URL}/api/notification/deleteNotification`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Off notifications
export const notificationOff = (data) => {
    return axios
        .post(`${URL}/api/credential/updateNotification`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//APN to FCM 
export const ApnToFCM = (data) => {
    return axios
        .post(`https://iid.googleapis.com/iid/v1:batchImport`, data,{
            headers: {
                'Authorization': ApnsToFcmKey
            }
        })
        .then(res => {
            return res
        })
        .catch((err) => {
            console.log(err)
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