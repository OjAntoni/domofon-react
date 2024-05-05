import React, { useState, useCallback, useEffect, FormEvent } from "react";
import Cropper from "react-easy-crop";
// import getCroppedImg from './cropImage'; // Assume this is a utility function to process cropping (explained later)
import { Area } from "react-easy-crop";
import "../style/imageUpload.scss";
import AuthService from "../security/AuthService";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useImageContext } from "../context/ImageContext";

const ImageUploadAndCrop = ({
  onImageChanged,
}: {
  onImageChanged: (img: string) => void;
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const authService = AuthService;
  const navigate = useNavigate();
  const { imageUrl, setImageUrl } = useImageContext();
  const [message, setMessage] = useState("");
  const [newUsername, setNewUsername] = useState(
    localStorage.getItem("username")
  );

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const onCropImage = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const croppedImageBlob = await getCroppedImg(
          imageSrc,
          croppedAreaPixels
        );
        console.log("cropped blob", croppedImageBlob);
        uploadImage(croppedImageBlob);
        setImageSrc(null);
        // Process the blob file here (e.g., upload to server or use as src for an image)
      }
    } catch (e) {
      console.error(e);
    }
  };

  const uploadImage = (image: Blob) => {
    let formData = new FormData();
    formData.append("image", image);
    let xhttp = new XMLHttpRequest();
    let resp: UserResponse;
    xhttp.onload = function () {
      console.log(this.status);
      if (this.status == 403) {
        authService.logout();
        navigate("/login", { replace: true });
      } else {
        resp = JSON.parse(this.responseText);
        console.log(resp);
        localStorage.setItem("profile-image", resp.imageUrl);
        setImageUrl(resp.imageUrl);
      }
    };

    xhttp.open("POST", "http://localhost:8080/user/profile/image", true);
    xhttp.setRequestHeader(
      "Authorization",
      "Bearer " + localStorage.getItem("token")
    );
    xhttp.send(formData);
  };

  const onUsernameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newUsername === localStorage.getItem("username")) {
      setMessage("");
    } else {
      return fetch("http://192.168.1.101:8080/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ username: newUsername }),
      })
        .then((response) => response.json())
        .then(
          (data) => {
            if (data.token) {
              console.log(data.token);
              console.log(data.username);

              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.setItem("token", data.token);
              localStorage.setItem("username", data.username);
              setNewUsername(data.username);
              setMessage("");
            } else {
              setMessage(data.username);
            }
            return data;
          },
          (error: any) => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            console.error(error.toString());
            setMessage("User with such username already exists");
          }
        );
    }
  };

  return (
    <div>
      <div className="profile__main-section">
        <div
          className="profile__image"
          onClick={() => {
            document.getElementById("image-upload")?.click();
          }}
        >
          <img src={imageUrl || ""} alt="profile image" />
        </div>
        <div className="main-section__inputs">
          <input
            id="image-upload"
            className="profile__image-input form__input"
            type="file"
            accept="image/*"
            onChange={onFileChange}
          />
          <form onSubmit={(e) => onUsernameSubmit(e)}>
            <input
              type="text"
              className="form__input profile__username-input"
              // disabled
              value={newUsername || ""}
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
            <button type="submit" className="form__button button-submit">
              Change
            </button>
            {message && (
              <div className="username__error">
                <p className="username__error-message">{message}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      {imageSrc && (
        <div className="crooper-wrapper">
          <div className="crooper">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Square aspect ratio
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            ></Cropper>
          </div>
          <button
            className="crooper-button form__button button-submit"
            onClick={onCropImage}
          >
            Crop Image
          </button>
        </div>
      )}
    </div>
  );
};

function readFile(file: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => resolve(String(reader.result)),
      false
    );
    reader.readAsDataURL(file);
  });
}

// This is a simplified version. Check the react-easy-crop documentation for a more comprehensive one.
async function getCroppedImg(imageSrc: string, pixelCrop: Area) {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");

  ctx?.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
}

export default ImageUploadAndCrop;
