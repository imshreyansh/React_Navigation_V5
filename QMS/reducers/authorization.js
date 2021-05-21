import { LOGIN_USER } from '../actions/types'

export default function loginUser(state = null, action) {
    const { type, payload } = action

    switch (type) {
        case LOGIN_USER:
            return payload

        default:
            return state
    }
}