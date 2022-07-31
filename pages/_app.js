import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/globals.css'
import Navbar from './components/Navbar'
import { useState, useEffect } from "react";
import Alert_msg from './components/Alert_msg';

function MyApp({ Component, pageProps }) {
  // https://blog.logrocket.com/handling-bootstrap-integration-next-js/
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
      }, []);
      
  return(
    <> 
      <Navbar />
     <Component {...pageProps} />

  </>);
}

export default MyApp
