import { useEffect, useState } from "react";
import { Typography, Box, Container, Modal, Link } from "@mui/material";
import ExamsTable from "../components/ExamsTable";
import ImageUploader from "../components/ImageUploader";
import api from "../services/api";

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
  const [exams, setExams] = useState([]);
  const [reportModal, setReportModal] = useState(false);
  const handleOpenReport = () => setReportModal(true);
  const handleCloseReport = () => setReportModal(false);

  const getExams = () => {
    api.get("exams").then((response) => {
      setExams(response.data.results.Items);
    });
  };

  useEffect(() => {
    // Fetch exams data from the server
    getExams();
  }, []);

  return (
    <Container
      disableGutters
      maxWidth="md"
      component="main"
      sx={{ pt: 8, pb: 6, pr: 4, pl: 4 }}
    >
      <Box display="flex" justifyContent="left">
        <Typography variant="h4">Redações</Typography>
      </Box>
      <Box mt={2}>
        <Link onClick={handleOpenReport} style={{ cursor: "pointer" }}>
          Tema abordado & Modo de uso
        </Link>
      </Box>
      <Box mt={2}>
        <ImageUploader />
      </Box>
      <Box mt={2}>
        <ExamsTable exams={exams} onRefresh={getExams} />
      </Box>
      <Modal
        open={reportModal}
        onClose={handleCloseReport}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h4" sx={{ mt: 2 }}>
            Tema abordado
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            ENEM 2022: Desafios para a valorização de comunidades e povos
            tradicionais no Brasil. Debate que envolve aspectos sobre
            territorialidade, sustentabilidade e direitos humanos.
          </Typography>
          <Typography id="modal-modal-title" variant="h4" sx={{ mt: 2 }}>
            Modo de uso
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Upload das imagens
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Scanner
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Amazon Alexa
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Prompt utilizado
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Corrigir a seguinte redação de acordo com os critérios de avaliação
            do ENEM: [Redação]. Forneça feedback detalhado sobre a competência
            de cada critério (Competência 1: Demonstrar domínio da modalidade
            escrita formal da língua portuguesa, Competência 2: Compreender a
            proposta de redação e aplicar conceitos das várias áreas de
            conhecimento para desenvolver o tema, dentro dos limites estruturais
            do texto dissertativo-argumentativo em prosa, Competência 3:
            Selecionar, relacionar, organizar e interpretar informações, fatos,
            opiniões e argumentos em defesa de um ponto de vista, Competência 4:
            Demonstrar conhecimento dos mecanismos linguísticos necessários para
            a construção da argumentação, Competência 5: Elaborar proposta de
            intervenção para o problema abordado, respeitando os direitos
            humanos). A pontuação atribuída a cada competência pode variar até
            200 pontos. A nota máxima da redação é de mil pontos.:
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            LLM (Large Language Model) utilizado
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Claude 3 Sonnet
          </Typography>
          <Typography id="modal-modal-title" variant="h5" sx={{ mt: 2 }}>
            Guardrails utilizados
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Ataque de prompt
          </Typography>
          <Typography id="modal-modal-title" variant="h4" sx={{ mt: 2 }}>
            Arquitetura AWS
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
}

export default Exams;
