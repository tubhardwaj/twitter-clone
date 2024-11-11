/* eslint-disable */
const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [
  { title: "React", content: "we have done 2" },
  { title: "Node", content: "we have done 1" }
];

const server = express();
// Enable parsing of JSON bodies for POST requests
server.use(bodyParser.json());

const getAllPosts = (req, res) => {
  return res.status(200).json(posts);
};

const getPostById = (req, res) => {
  const { id } = req.params;
  const post = posts[id];
  if (!post) {
    return res.status(STATUS_USER_ERROR).send("Post not found");
  }
  return res.status(200).json(post);
};

const validateData = (req, res, next) => {
  const { title, content } = req.body;
  if (title === undefined || title.length === 0) {
    return res.status(STATUS_USER_ERROR).send("Please send a valid title for the post");
  }
  if (content === undefined || content.length === 0) {
    return res.status(STATUS_USER_ERROR).send("Please send valid content for the post");
  }
  req.post = { title, content };
  next();
};

const createPost = (req, res) => {
  const { post } = req;
  posts.push(post);
  return res.status(202).json({ success: true, postId: posts.length - 1 });
};

const updatePost = (req, res) => {
  const { id } = req.params;
  const postToEdit = posts[id];
  if (!postToEdit) {
    return res.status(STATUS_USER_ERROR).send("Post not found");
  }
  postToEdit.title = req.body.title;
  postToEdit.content = req.body.content;
  return res.status(202).json({ success: true, post: postToEdit });
};

const deletePost = (req, res) => {
  const { id } = req.params;
  if (id >= posts.length || id < 0) {
    return res.status(STATUS_USER_ERROR).send("Post not found");
  }
  posts = posts.filter((_, idx) => idx != id);
  return res.status(202).json({ success: true });
};

server.get("/posts", getAllPosts);
server.get("/posts/:id", getPostById);
server.post("/posts", validateData, createPost);
server.put("/posts/:id", updatePost);
server.delete("/posts/:id", deletePost);
server.get("/", (req, res) => {
  return res.status(200).json("Buhahuhah");
});

// Export the server and posts
module.exports = { posts, server };