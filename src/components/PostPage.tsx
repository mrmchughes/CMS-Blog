import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";
import Divider from "@mui/material/Divider";

import {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
const censor = new TextCensor();

interface Post {
  _id: string;
  isPublished: boolean;
  title: string;
  user: string;
  timestamp: string;
  message: string;
}

interface Comment {
  _id: string;
  post: Object;
  user: String;
  timestamp: String;
  message: String;
}

interface PostPageProps {
  auth: boolean;
}

let theme = createTheme();

theme = responsiveFontSizes(theme);

const PostPage = ({ auth }: PostPageProps) => {
  const [post, setPost] = useState<Post>({
    _id: "",
    isPublished: true,
    title: "",
    user: "",
    timestamp: "",
    message: "",
  });

  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchedPost();
  }, []);

  useEffect(() => {
    fetchedComments();
  }, [comments]);

  const fetchedPost = () => {
    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}`, {
      mode: "cors",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        setPost(response);
      });
  };

  const fetchedComments = () => {
    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}/comments`, {
      mode: "cors",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        setComments(response);
      });
  };

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ defaultValues: { username: "", message: "" } });

  const onSubmit = (data: any) => {
    const input = data.message;
    const matches = matcher.getAllMatches(input);

    const censoredMessage = censor.applyTo(input, matches);

    data.message = censoredMessage;

    setComments([...comments, data]);

    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    const newComment = JSON.stringify(data);

    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}/comments`, {
      method: "post",
      body: newComment,
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ username: "", message: "" });
    }
  }, [formState, reset]);

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
          <Box sx={{ m: 5 }}>
            <ThemeProvider theme={theme}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                {post.title}
              </Typography>
              <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
                Published by {post.user} on {post.timestamp}
              </Typography>
              <Divider />

              <br />

              <Typography variant="body1" sx={{ textAlign: "left" }}>
                {post.message}
              </Typography>

              <br />

              <Divider />
            </ThemeProvider>
          </Box>

          <br />

          <Box>
            <ThemeProvider theme={theme}>
              <Typography variant="h5" sx={{ textAlign: "left", m: 2 }}>
                Comments: ({comments.length})
              </Typography>
            </ThemeProvider>

            <Box
              sx={{
                margin: 2,
              }}
            >
              {comments.map((comment, index) => (
                <CommentBox key={index} comment={comment} />
              ))}
            </Box>
          </Box>

          <br />

          <Box
            sx={{
              flexGrow: 1,
              width: "50%",
              margin: "0 auto",
            }}
          >
            <ThemeProvider theme={theme}>
              <Typography variant="h5" sx={{ textAlign: "center", m: 2.5 }}>
                Add a comment:
              </Typography>
            </ThemeProvider>
            <form>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  label="Comment"
                  multiline
                  rows={4}
                  placeholder="Comment"
                  {...register("message", {
                    required: true,
                    maxLength: 280,
                  })}
                />
                {errors.message?.type === "required" && (
                  <span role="alert">Please enter a message</span>
                )}
                {errors.message?.type === "maxLength" && (
                  <span role="alert">
                    Message can only be up to 280 characters
                  </span>
                )}

                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  sx={{ m: 2 }}
                >
                  Submit Comment
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PostPage;
