import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "../Navbar/Navbar";
import NavbarResponsive from "../NavbarResponsive/NavbarResponsive";
import CreateStory from "../CreateStory/CreateStory";
import ShowAllBooks from "../ShowAllBooks/ShowAllBooks";
import Footer from "../Footer/Footer";
import '../Home/Home.css';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../../context/UserAuthContext'
import { Button } from 'react-bootstrap'

function Home() {

    const { logOut, user } = useUserAuth();

    console.log(user);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logOut();
            navigate('/');
        } catch(err) {
            console.log(err.message);
        }
    }
    const [hamActive, setHamActive] = useState(false);

  return (
    <div className="Home">
        <Navbar hamActive={hamActive} setHamActive={setHamActive} />
        <NavbarResponsive hamActive={hamActive} />
        <CreateStory />
        <ShowAllBooks />
        <Footer />
    </div>
  )
}

export default Home