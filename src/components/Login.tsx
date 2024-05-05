import React, { useState } from "react";
import AuthService from "../security/AuthService";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.scss";
import "../style/form.scss";
import UserService from "../service/UserService";
import { useImageContext } from "../context/ImageContext";
import FileService from "../service/FileService";

const Login = (props: any) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userService = new UserService();
  const { imageUrl, setImageUrl } = useImageContext();
  let notificationSrevice;

  const handleLogin = (e: any) => {
    e.preventDefault();
    AuthService.login(username, password).then(
      () => {
        userService.getInfoAboutProfile().then((userResp) => {
          if (!userResp.imageUrl) {
            let tempImgUrl = userService.createTempImage(
              400,
              400,
              username.split("")[0]
            );
            let file = FileService.dataURLtoFile(
              tempImgUrl,
              username + "_file"
            );
            userService.uploadProfileImage(file);
            setImageUrl(tempImgUrl);
          } else {
            setImageUrl(userResp.imageUrl);
          }
        });

        navigate("/");
      },
      (error: any) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage("Username or password is incorrect");
      }
    );
  };

  return (
    <div className="login">
      <div className="login-wrapper">
        <h2 className="login__header">Login</h2>
        <form className="login__form" onSubmit={handleLogin}>
          <div className="form__input-wrapper">
            <label className="form__label" htmlFor="username">
              Username
            </label>
            <input
              className="form__input"
              required
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
              required
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="form__button button-submit" type="submit">
            Login
          </button>
        </form>
        {message && (
          <div className="login__error">
            <p className="login__error-message">{message}</p>
          </div>
        )}
        <Link to="/register">
          <p className="login__register">Register</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
