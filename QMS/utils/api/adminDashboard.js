import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'


//Get Member DashBoard
export const getMemberDashBoard = (data) => {
    return axios
        .post(`${URL}/api/dashboard/getMemberDashBoard`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}


//Get Member Package Distribution
export const getPackageDistribution = (data) => {
    return axios
        .post(`${URL}/api/dashboard/getPackageDistribution`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Most Selling Product
export const getMostSellingStock = (data) => {
    return axios
        .post(`${URL}/api/dashboard/getMostSellingStock`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get System Year
export const getSystemYear = () => {
    return axios
        .get(`${URL}/api/master/getSystemYear`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Branch Sales 
export const getAllBranchSales = (data) => {
    return axios
        .post(`${URL}/api/dashboard/getAllBranchSales`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Member Attendance 
export const getMemberAttendanceDashboard = (data) => {
    return axios
        .post(`${URL}/api/dashboard/getMemberAttendanceDashboard`, data)
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