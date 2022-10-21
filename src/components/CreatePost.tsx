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

const CreatePost = () => {
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
    <div>
      <Box
        sx={{
          flexGrow: 1,
          width: "50%",
          margin: "0 auto",
        }}
      >
        <ThemeProvider theme={theme}>
          <Typography variant="h5" sx={{ textAlign: "center", m: 2.5 }}>
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
    </div>
  );
};

export default CreatePost;
