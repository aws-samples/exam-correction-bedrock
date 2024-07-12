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
  TableSortLabel,
} from "@mui/material";
import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import ImageIcon from "@mui/icons-material/Image";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ExamReport from "./ExamReport";
import api from "../services/api";

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
    comments: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "asc",
  });

  const handleOpenImage = async (filename) => {
    try {
      const response = await api.get(`/download/${filename}`);
      const presignedUrl = response.data.presigned_url;
      return presignedUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleOpenReport = async (exam) => {
    const imageUrl = await handleOpenImage(exam.image);
    setCorrection({
      image: imageUrl,
      correction: exam.correction,
      comments: exam.comments ? exam.comments : "",
    });
    setReportModal(true);
  };

  const handleCloseReport = () => setReportModal(false);

  const handleSort = (columnId) => {
    const isAsc = sortConfig.key === columnId && sortConfig.direction === "asc";
    setSortConfig({ key: columnId, direction: isAsc ? "desc" : "asc" });
  };

  const sortedExams = [...exams].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Button onClick={onRefresh}>
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
                  <TableSortLabel
                    active={sortConfig.key === column.id}
                    direction={
                      sortConfig.key === column.id
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedExams.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === "image") {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {value !== "" ? (
                          <Button
                            onClick={async () => {
                              try {
                                const url = await handleOpenImage(row.image);
                                window.open(url, "_blank");
                              } catch (error) {
                                console.error("Error opening image:", error);
                                // Handle error (e.g., show a message to the user)
                              }
                            }}
                          >
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
