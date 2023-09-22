import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import githubIcon from "../../assets/github-icon.svg";

import "./Navbar.scss";

const Navbar = ({ isUser, setIsUser }) => {
  return (
    <div className="navBar">
      <div>
        <Link to="/">
          <img src={logo} alt="logo" />
          <p className="brand">LiteCode</p>
        </Link>
      </div>
      <div className="navLinks">
        <Link to="/problemset/all">
          <p className="links">Problems</p>
        </Link>
        {!isUser ? (
          <>
            <Link to="signup">
              <p className="links">Sign Up</p>
            </Link>
            <Link to="login">
              <p className="links">Log In</p>
            </Link>
          </>
        ) : (
          <Link
            to="/"
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              setIsUser(false);
            }}
          >
            <p>Log Out</p>
          </Link>
        )}
        <a
          href="https://www.github.com/sanskar-soni-9/litecode"
          target="_blank"
        >
          <img src={githubIcon} alt="github icon" />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
