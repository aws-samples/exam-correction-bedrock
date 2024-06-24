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
} from "@mui/material";
import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExamReport from "./ExamReport";

const columns = [
  //{ id: "student", label: "Aluno", minWidth: 100 },
  //{ id: "grade", label: "Nota", minWidth: 100 },
  { id: "date", label: "Data", minWidth: 100 },
  { id: "hour", label: "Hora", minWidth: 100 },
  { id: "id", label: "Identificador", minWidth: 100 },
  { id: "image", label: "Imagem", minWidth: 100 },
  { id: "correction", label: "Correção", minWidth: 100 },
];

function ExamsTable({ exams, onRefresh }) {
  const [reportModal, setReportModal] = useState(false);
  const [correction, setCorrection] = useState({
    image: "",
    correction: "",
    observations: "",
  });

  const handleOpenReport = (exam) => {
    setCorrection({
      image: exam.image,
      correction: exam.correction,
      observations: "",
    });
    setReportModal(true);
  };

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
          <RefreshIcon onClick={onRefresh} />
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
            {exams.map((row) => (
              <TableRow key={row.id}>
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
      <ExamReport
        correction={correction}
        openReport={reportModal}
        closeReport={handleCloseReport}
      />
    </Paper>
  );
}

export default ExamsTable;
