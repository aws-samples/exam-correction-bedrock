import { Fragment } from "react";
import NavBar from "./components/NavBar";
import Exams from "./pages/Exams";

function App() {
  return (
    <Fragment>
      <NavBar />
      <Exams />
    </Fragment>
  );
}

export default App;
