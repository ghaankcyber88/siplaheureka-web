import { AUTH } from "./authActionTypes";
const initialInit = false;

function auth(state, auth) {
    state = auth;
    return state;
}

export default function authReducer(state = initialInit, action) {
    switch (action.type) {
        case AUTH:
            return auth(state, action.auth);
        default:
            return state;
    }
}
