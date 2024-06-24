import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const ImageUploader = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleTakePicture = () => {
    const handleStream = (stream) => {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const takePhoto = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        const imageURL = canvas.toDataURL("image/jpeg");
        setImage(imageURL);
        stream.getTracks().forEach((track) => track.stop());
      };

      video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        takePhoto();
      });
    };

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(handleStream)
      .catch((error) => console.error("Error accessing camera:", error));
  };

  return (
    <div>
      <label htmlFor="image-upload">
        <IconButton color="primary" component="span">
          <PhotoCameraIcon />
        </IconButton>
      </label>
      <Button variant="contained" color="primary" onClick={handleTakePicture}>
        Take Picture
      </Button>
      {image && <img src={image} alt="Uploaded or Captured" />}
    </div>
  );
};

export default ImageUploader;
