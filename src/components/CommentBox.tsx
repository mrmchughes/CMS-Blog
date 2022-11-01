import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import CardContent from "@mui/material/CardContent";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

let theme = createTheme();

theme = responsiveFontSizes(theme);

interface Comment {
  _id: string;
  post: Object;
  user: String;
  timestamp: String;
  message: String;
}

interface CommentBoxProps {
  comment: Comment;
}

const CommentBox = ({ comment }: CommentBoxProps) => {
  const { handleSubmit } = useForm();

  const { id } = useParams();

  const onSubmit = (data: any) => {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}/comments/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });

    console.log("Deleted comment: " + comment.message);
  };

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
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          sx={{ m: 2, textAlign: "right" }}
          key={comment._id}
        >
          Delete
        </Button>
      </Card>
    </Box>
  );
};

export default CommentBox;
