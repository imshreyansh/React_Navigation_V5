import { LOGIN_USER } from './types'

export const loginUser = (data) => dispatch => {
    dispatch({ type: LOGIN_USER, payload: data })
}