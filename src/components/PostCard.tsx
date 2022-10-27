import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

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

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Box sx={{}}>
      <Card variant="outlined" sx={{ boxShadow: 3, width: 250, height: 250 }}>
        <CardContent sx={{ textAlign: "center" }}>
          <ThemeProvider theme={theme}>
            <Typography variant="h5" component="div" noWrap>
              {post.title}
            </Typography>

            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {post.user}
            </Typography>

            <Box display="flex" justifyContent="center">
              <Avatar
                alt="Profile Picture"
                src={require("../imgs/profile_image.png")}
                sx={{ width: 56, height: 56 }}
              />
            </Box>

            <br />

            <Typography variant="body2">{post.timestamp}</Typography>
          </ThemeProvider>

          <CardActions>
            <Box sx={{ margin: "0 auto", display: "flex" }}>
              <Button
                variant="contained"
                component={RouterLink}
                to={`${post._id}`}
              >
                View Post
              </Button>
            </Box>
          </CardActions>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PostCard;
