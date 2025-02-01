import { Router } from "express";
import { deleteRow, getSheetDetails, registerSheet } from "../controller/sheet.controller.js";
import multer from "multer";

const router = Router()

const storage = multer.memoryStorage();
const upload = multer({storage})

router.route("/registerSheet").post(upload.single('file'), registerSheet)
router.route("/getSheetDetails").get(getSheetDetails)
router.route("/deleteRow").post(upload.single(), deleteRow)

export default router