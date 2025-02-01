// import { Button } from "@nextui-org/react";
// import React, { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import { toast } from "react-toastify";
// import { registerSheet } from "../../action/excalSheetAction";
// import { useDispatch } from "react-redux";

// export default function MyDropzone() {
//   const [uploadedFiles, setUploadedFiles] = useState([]);
//   const dispatch = useDispatch()

//   const onDrop = useCallback (
//     (acceptedFiles) => {
//         setUploadedFiles(acceptedFiles);
//   },[]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: ".xlsx", // Accept only .xlsx files
//     maxSize: 2 * 1024 * 1024, // 2MB file size limit
//   });

//   const handleUploadFile = async (e) => {
//     e.preventDefault();

//     const myForm = new FormData();

//     myForm.append("file", uploadedFiles[0]);

//     try {
//       const response = await dispatch(registerSheet(myForm));
//       console.log(response.success, response.status);
      
//       if (response.status === 200 || response.success === 200) {
//           toast.success(response.message);
//           setUploadedFiles('');
//       } else {
//           toast.error(response?.data?.message || "Failed to save excel data");
//       }
//     } catch (err) {
//       console.log(err);
      
//       toast.error(err.response?.data?.message || err.message);
//     }
//     };
  
//   return (
//     <div className="flex flex-col w-full justify-center items-center mt-12 mb-12">
//       <label
//         htmlFor="dropzone-file"
//         className="flex flex-col items-center justify-center pl-10 pr-10 md:w-4/5 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-sky-50 hover:bg-sky-100"
//       >
//         <div {...getRootProps()} className="flex flex-col items-center justify-center pt-5 pb-6">
//           <input {...getInputProps()} />
//           <svg
//             className="w-10 h-10 mb-3 text-gray-700"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//             ></path>
//           </svg>

//           {isDragActive ? (
//             <p className="text-sm text-gray-500">Drop the file here...</p>
//           ) : (
//             <>
//               <p className="mb-2 text-sm text-gray-500">
//                 <span className="font-semibold">Click to upload</span> or drag and drop
//               </p>
//               <p className="text-xs text-gray-500">Only .xlsx files (Max 2MB)</p>
//             </>
//           )}
//         </div>
//       </label>

//       {/* File List */}
//       <aside className="mt-4">
//         {uploadedFiles.length > 0 && (
//           <span className="text-sm text-gray-700">
//             <b>{uploadedFiles[0]?.name || "N/A"} ({(uploadedFiles[0]?.size / 1024 || 0).toFixed(2)} KB)</b>
//           </span>
//         )}
//       </aside>

//       <Button color="primary" className="mt-4" type="submit" onClick={handleUploadFile}>
//         Save File to Database
//       </Button>
//     </div>
//   );
// }








import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { registerSheet } from "../../action/excalSheetAction";
import { useDispatch } from "react-redux";

export default function MyDropzone() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".xlsx",
    maxSize: 2 * 1024 * 1024,
  });

  const handleUploadFile = async (e) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      toast.error("Please select a file before uploading.");
      return;
    }

    const myForm = new FormData();
    myForm.append("file", uploadedFiles[0]);

    try {
      const response = await dispatch(registerSheet(myForm));
      console.log(response.success, response.status);

      if (response.status === 200 || response.success === 200) {
        toast.success(response.message);
        setUploadedFiles([]);
        setValidationErrors([]);
      } else {
        // Check for validation errors
        if (response?.data?.errors) {
          setValidationErrors(response.data.errors);
          setIsModalOpen(true);
        } else {
          toast.error(response?.data?.message || "Failed to save excel data");
        }
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.data) {  // Corrected path
        setValidationErrors(err.response.data.data);
        setIsModalOpen(true);
      } else {
        toast.error(err.response?.data?.message || err.message);
      }
    }
    
  };

  return (
    <div className="flex flex-col w-full justify-center items-center mt-12 mb-12">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center pl-10 pr-10 md:w-4/5 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-sky-50 hover:bg-sky-100"
      >
        <div {...getRootProps()} className="flex flex-col items-center justify-center pt-5 pb-6">
          <input {...getInputProps()} />
          <svg
            className="w-10 h-10 mb-3 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>

          {isDragActive ? (
            <p className="text-sm text-gray-500">Drop the file here...</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Only .xlsx files (Max 2MB)</p>
            </>
          )}
        </div>
      </label>

      {/* File List */}
      <aside className="mt-4">
        {uploadedFiles.length > 0 && (
          <span className="text-sm text-gray-700">
            <b>
              {uploadedFiles[0]?.name || "N/A"} ({(uploadedFiles[0]?.size / 1024 || 0).toFixed(2)} KB)
            </b>
          </span>
        )}
      </aside>

      <Button color="primary" className="mt-4" type="submit" onClick={handleUploadFile}>
        Save File to Database
      </Button>

      {/* Validation Error Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Validation Errors</ModalHeader>
          <ModalBody>
            {validationErrors.length > 0 && (
              <ul className="list-disc pl-5 text-red-600">
                {validationErrors.map((data, index) => (
                  <li key={index}>
                    <b>Row {data.rowNumber}:</b> {data.errors}
                  </li>
                ))}
              </ul>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
