import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'

//Get All Member
export const getAllMember = (id) => {
    return axios
        .get(`${URL}/api/member/getAllMember`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All Level
export const getAllWorkoutLevel = (id) => {
    return axios
        .get(`${URL}/api/workout/getAllWorkoutLevel`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Workout By Workout category
export const getByWorkoutCategory = data => {

    return axios
        .post(`${URL}/api/workout/getAllWorkoutByWorkoutCategory`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}



//Add Workout 
export const addWorkout = data => {

    return axios
        .post(`${URL}/api/workout/addMemberWorkout`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get All Diet Session
export const getAllDietSession = () => {
    return axios
        .get(`${URL}/api/diet/getAllDietSession`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All Diet Food
export const getAllDietFood = () => {
    return axios
        .get(`${URL}/api/diet/getAllDietFood`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Add member diet foodItems
export const addDiet = data => {

    return axios
        .post(`${URL}/api/diet/addMemberDiet`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get workouts of a member by trainer 
export const getMemberWorkoutByTrainer = (data) => {
    return axios
        .post(`${URL}/api/workout/getMemberWorkoutByDateForTrainer`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get workouts of a member by trainer 
export const getMemberDietByTrainer = (data) => {
    return axios
        .post(`${URL}/api/diet/getMemberDietByDate`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Update diet by id of member
export const updateDiet = (id, data) => {
    return axios
        .put(`${URL}/api/diet/updateMemberDietById/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Update workout by id of member
export const updateWorkout = (id, data) => {
    return axios
        .put(`${URL}/api/workout/updateMemberWorkoutById/${id}`, data)
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