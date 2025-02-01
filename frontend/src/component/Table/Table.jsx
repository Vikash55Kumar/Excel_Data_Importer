import {Table} from "flowbite-react"
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteRow } from "../../action/excalSheetAction";
import { toast } from "react-toastify";

export default function Tables({sheetDetail = {}}) {
  const dispatch =  useDispatch()

  const [selectedSheet, setSelectedSheet] = useState(''); // Store selected sheet data
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sheetRowId, setSheetRowId] = useState(null);

  const handleSheetSelection = (sheetName) => {
    setSelectedSheet(sheetName);
  };

  const handleDeleteModel = (rowId) => {
    setSheetRowId(rowId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteRow = async() => {

    const myForm = new FormData();

    myForm.append("sheetId", selectedSheetData._id);
    myForm.append("rowId", sheetRowId.rowId);

    try {
      const response = await dispatch(deleteRow(myForm));

      if (response.status === 200 || response.success === 200) {
          toast.success(response.message);
          setSheetRowId('');
          setIsDeleteModalOpen(false);
      } else {
          toast.error(response?.data?.message || "Failed to delete row");
      }
    } catch (err) {
      console.log(err);
      
      toast.error(err.response?.data?.message || err.message);
    }
  };
  

  // Find the selected sheet data (use sheetDetail.data instead of sheetDetail)
  const selectedSheetData = sheetDetail.data?.find(sheet => sheet.fileName === selectedSheet);

  return (
<div className="flex flex-col justify-center items-center md:p-10 w-full  mt-12 mb-12">
  <div className="flex flex-col justify-center items-center md:w-[87%] md:border-3 md:border-gray-600 md:border-medium pt-8 pb-8">
    {/* Sheet Selection Dropdown */}
    <h2 className="font-bold text-2xl">Excel Sheet Imported data</h2>
    {sheetDetail.data?.length > 0 && (
      <div className="mt-4 w-full md:w-1/2 mb-8">
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedSheet}
          onChange={(e) => handleSheetSelection(e.target.value)}
        >
          {sheetDetail.data.map((sheet, index) => (
            <option key={index} value={sheet.fileName}>
              {sheet.fileName}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Table Display */}
    {selectedSheetData && selectedSheetData.sheetData && selectedSheetData.sheetData.length > 0 ? (
      <div className="overflow-x-auto mt-4 w-full md:w-4/5">
        <Table>
          <Table.Head className="bg-gray-200">
            {selectedSheetData.sheetData[0] && Object.keys(selectedSheetData.sheetData[0]).map((col, index) => (
              <Table.HeadCell key={index} className="px-4 py-2">
                {col}
              </Table.HeadCell>
            ))}
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {selectedSheetData.sheetData.slice(1).map((row, rowIndex) => (
              <Table.Row key={rowIndex} className="bg-white">
                {Object.values(row).map((cell, colIndex) => (
                  <Table.Cell key={colIndex} className="px-4 py-2">
                    {cell || "-"}
                  </Table.Cell>
                ))}
                {/* Delete Button */}
                <Table.Cell className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDeleteModel(row)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    ) : (
      <p className="mt-4 text-center text-gray-600">No data available for the selected sheet.</p>
    )}
  </div>

  {/* Delete Confirmation Modal */}
  {isDeleteModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h3 className="text-lg font-medium text-gray-700">
          Are you sure you want to delete this row?
        </h3>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              handleDeleteRow()
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg mr-2"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}

