import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'

//Get Diet for member by date
export const getMemberDietByDate = (data) => {
    return axios
        .post(`${URL}/api/diet/getMemberDietByDate`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Details of Diet for member by dietplan id
export const getMemberDietDetails = (id) => {
    return axios
        .get(`${URL}/api/diet/getMemberDietById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get workouts of a member by date 
export const getMemberWorkoutByDate = (data) => {
    return axios
        .post(`${URL}/api/workout/getMemberWorkoutByDate`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get Details of Workout for member by Workout id
export const getMemberWorkoutDetails = (id) => {
    return axios
        .get(`${URL}/api/workout/getWorkoutById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Add workout attendance for member
export const addMemberWorkoutAttendees = (data) => {

    return axios
        .post(`${URL}/api/workout/addMemberWorkoutAttendees`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get workout attendance for member
export const getMemberWorkoutAttendees = (data) => {

    return axios
        .post(`${URL}/api/workout/getMemberWorkoutExist`, data)
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