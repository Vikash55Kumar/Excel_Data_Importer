import { Sheets } from "../model/sheets.model.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import XLSX from "xlsx";
import moment from "moment"
import { sheetConfig } from "../utility/sheetConfig.js";


export const registerSheet = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            throw new ApiError(400, "No file uploaded!")
        }

        const fileName = file.originalname;

        if (!fileName) {
            throw new ApiError(400, "Invalid file name!")
        };

        // Determine sheet type based on file name
        const sheetType = fileName.includes("invoice") ? "invoiceSheet" : "default";

        const config = sheetConfig[sheetType];

        // Check if file already exists
        const existingFile = await Sheets.findOne({ fileName });

        if (existingFile) { 
            throw new ApiError(400, "File already exists!")
        }

        // Read file from buffer
        const workbook = XLSX.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0]; // First sheet
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

        if (!jsonData.length) {
            throw new ApiError(400, "Empty file uploaded!")
        }

        // Validate required columns dynamically
        const requiredFields = config.requiredFields;

        if (!requiredFields.every((field) => jsonData[0]?.hasOwnProperty(field))) {
            throw new ApiError(400, error="File format does not match expected structure.");
        }

        let errors = [];
        let formattedData = jsonData.map((row, index) => {
            let rowErrors = [];

            // Validate required fields dynamically
            config.requiredFields.forEach((field) => {
                if (!row[field]) rowErrors.push(`${field} is required`);
            });

            // Handle multiple date fields
            config.dateFields.forEach((dateField) => {
                if (row[dateField]) {
                    let formattedDate;

                    if (!isNaN(row[dateField])) {
                        formattedDate = moment(
                            XLSX.SSF.format("DD-MM-YYYY", row[dateField]),
                            "DD-MM-YYYY"
                        );
                    } else {
                        formattedDate = moment(row[dateField], ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true);
                    }

                    if (!formattedDate.isValid()) {
                        rowErrors.push(`${dateField} format must be DD-MM-YYYY`);
                    } else if (
                        config.allowPreviousMonthDates
                            ? !formattedDate.isBetween(moment().startOf("month").subtract(1, "month"), moment().endOf("month"), "day", "[]")
                            : !formattedDate.isSame(moment(), "month")
                    ) {
                        rowErrors.push(`${dateField} must be within the allowed date range`);
                    }

                    row[dateField] = formattedDate.format("DD-MM-YYYY");
                }
            });

            // Validate Amount
            if (!row.Amount || isNaN(row.Amount) || (row.Amount <= 0 && !config.allowZeroAmount)) {
                rowErrors.push("Amount must be a valid number and greater than zero.");
            }

            // Validate Verified column
            if (!["Yes", "No"].includes(row.Verified)) {
                rowErrors.push('Verified must be "Yes" or "No"');
            }

            if (rowErrors.length > 0) {
                errors.push({
                    sheetName,
                    rowNumber: index + 1,
                    errors: rowErrors,
                });
            }

            return {
                rowId: index + 1,
                Name: row.Name || "",
                Amount: row.Amount || 0,
                ...config.dateFields.reduce((acc, dateField) => {
                    acc[dateField] = row[dateField] || "";
                    return acc;
                }, {}),
                Verified: row.Verified || "",
            };
        });

        if (errors.length > 0) {
            return res
            .status(400)
            .json(
                new ApiResponse(400, errors, "Validation Error")
            );
        }

        // Save to MongoDB
        const excelSheet = new Sheets({ fileName, sheetData: formattedData });

        const saveExcelSheet = await excelSheet.save();

        if (!saveExcelSheet) {
            throw new ApiError(500, "Server error while saving")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(200, saveExcelSheet, "Sheet Data saved successfully")
        );
    } catch (error) {
        console.error(error);
        return res.
        status(500).
        json(
            new ApiError(500, error.message)
        );
    }
};

export const getSheetDetails = async (req, res) => {
  try {
    const sheets = await Sheets.find({});

    return res
    .status(200)
    .json(
        new ApiResponse(200, sheets, "Sheet Data fetch successfully!")
    );

  } catch (error) {
    throw new ApiError(500, "Server error while fatching data")
  }
};

export const deleteRow = async (req, res) => {
    try {
        const {sheetId, rowId} = req.body;

        console.log("sheetId:", sheetId, "rowId:", rowId);

        if(!sheetId || !rowId) {
            throw new ApiError(400, "All fields are require")
        }
        const parsedRowId = Number(rowId); 
      const sheetsResult = await Sheets.findByIdAndUpdate(
        { '_id': sheetId, 'sheetData.rowId': parsedRowId },  // Find the sheet and the row by rowId
        { $pull: { 'sheetData': { rowId: parsedRowId } } },  // Pull the specific row from sheetData array
        { new: true }  // Return the updated document
      );

      if(!sheetsResult) {
        throw new ApiError(400, "Sheet or Row not found")
      }
  
      return res
      .status(200)
      .json(
          new ApiResponse(200, sheetsResult, "Row delete successfully!")
      );
  
    } catch (error) {
      throw new ApiError(500, "Server error while deleting row")
    }
  };
