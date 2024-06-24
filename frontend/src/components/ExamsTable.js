import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";

const columns = [
  { id: "date", label: "Data", minWidth: 100 },
  { id: "hour", label: "Hora", minWidth: 100 },
  { id: "id", label: "RA", minWidth: 100 },
  { id: "student", label: "Aluno", minWidth: 100 },
  { id: "image", label: "Imagem", minWidth: 100 },
  { id: "grade", label: "Nota", minWidth: 100 },
  { id: "correction", label: "Correção", minWidth: 100 },
];

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

function ExamsTable() {
  const [records, setRecords] = useState([
    {
      date: "2022-05-01",
      hour: "10:00",
      id: "123456789",
      student: "Gabriel",
      image:
        "https://www.institutoclaro.org.br/educacao/wp-content/uploads/sites/2/2022/11/redacaoEnem1000-2.png",
      grade: "900",
      correction: "https://example.com/correction.pdf",
    },
  ]);
  const [reportModal, setReportModal] = useState(false);

  const handleOpenReport = () => setReportModal(true);
  const handleCloseReport = () => setReportModal(false);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Button>
          <RefreshIcon />
        </Button>
      </Box>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <TableRow key={row.record_id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === "image") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value !== "" ? (
                          <Button href={row.image} target="_blank">
                            <ImageIcon />
                          </Button>
                        ) : (
                          <Typography>aguardando</Typography>
                        )}
                      </TableCell>
                    );
                  } else if (column.id === "correction") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value !== "" ? (
                          <Button
                            onClick={() => {
                              handleOpenReport(row);
                            }}
                          >
                            <AssessmentIcon />
                          </Button>
                        ) : (
                          <Typography>aguardando</Typography>
                        )}
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        <Typography>
                          {value !== "" ? value : "aguardando"}
                        </Typography>
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={reportModal}
        onClose={handleCloseReport}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h4">
            Resultado
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Sintomas
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Teste
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Teste
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Teste
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Teste
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Teste
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Teste
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Teste
          </Typography>
        </Box>
      </Modal>
    </Paper>
  );
}

export default ExamsTable;
