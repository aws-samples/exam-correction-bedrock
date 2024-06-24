import { useState } from "react";
import { Typography, Box, Container, Modal, Link } from "@mui/material";
import ExamsTable from "../components/ExamsTable";
import ImageUploader from "../components/ImageUploader";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

function Exams() {
  const [reportModal, setReportModal] = useState(false);
  const handleOpenReport = () => setReportModal(true);
  const handleCloseReport = () => setReportModal(false);

  return (
    <Container
      disableGutters
      maxWidth="md"
      component="main"
      sx={{ pt: 8, pb: 6 }}
    >
      <Box display="flex" justifyContent="left">
        <Typography variant="h4">Redações</Typography>
      </Box>
      <Box mt={2}>
        <Link onClick={handleOpenReport} style={{ cursor: "pointer" }}>
          Tema abordado
        </Link>
      </Box>
      <Box mt={2}>
        <ImageUploader />
      </Box>
      <Box mt={2}>
        <ExamsTable />
      </Box>
      <Modal
        open={reportModal}
        onClose={handleCloseReport}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h4">
            Tema abordado
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Desafios para a valorização de comunidades e povos tradicionais no
            Brasil. Debate que envolve aspectos sobre territorialidade,
            sustentabilidade e direitos humanos.
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
}

export default Exams;
