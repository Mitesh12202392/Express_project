const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const filteredUsers = users.filter((u)=> u.username === username);
    return filteredUsers.length > 0;
}
const authenticatedUser = (username,password)=>{ //returns boolean
    if(!isValid(username)) return false;
    const filteredUsers = users.filter((u)=> (u.username===username)&&(u.password===password));
    return filteredUsers.length > 0;
}

regd_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        return res.status(400).json({message:"Check username and password"})
    }
    const exists = users.some((u)=> u.username === username);
    if(exists){
        return res.status(400).json({message:"Already exists"});
    }
    users.push({username,password});
    return res.status(201).json({message:"User Created successfully"});
});

//only registered users can login
regd_users.post("/login", (req,res) => {
    const user = req.body.username;
    const pass = req.body.password;
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }
    const accessToken = jwt.sign({ data: user },'access',{expiresIn:60*60});
    req.session.authorization = { accessToken };
    req.session.username = user;
    return res.json({message:"User logged in Successfully"});
});

// Convenience GET login route for screenshots/testing: /customer/login?username=u&password=p
regd_users.get("/login", (req,res) => {
    const user = req.query.username;
    const pass = req.query.password;
    if(!user || !pass){
        return res.status(400).json({message:"username and password query params are required"});
    }
    if(!authenticatedUser(user,pass)){
        return res.status(403).json({message:"User not authenticated"})
    }
    const accessToken = jwt.sign({ data: user },'access',{expiresIn:60*60});
    req.session.authorization = { accessToken };
    req.session.username = user;
    return res.json({message:"User logged in Successfully", username: user});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  if(!username){
    return res.status(401).json({message:"Login required"});
  }
  const ISBN = req.params.isbn;
  const details = req.query.review;
  if(!books[ISBN]){
    return res.status(404).json({message:"Book not found"});
  }
  if(!details){
    return res.status(400).json({message:"Review text is required"});
  }
  if(!books[ISBN].reviews){ books[ISBN].reviews = {}; }
  books[ISBN].reviews[username] = details;
  return res.status(201).json({message:"Review added/updated successfully"});
});

// Returns all reviews created by the logged-in user across all ISBNs
regd_users.get("/auth/review", (req, res) => {
  const username = req.session.username;
  if(!username){
    return res.status(401).json({message:"Login required"});
  }
  const userReviews = {};
  for (const [isbn, book] of Object.entries(books)) {
    if (book.reviews && book.reviews[username]) {
      userReviews[isbn] = {
        title: book.title,
        author: book.author,
        review: book.reviews[username]
      };
    }
  }
  return res.json(userReviews);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username;
  if(!username){
    return res.status(401).json({message:"Login required"});
  }
  const ISBN = req.params.isbn;
  if(!books[ISBN] || !books[ISBN].reviews || !books[ISBN].reviews[username]){
    return res.status(404).json({message:"No review by this user for given ISBN"});
  }
  delete books[ISBN].reviews[username];
  return res.status(200).json({message:"Review has been deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
