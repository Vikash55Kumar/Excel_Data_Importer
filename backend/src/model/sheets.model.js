import mongoose, { Schema } from "mongoose";

const sheetsSchema = new mongoose.Schema(
    {
        fileName: { 
            type: String, 
            required: true,
            unique: true
        },
        sheetData: { 
            type: Array, 
            required: true 
        },
        
    }, {timestamps: true}
)

export const Sheets = mongoose.model('Sheets', sheetsSchema);