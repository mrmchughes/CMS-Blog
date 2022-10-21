import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

let theme = createTheme();

theme = responsiveFontSizes(theme);

interface Comment {
  post: Object;
  user: String;
  timestamp: String;
  message: String;
}

interface CommentBoxProps {
  comment: Comment;
}

const CommentBox = ({ comment }: CommentBoxProps) => {
  return (
    <Box>
      <Card variant="outlined" sx={{ boxShadow: 3, mb: 1.5, p: 1 }}>
        <CardContent sx={{ textAlign: "left" }}>
          <ThemeProvider theme={theme}>
            <Typography variant="h6">{comment.user}</Typography>

            <br />

            <Typography variant="body1">{comment.message}</Typography>

            <br />

            <Typography variant="subtitle2">
              Submitted: {comment.timestamp}
            </Typography>
          </ThemeProvider>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CommentBox;
