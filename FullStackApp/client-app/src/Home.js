import React, { Component } from "react";
import "./Home.css";

export class Home extends Component {
  render() {
    return (
      <div className="home-container">
        <div className="hero-content">
          <h1>Welcome to Our Company</h1>
          <p>Manage your departments and employees with ease.</p>
        </div>
      </div>
    );
  }
}
