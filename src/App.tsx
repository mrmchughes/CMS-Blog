import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import NavBar from "./components/NavBar";
import PostPage from "./components/PostPage";
import CreatePostPage from "./components/CreatePostPage";
import "./styles/global.css";

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [auth, setAuth] = useState(false);

  const handleChange = () => {
    setAuth((prevAuth) => !prevAuth);
  };

  interface Post {
    _id: string;
    isPublished: boolean;
    title: string;
    user: string;
    timestamp: string;
    message: string;
  }

  useEffect(() => {
    fetch("https://rest-api-for-blog.onrender.com/posts", {
      mode: "cors",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        setPosts(response);
      });
  }, []);

  return (
    <BrowserRouter>
      <NavBar auth={auth} handleChange={handleChange} />
      <Routes>
        <Route
          path="/"
          element={<LoginPage auth={auth} handleChange={handleChange} />}
        />
        <Route path="/posts" element={<HomePage auth={auth} posts={posts} />} />
        <Route path="/createPost" element={<CreatePostPage auth={auth} />} />
        <Route path="/posts/:id" element={<PostPage auth={auth} />} />
        <Route path="*" element={<p> There is nothing here!!</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
