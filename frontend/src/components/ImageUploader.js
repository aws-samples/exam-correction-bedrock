import { Fragment, useState } from "react";
import { Button, Box, CircularProgress, Snackbar } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";

const ImageUploader = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);

  const handleImageSelect = (event) => {
    setFile(event.target.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImageUpload = (event) => {
    setLoading(true);
    console.log(file.name);
    api
      .post("/upload", {
        file_name: file.name,
      })
      .then((response) => {
        const presignedUrl = response.data.presigned_url;
        // Perform the upload to S3 using the fetched presignedUrl
        fetch(presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type, // Set the correct content type for the file
          },
          body: file,
        })
          .then((uploadResponse) => {
            setFile(null);
            setImage(null);
            setLoading(false);
            setMessage(
              "Carregamento feito com sucesso! Aguarde o processamento."
            );
            setOpenSnack(true);
          })
          .catch((uploadError) => {
            console.error(uploadError);
            setFile(null);
            setImage(null);
            setLoading(false);
            setMessage("Não foi possível carregar o arquivo!");
            setOpenSnack(true);
          });
      })
      .catch((error) => {
        console.error(error);
        setFile(null);
        setImage(null);
        setLoading(false);
        setMessage("Não foi possível obter a URL de upload.");
        setOpenSnack(true);
      });
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
      {message && (
        <Snackbar
          open={openSnack}
          autoHideDuration={6000}
          onClose={() => setOpenSnack(false)}
          message={message}
        />
      )}
    </Box>
  );
};

export default ImageUploader;
