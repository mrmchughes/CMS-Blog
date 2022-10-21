import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentBox from "../components/CommentBox";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface Post {
  _id: string;
  isPublished: boolean;
  title: string;
  user: string;
  timestamp: string;
  message: string;
}

interface Comment {
  post: Object;
  user: String;
  timestamp: String;
  message: String;
}

const PostPage = () => {
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
    setComments([...comments, data]);

    const newComment = JSON.stringify(data);

    fetch(`https://rest-api-for-blog.onrender.com/posts/${id}/comments`, {
      method: "post",
      body: newComment,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ username: "", message: "" });
    }
  }, [formState, reset]);

  return (
    <div>
      <div>
        <h1>{post.title}</h1>
        <h2>{post.user}</h2>
        <p>{post.timestamp}</p>
        <p>{post.message}</p>
      </div>
      <br />

      <div>
        <h2>Comments:</h2>
        {comments.map((comment, index) => (
          <CommentBox key={index} comment={comment} />
        ))}
      </div>
      <br />

      <form>
        <TextField
          label="Username"
          variant="outlined"
          type="text"
          placeholder="Username"
          {...register("username", {
            required: true,
            minLength: 8,
            maxLength: 30,
            pattern: /^[a-zA-Z0-9]+$/,
          })}
        />
        {errors.username?.type === "required" && (
          <span role="alert">Please enter a username</span>
        )}
        {errors.username?.type === "minLength" && (
          <span role="alert">Username must be at least 8 characters</span>
        )}
        {errors.username?.type === "maxLength" && (
          <span role="alert">Username can only be up to 30 characters</span>
        )}
        {errors.username?.type === "pattern" && (
          <span role="alert">
            Username must only include alpha-numeric characters, and no spaces
          </span>
        )}

        <TextField
          label="Message"
          multiline
          rows={4}
          placeholder="Message"
          {...register("message", {
            required: true,
            maxLength: 280,
          })}
        />
        {errors.message?.type === "required" && (
          <span role="alert">Please enter a message</span>
        )}
        {errors.message?.type === "maxLength" && (
          <span role="alert">Message can only be up to 280 characters</span>
        )}

        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Submit Comment
        </Button>
      </form>
    </div>
  );
};

export default PostPage;
