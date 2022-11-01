import React from "react";
import PostCard from "../components/PostCard";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import Typography from "@mui/material/Typography";

let theme = createTheme();

theme = responsiveFontSizes(theme);

interface Post {
  _id: string;
  isPublished: boolean;
  title: string;
  user: string;
  timestamp: string;
  message: string;
}

interface HomePageProps {
  auth: boolean;
  posts: Post[];
}

const HomePage = ({ auth, posts }: HomePageProps) => {
  return (
    <Box>
      {!auth && (
        <Box>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                boxShadow: 3,
                width: "100%",
                mb: 5,
                p: 5,
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                }}
              >
                To access this page, please login as Admin.
              </Typography>
            </Box>
          </ThemeProvider>
        </Box>
      )}
      {auth && (
        <Box>
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                boxShadow: 3,
                width: "100%",
                mb: 5,
                p: 5,
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  flexGrow: 1,
                  textAlign: "center",
                }}
              >
                Hello World! I'm Michael, and welcome to my Blog!
              </Typography>
            </Box>
          </ThemeProvider>

          <Box sx={{ flexGrow: 1, m: 5 }}>
            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={post._id}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <PostCard post={post} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
