import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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

  const [openUpdate, setOpenUpdate] = React.useState(false);

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenUpdate = () => {
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const navigate = useNavigate();

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
  } = useForm({
    defaultValues: {
      username: "",
      commentMessage: "",
    },
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: formState2,
    formState: { errors: errors2, isSubmitSuccessful: isSubmitSuccessful2 },
  } = useForm({
    defaultValues: {
      username: "",
      title: "",
      postMessage: "",
    },
  });

  const onCommentSubmit = (data: any) => {
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

  const onDeletePost = (data: any) => {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });

    console.log(
      "Deleted Post: " + post._id + " " + post.title + " " + post.message
    );

    navigate("/posts");
  };

  const onPostUpdateSubmit = (data: any) => {
    const input = data.message;
    const matches = matcher.getAllMatches(input);

    const censoredMessage = censor.applyTo(input, matches);

    data.message = censoredMessage;

    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    const updatedPost = JSON.stringify(data);

    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}`, {
      method: "put",
      body: updatedPost,
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });

    handleCloseUpdate();
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ username: "", commentMessage: "" });
    }
  }, [formState, reset]);

  useEffect(() => {
    if (formState2.isSubmitSuccessful) {
      reset2({ username: "", title: "", postMessage: "" });
    }
  }, [formState2, reset2]);

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
                {post.title}{" "}
                <Button
                  variant="contained"
                  onClick={handleClickOpenUpdate}
                  sx={{ m: 2 }}
                >
                  Update Post
                </Button>
                <Dialog
                  open={openUpdate}
                  onClose={handleCloseUpdate}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to update this post?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      To update this post, please enter your updates below.
                    </DialogContentText>

                    <form key={2} onSubmit={handleSubmit2(onPostUpdateSubmit)}>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <TextField
                          label="Title"
                          multiline
                          rows={4}
                          placeholder="Title"
                          sx={{ m: 2 }}
                          {...register2("title", {
                            required: true,
                          })}
                        />
                        {errors2.title?.type === "required" && (
                          <span role="alert">Please enter a title</span>
                        )}

                        <TextField
                          label="Post Message"
                          multiline
                          rows={4}
                          placeholder="Post Message"
                          sx={{ m: 2 }}
                          {...register2("postMessage", {
                            required: true,
                          })}
                        />
                        {errors2.postMessage?.type === "required" && (
                          <span role="alert">Please enter a message</span>
                        )}
                      </Box>

                      <Button variant="contained" type="submit" sx={{ m: 2 }}>
                        Confirm Update Post
                      </Button>
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      variant="contained"
                      onClick={handleCloseUpdate}
                      sx={{ m: 2 }}
                    >
                      Cancel Update Post
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="contained"
                  onClick={handleClickOpenDelete}
                  sx={{ m: 2 }}
                >
                  Delete Post
                </Button>
                <Dialog
                  open={openDelete}
                  onClose={handleCloseDelete}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Are you sure you want to delete this post?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button
                      variant="contained"
                      onClick={handleCloseDelete}
                      sx={{ m: 2 }}
                    >
                      Cancel Delete Post
                    </Button>

                    <Button
                      variant="contained"
                      onClick={onDeletePost}
                      sx={{ m: 2 }}
                    >
                      Confirm Delete Post
                    </Button>
                  </DialogActions>
                </Dialog>
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
                <CommentBox key={index} post={post} comment={comment} />
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
            <form key={1}>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  label="Comment"
                  multiline
                  rows={4}
                  placeholder="Comment"
                  {...register("commentMessage", {
                    required: true,
                    maxLength: 280,
                  })}
                />
                {errors.commentMessage?.type === "required" && (
                  <span role="alert">Please enter a message</span>
                )}
                {errors.commentMessage?.type === "maxLength" && (
                  <span role="alert">
                    Message can only be up to 280 characters
                  </span>
                )}

                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit(onCommentSubmit)}
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
