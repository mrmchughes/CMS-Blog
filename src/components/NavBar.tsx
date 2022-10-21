import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";

let theme = createTheme();

theme = responsiveFontSizes(theme);

interface NavBarProps {
  auth: boolean;
  handleChange: () => void;
}

const NavBar = ({ auth, handleChange }: NavBarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Whose Blog is this anyway?
      </Typography>
      <Divider />
      {!auth && (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/"
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/login"
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Log In" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
      {auth && (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/"
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/createPost"
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Create Post" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                fetch(`https://rest-api-for-blog.onrender.com/logout`, {
                  mode: "cors",
                }).then(function () {
                  localStorage.clear();
                  handleChange();
                });
              }}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary="Log Out" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <ThemeProvider theme={theme}>
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Whose Blog is this anyway?
            </Typography>
            {!auth && (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  sx={{ textAlign: "center" }}
                  size="large"
                >
                  Home
                </Button>

                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ textAlign: "center" }}
                  size="large"
                >
                  Log In
                </Button>
              </Box>
            )}
            {auth && (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  sx={{ textAlign: "center" }}
                  size="large"
                >
                  Home
                </Button>

                <Button
                  component={RouterLink}
                  to="/createPost"
                  color="inherit"
                  sx={{ textAlign: "center" }}
                  size="large"
                >
                  Create Post
                </Button>

                <Button
                  onClick={() => {
                    fetch(`https://rest-api-for-blog.onrender.com/logout`, {
                      mode: "cors",
                    }).then(function () {
                      localStorage.clear();
                      handleChange();
                    });
                  }}
                  color="inherit"
                  sx={{ textAlign: "center" }}
                  size="large"
                >
                  Log Out
                </Button>
              </Box>
            )}
          </ThemeProvider>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default NavBar;
