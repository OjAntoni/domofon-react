import React from "react";
import ImageUploadAndCrop from "./ImageUploadAndCrop";
import "../style/profile.scss";
import AuthService from "../security/AuthService";
import { useNavigate } from "react-router-dom";

const Profile = ({
  onImageChange,
}: {
  onImageChange: (img: string) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="profile">
      <ImageUploadAndCrop onImageChanged={onImageChange}></ImageUploadAndCrop>
      <button
        className="form__button logout_button"
        onClick={() => {
          AuthService.logout();
          navigate("/login");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
