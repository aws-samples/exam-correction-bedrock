import { Grid, Box, Typography, Modal } from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflow: "auto",
};

function ExamReport({ correction, openReport, closeReport }) {
  return (
    <Modal
      open={openReport}
      onClose={closeReport}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Grid container direction="row" spacing={6}>
          <Grid item xs={12} md={6}>
            <img
              src={correction.image}
              alt="Correction report"
              style={{ maxWidth: "100%", height: "auto" }}
            />{" "}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
              Correção
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, whiteSpace: "pre-line" }}
            >
              {correction.correction.replace(/\\n/g, "\n")}
            </Typography>
            <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
              Observações
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, whiteSpace: "pre-line" }}
            >
              {correction.comments}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ExamReport;
