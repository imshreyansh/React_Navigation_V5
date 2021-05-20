import axios from 'axios'
import { showMessage, hideMessage } from "react-native-flash-message";
import { URL } from './helpers'


//Member Registration
export const registerMember = data => {
    return axios
        .post(`${URL}/api/member/createNewMember`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Member Details Update
export const updateMember = (id, data) => {
    return axios
        .post(`${URL}/api/member/updateMemberDetails/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Member Token Verification
export const verify = data => {
    return axios
        .post(`${URL}/api/member/generateToken`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Member Login
export const loginMember = data => {
    return axios
        .post(`${URL}/api/credential/login`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get User Details by credentials ID
export const getUserDetailsById = (id) => {
    return axios
        .get(`${URL}/api/member/getMemberByCredentialId/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get User Details by credentials ID
export const getUserByCredentials = (id) => {
    return axios
        .get(`${URL}/api/credential/getUserById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get All Branch 
export const getAllBranch = () => {
    return axios
        .get(`${URL}/api/master/getAllBranch`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Branch By ID
export const getBranchById = (id) => {
    return axios
        .get(`${URL}/api/master/getBranchById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Get Designation By ID
export const getDesignationById = (id) => {
    return axios
        .get(`${URL}/api/master/getDesignationById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Currency
export const getCurrency = () => {
    return axios
        .get(`${URL}/api/master/getDefaultCurrency`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Adding push token 

export const pushToken = (id, data) => {
    return axios
        .post(`${URL}/api/credential/addReactToken/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//get member by id
export const getMemberById = (id) => {
    return axios
        .get(`${URL}/api/member/getMemberById/${id}`)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Forgot password
export const forgotPassword = (data) => {
    return axios
        .post(`${URL}/api/credential/forgotPassword`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Change password
export const changePassword = (data) => {

    return axios
        .post(`${URL}/api/credential/changePassword`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Member Profile Details Update
export const updateMemberProfile = (id, data) => {
    return axios
        .post(`${URL}/api/member/updateMemberProfile/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Employee Profile Details Update
export const updateEmployeeProfile = (id, data) => {
    return axios
        .post(`${URL}/api/employee/updateEmployeeProfile/${id}`, data)
        .then(res => {
            return res
        })
        .catch((err) => {
            this.errorHandlerAlert(err)
        });
}

//Logout user
export const logout = (data) => {
    return axios
        .post(`${URL}/api/credential/logOut`, data)
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