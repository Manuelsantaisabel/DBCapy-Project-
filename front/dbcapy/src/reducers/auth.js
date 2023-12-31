import{
    LOGIN_SUCCESS ,
    LOGIN_FAIL ,
    SIGNUP_FAIL,
    SIGNUP_SUCCESS,
    ACTIVATION_FAIL,
    ACTIVATION_SUCCESS,
    LOAD_SUCCESS,
    LOAD_FAIL ,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    PASSWORD_RESET_SUCCES,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCES,
    PASSWORD_RESET_CONFIRM_FAIL
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated : null,
    user: null
};

export default function(state= initialState, action ){
    const {type, payload}= action;

    switch(type){

        case AUTHENTICATED_FAIL:
            return{
                ...state,
                isAuthenticated: false
            }
        case AUTHENTICATED_SUCCESS:
            return{
                ...state,
                isAuthenticated: true
            }    
        case LOGIN_SUCCESS: 
            localStorage.setItem('access',payload.access);
            return {
                ...state, 
                isAuthenticated: true,
                access:payload.access,
                refresh:payload.refresh
            }
        case SIGNUP_SUCCESS:
            return{
                ...state,
                isAuthenticated: false
            }

        case LOAD_SUCCESS:
            return {
                ...state,
                user:payload
            }
        case LOAD_FAIL:
            return{
                ...state,
                user:null
            }
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access:null,
                refresh:null,
                isAuthenticated:false, 
                user:null
            }
        
        
        case PASSWORD_RESET_SUCCES:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCES:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_FAIL:
        case ACTIVATION_SUCCESS:

            return {
                ...state
            }
        default: 
            return state
    }
}