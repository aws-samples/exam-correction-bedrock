import { AppBar, Toolbar, Box } from "@mui/material";
import logo from "../assets/logo.png";

export const NavBar = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Box sx={{ m: 2 }}>
          <img src={logo} alt="AWS logo" width={120} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
