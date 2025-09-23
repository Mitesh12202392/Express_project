const Axios = require("axios")
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"USer Created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Check username and password"})
  }  

 
});

// // Get the book list available in the shop
// public_users.get('/',async (req, res) => {
//     await res.send(JSON.stringify(books,null,4));
   
//  });


// Get the book list available in the shop using a Promise
public_users.get('/', (req, res) => {
  const getBooks = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(books), 300);
    });
  };

  getBooks()
    .then((allBooks) => res.json(allBooks))
    .catch(() => res.status(500).json({ error: "An error occurred" }));
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',async (req, res)=>{
  
//   const ISBN = req.params.isbn;
//   await res.send(books[ISBN]);    
 
//  });
  
// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) =>{
  const ISBN = req.params.isbn;

  const booksBasedOnIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
  };

  booksBasedOnIsbn(ISBN)
    .then((book) => res.json(book))
    .catch(() => res.status(404).json({ error: "Book not found" }));
});
    
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  const author = req.params.author;
  const booksBasedOnAuthor = (auth) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter((b) => b.author === auth);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
  };

  booksBasedOnAuthor(author)
    .then((bookList) => res.json(bookList))
    .catch(() => res.status(404).json({ error: "Book not found" }));
 
  //let new_books = {}
  //const new_author = req.params.author;
  //let i=1;
  //for(let bookid in books){
   //   if(books[bookid].author === new_author ){
    //    new_books[i++] = books[bookid];
    //  }
    //}
    //await res.send(JSON.stringify(new_books))
  
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  
  //let new_books = {}
  //const re_title = req.params.title;
  //let i = 1;
  //for(bookid in books){
    //  if(books[bookid].title === re_title ){
      //  new_books[i++] = books[bookid]
      //}
  //}
  //await res.send(JSON.stringify(new_books))

  const title = req.params.title;
  const booksBasedOnTitle = (bookTitle) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const filteredBooks = Object.values(books).filter((b) => b.title === bookTitle);
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject(new Error("Book not found"));
        }
      }, 300);
    });
  };

  booksBasedOnTitle(title)
    .then((newBooks) => res.json(newBooks))
    .catch(() => res.status(404).json({ error: "Book not found" }));

  
  
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  const reviews = book.reviews || {};
  const response = {
    isbn,
    title: book.title,
    author: book.author,
    reviewCount: Object.keys(reviews).length,
    reviews
  };
  return res.json(response);
});

module.exports.general = public_users;
