import { REGISTER_SHEET_REQUEST, REGISTER_SHEET_SUCCESS, REGISTER_SHEET_FAIL, GET_SHEET_REQUEST, GET_SHEET_SUCCESS, GET_SHEET_FAIL, DELETE_ROW_REQUEST, DELETE_ROW_SUCCESS, DELETE_ROW_FAIL} from "../constrants/ATSConstrants";
import axios from "axios"

console.log(import.meta.env.VITE_BACKEND_URL) // "123"
export const registerSheet = (myForm) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_SHEET_REQUEST });
        
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/registerSheet`, myForm, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
        },
        });

        dispatch({ type: REGISTER_SHEET_SUCCESS, payload: data });
        return data;

    } catch (error) {
        dispatch({
          type: REGISTER_SHEET_FAIL,
          payload: error.response?.data?.message || error.message,
        });
        throw error;
      }
};

export const getSheetDetails = () => async (dispatch) => {
    try {
        dispatch({ type: GET_SHEET_REQUEST });

        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getSheetDetails`);
    
        dispatch({ type: GET_SHEET_SUCCESS, payload: response.data });
        return response;

    } catch (error) {
        dispatch({ type: GET_SHEET_FAIL, payload: error.response?.data?.message || error.message });
        throw error;
    }
};

export const deleteRow = (credentials) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_ROW_REQUEST });
        
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/deleteRow`,credentials);

        console.log('API response:', data);

        dispatch({ type: DELETE_ROW_SUCCESS, payload: data });
        return data;

    } catch (error) {
        dispatch({
          type: DELETE_ROW_FAIL,
          payload: error.response?.data?.message || error.message,
        });
        throw error;
      }
};

