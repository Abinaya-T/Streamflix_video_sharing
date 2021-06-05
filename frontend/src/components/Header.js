import React from "react";
import { Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./Header.css";
import { PopUp } from "./PopUp";

export default class Header extends React.Component {
  render() {
    return (
      <nav className="navbar sticky-top">
        <div className="navbar-header">
          <Link to="/">
            <Image src="Logo.svg" alt="Streamix-icon" />
          </Link>
        </div>
        <ul className="nav navbar-nav">
          <li>{this.props.children}</li>
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <PopUp />
          </li>
        </ul>
      </nav>
    );
  }
}
