import React, { useContext, useEffect, useState } from "react";
import "../style/menu.scss";
import { Link, useLocation } from "react-router-dom";
import { useImageContext } from "../context/ImageContext";

interface MenuBarProps {
  img: string;
  notifications: number;
}

const MenuBar = ({ img, notifications }: MenuBarProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const location = useLocation();
  const { imageUrl, setImageUrl, newMsgs, setNewMsgs } = useImageContext();

  useEffect(() => {
    if (location.pathname === "/") {
      setIsClicked(true);
    }
  });

  return (
    <>
      <div className="menu-placeholder"></div>
      <div className="menu">
        <div className="profile-menu">
          <div className="profile-menu-img-wrapper">
            <Link to="/profile" onClick={() => setIsClicked(false)}>
              <img src={imageUrl || img} alt="profile photo" />
            </Link>
          </div>
          {notifications === 0 ? null : (
            <div className="profile-menu__notifications">
              <p className="notifications">{notifications}</p>
            </div>
          )}
        </div>
        <div className="hr"></div>
        <div className="navbar">
          <div
            className={`navbar__item ${isClicked ? "active" : ""}`}
            onClick={() => setIsClicked(true)}
          >
            <Link to={"/"}>
              <div className="item__link">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-chat"
                  viewBox="0 0 16 16"
                >
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                </svg>
              </div>
              {newMsgs > 0 && <p>{newMsgs}</p>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuBar;
