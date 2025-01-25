import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton(props) {
  const navigate = useNavigate();

  const buttonStyle = {
    background: 'black',
    color: 'white'
  }

  const handleLogout = () => {
    // Remove the token from localStorage
    console.log('props',props)
    props.data === 'user'? localStorage.removeItem("accessToken"):
    localStorage.removeItem("accessTokenAdmin");
    
    // Redirect to the login page
    navigate("/login");
  };

  return <button style={buttonStyle} onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
