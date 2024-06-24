import { Fragment, useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const handleImageSelect = (event) => {
    setFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImageUpload = (event) => {
    setLoading(true);
    console.log(file);
    setTimeout(() => {
      setFile(null);
      setImage(null);
      setLoading(false);
    }, 5000);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImage(null);
  };

  return (
    <Box>
      {!file && (
        <Fragment>
          <input
            accept="image/jpeg, image/png"
            id="image-select"
            style={{ display: "none" }}
            type="file"
            onChange={handleImageSelect}
          />
          <label htmlFor="image-select">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={!!image}
            >
              Selecionar Imagem
            </Button>
          </label>
        </Fragment>
      )}
      {file && (
        <Fragment>
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              onClick={handleImageUpload}
              disabled={loading}
            >
              Carregar Imagem
            </Button>
          </label>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={handleRemoveImage}
            sx={{ ml: 2 }}
            disabled={loading}
          >
            Remover Imagem
          </Button>
          <Box
            display="flex"
            justifyContent="left"
            alignItems="center"
            sx={{ m: 2 }}
          >
            <img
              src={image}
              alt="Uploaded"
              style={{
                maxHeight: "250px",
                maxWidth: "100%",
                marginRight: "10px",
              }}
            />
          </Box>
        </Fragment>
      )}
      {loading && <CircularProgress />}
    </Box>
  );
};

export default ImageUploader;
