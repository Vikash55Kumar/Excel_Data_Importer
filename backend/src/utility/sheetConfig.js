export const sheetConfig = {
    default: {
        requiredFields: [
            "Name", 
            "Amount", 
            "Date", 
            "Verified"
        ],
        dateFields: ["Date"],
        allowPreviousMonthDates: false,
        allowZeroAmount: false,
    },
    invoiceSheet: {
        requiredFields: [
            "Name", 
            "Amount", 
            "Invoice Date", 
            "Receipt Date", 
            "Verified"
        ],
        dateFields: [
            "Invoice Date", 
            "Receipt Date"
        ],
        allowPreviousMonthDates: true,
        allowZeroAmount: true,
    },
};
