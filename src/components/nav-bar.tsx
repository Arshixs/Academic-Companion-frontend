import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logophoto from "../images/logo_transparent.png";
import "./styles/navbar.css";

function Logo() {
  return <img width="200px" className="logo-navbar" src={logophoto} alt="elevate"></img>;
}

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="navbar">
      <div className="container">
        <div className="navbar-logo">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <ul className="navbar-links">
          <li>
            <Link className="link" to="/diet">
              <p className="link">Diet Plan</p>
            </Link>
          </li>
          <li>
            <Link className="link" to="/workout">
              <p className="link">Workout Plan</p>
            </Link>
          </li>
          <li>
            <Link className="link" to="/progress">
              <p className="link">Track My Progress</p>
            </Link>
          </li>
          <li>
            <Link className="link" to="/community">
              <p className="link">Community</p>
            </Link>
          </li>
          {isAuthenticated ? (
            <li>
              <Link className="link" to="/dashboard">
                <p className="link">My Profile</p>
              </Link>
            </li>
          ) : (
            <li>
              <Link className="link" to="/login">
                <p className="link">Login</p>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;