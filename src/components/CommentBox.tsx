import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import CardContent from "@mui/material/CardContent";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

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

interface Comment {
  _id: string;
  post: Object;
  user: String;
  timestamp: String;
  message: String;
}

interface CommentBoxProps {
  post: Post;
  comment: Comment;
}

const CommentBox = ({ post, comment }: CommentBoxProps) => {
  const { id } = useParams();

  const [openUpdate, setOpenUpdate] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

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

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ defaultValues: { username: "", message: "" } });

  useEffect(() => {
    defaultFormInputValues();
  }, []);

  const defaultFormInputValues = () => {
    fetch(
      `https://rest-api-for-blog.onrender.com/posts/${id}/comments/${comment._id}`,
      {
        mode: "cors",
      }
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        reset(response);
      });
  };

  const onCommentUpdateSubmit = (data: any) => {
    const input = data.message;
    const matches = matcher.getAllMatches(input);

    const censoredMessage = censor.applyTo(input, matches);

    data.message = censoredMessage;

    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    const updatedComment = JSON.stringify(data);

    fetch(`https://rest-api-for-blog.onrender.com/comments/${comment._id}`, {
      method: "put",
      body: updatedComment,
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });

    handleCloseUpdate();
  };

  const onDeleteComment = (data: any) => {
    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    fetch(`https://rest-api-for-blog.onrender.com/comments/${comment._id}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });
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
          onClick={handleClickOpenUpdate}
          sx={{ m: 2 }}
        >
          Update Comment
        </Button>
        <Dialog
          open={openUpdate}
          onClose={handleCloseUpdate}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to update this comment?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update this comment, please enter your updates below.
            </DialogContentText>

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
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleCloseUpdate}
              sx={{ m: 2 }}
            >
              Cancel Update Comment
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit(onCommentUpdateSubmit)}
              sx={{ m: 2 }}
            >
              Confirm Update Comment
            </Button>
          </DialogActions>
        </Dialog>

        <Button
          variant="contained"
          onClick={handleClickOpenDelete}
          sx={{ m: 2 }}
        >
          Delete Comment
        </Button>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this comment?"}
          </DialogTitle>
          <DialogActions>
            <Button
              variant="contained"
              onClick={handleCloseDelete}
              sx={{ m: 2 }}
            >
              Cancel Delete Comment
            </Button>

            <Button variant="contained" onClick={onDeleteComment} sx={{ m: 2 }}>
              Confirm Delete Comment
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Box>
  );
};

export default CommentBox;
