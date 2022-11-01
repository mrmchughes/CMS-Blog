import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material/styles";

let theme = createTheme();

theme = responsiveFontSizes(theme);

interface LoginPageProps {
  auth: boolean;
  handleChange: () => void;
}

const LoginPage = ({ auth, handleChange }: LoginPageProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: any) => {
    fetch("https://rest-api-for-blog.onrender.com/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        localStorage.setItem("token", response.token);
        handleChange();
      });
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ username: "", password: "" });
      navigate("/posts");
    }
  }, [formState, reset]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "50%",
        margin: "0 auto",
      }}
    >
      <ThemeProvider theme={theme}>
        <Typography variant="h2" sx={{ textAlign: "center", m: 2.5 }}>
          Log In
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="Username"
              placeholder="Username"
              sx={{ m: 2 }}
              {...register("username", {
                required: true,
                validate: (username: string) => {
                  if (process.env.REACT_APP_admin !== username) {
                    return "Not Admin login";
                  }
                },
              })}
            />
            {errors.username?.type === "validate" && (
              <span role="alert">
                Please enter Admin credentials to continue
              </span>
            )}

            <TextField
              label="Password"
              placeholder="Password"
              sx={{ m: 2 }}
              type="password"
              {...register("password", {
                required: true,
                validate: (password: string) => {
                  if (process.env.REACT_APP_adminPassword !== password) {
                    return "Not Admin login";
                  }
                },
              })}
            />
            {errors.password?.type === "validate" && (
              <span role="alert">
                Please enter Admin credentials to continue
              </span>
            )}

            <Button
              variant="contained"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              sx={{ m: 2 }}
            >
              Log In
            </Button>
          </Box>
        </form>
      </ThemeProvider>
    </Box>
  );
};

export default LoginPage;
