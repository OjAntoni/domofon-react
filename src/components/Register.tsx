import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/form.scss";
import "../style/register.scss";

const Register = (props: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (password !== passwordRepeat) {
      setError("Passwords do not match");
      setResponse("");
    } else if (password === "" || password.replace(/\s/g, "") === "") {
      setError("Password cannot be empty");
      setResponse("");
    } else {
      registerUser(username, password);
    }
    // navigate("/login");
    // window.location.reload();
  };

  async function registerUser(
    username: string,
    password: string
  ): Promise<void> {
    const url = "http://192.168.1.101:8080/register"; // Adjust the URL based on your actual endpoint
    const requestBody = {
      username: username,
      password: password,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data: string = await response.text();

    if (response.status !== 200) {
      console.error("Error during user registration: ", response.status);
      setError(data);
      setResponse("");
      // return await response.text();
    } else {
      setResponse(data);
      setError("");
    }
  }

  return (
    <div className="register">
      <div className="register-wrapper">
        <h2 className="register__header">Register</h2>
        <form className="register__form" onSubmit={handleRegister}>
          <div className="form__input-wrapper">
            <label className="form__label" htmlFor="username">
              Username
            </label>
            <input
              className="form__input"
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form__input-wrapper">
            <label className="form__label" htmlFor="password">
              Password
            </label>
            <input
              className="form__input"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form__input-wrapper">
            <label className="form__label" htmlFor="passwordRepeat">
              Password
            </label>
            <input
              className="form__input"
              type="password"
              name="passwordRepeat"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
            />
          </div>
          <button className="form__button button-submit" type="submit">
            Register
          </button>
        </form>
        {error && (
          <div className="register__error">
            <p className="register__error-message">{error}</p>
          </div>
        )}
        {response && (
          <div className="register__success">
            <p className="register__success-message">{response}</p>
          </div>
        )}
        <Link to="/login">
          <p className="register__login">Login</p>
        </Link>
        {/* {message && <p>{message}</p>} */}
      </div>
    </div>
  );
};

export default Register;
