import { 
    GET_SHEET_FAIL, 
    GET_SHEET_REQUEST, 
    GET_SHEET_SUCCESS,
}  from "../constrants/ATSConstrants.js"

export const sheetReducer = (state = {sheetDetail : []}, action) => {
    switch (action.type) {

        case GET_SHEET_REQUEST:
            return {
                ...state,
                loading : true,
                sheetDetail : []
            }
        
        case GET_SHEET_SUCCESS:
            return {
                ...state,
                loading : false,
                sheetDetail : action.payload
            }
        
        case GET_SHEET_FAIL:
            return {
                ...state,
                loading : false,
                sheetDetail : null,
                error : action.payload
        }
    
        default:
            return state;
    }
}
