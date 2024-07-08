import React, { useState } from "react";
import PropTypes from "prop-types";

function Login(/*{ setToken }*/) {
  const [usernameInput, setUsername] = useState("");
  const [passwordInput, setPassword] = useState("");
  const handleUserNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hardcoded = {
      username: "admin",
      password: "password123",
    };
    if (
      usernameInput == hardcoded.username &&
      passwordInput == hardcoded.password
    ) {
      const token = "13H2UThXTF";
      sessionStorage.setItem("auth-token", token);
    } else {
      //wrong combination
      alert("wrong email or password combination");
    }
  };

  return (
    <div className="container ">
      <h1>Please Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            type="username"
            className="form-control"
            placeholder="Enter username"
            value={usernameInput}
            onChange={handleUserNameChange}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={passwordInput}
            onChange={handlePasswordChange}
          />
        </label>
        <br />
        <br />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}

export default Login;

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
