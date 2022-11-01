import React, { useEffect } from "react";
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

interface CreatePostPageProps {
  auth: boolean;
}

const CreatePostPage = ({ auth }: CreatePostPageProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ defaultValues: { title: "", message: "" } });

  const onSubmit = (data: any) => {
    const input = data.message;
    const matches = matcher.getAllMatches(input);

    const censoredMessage = censor.applyTo(input, matches);

    data.message = censoredMessage;

    const token = localStorage.getItem("token");
    const bearer = `Bearer ${token}`;

    const newPost = JSON.stringify(data);

    fetch(`https://rest-api-for-blog.onrender.com/posts`, {
      method: "post",
      body: newPost,
      headers: {
        "Content-Type": "application/json",
        Authorization: bearer,
      },
    });
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ title: "", message: "" });
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
        <Box
          sx={{
            boxShadow: 3,
            width: "100%",
            mb: 5,
            p: 5,
          }}
        >
          <ThemeProvider theme={theme}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                textAlign: "center",
              }}
            >
              Create a Post:
            </Typography>
          </ThemeProvider>
          <form>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                label="Title"
                multiline
                rows={4}
                placeholder="Title"
                sx={{ m: 2 }}
                {...register("title", {
                  required: true,
                })}
              />
              {errors.message?.type === "required" && (
                <span role="alert">Please enter a title</span>
              )}

              <TextField
                label="Message"
                multiline
                rows={4}
                placeholder="Message"
                sx={{ m: 2 }}
                {...register("message", {
                  required: true,
                })}
              />
              {errors.message?.type === "required" && (
                <span role="alert">Please enter a message</span>
              )}

              <Button
                variant="contained"
                type="submit"
                onClick={handleSubmit(onSubmit)}
                sx={{ m: 2 }}
              >
                Submit Post
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Box>
  );
};

export default CreatePostPage;
