import { configureStore } from "@reduxjs/toolkit";
import { sheetReducer } from "./reducer/excelSheetReducer.js";

const store = configureStore ({
    reducer: {
        sheetDetail:sheetReducer,
    }
})

export default store;

