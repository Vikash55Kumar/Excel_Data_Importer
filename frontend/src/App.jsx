import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getSheetDetails } from './action/excalSheetAction';
import Nav from './component/Navbar/Nav'
import { Foot } from './component/Footer/Foot'
import Home from './component/Home/Home';
import {ToastContainer} from "react-toastify"

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSheetDetails())
  }, [dispatch]);
  
  return (
    <>
      <ToastContainer 
        position="top-center"  
        autoClose={3000}  // Toast will disappear after 4 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
          <Nav/>
          <Routes>
            <Route path="/" element={<Home/>} />
          </Routes>
          <Foot />
      </Router>
    </>
  );
}

export default App
