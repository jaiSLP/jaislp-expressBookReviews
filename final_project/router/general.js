const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
     // Send JSON response with formatted friends data
    res.send(JSON.stringify(books,null,4));

});
//  Task10 - // Get book lists using Async/await
/*
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('https://jaislp111-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');   
   
      const bookData = response.data;
      res.json(bookData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching book list' });
    }
  });
  */
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });

 //  Task 11 - // Get book details based on ISBN
 /*
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;  
    try {
      const response = await axios.get(`https://jaislp111-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/${isbn}`);
      const bookData = response.data;
      res.json(bookData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching book details' });
    }
  });
 */ 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    const foundBooks = Object.values(books).filter(book => book.author === author);

  if (foundBooks.length   > 0) {
    res.json(foundBooks);
  } else {
    res.status(404).json({ message: 'No books found for the author' });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Task 12 -- get books by author
/*
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;  
    try {
      const allBooks = Object.values(books); // Convert to array  
      const foundBooks = allBooks.filter(book => book.author === author);  
      if (foundBooks.length > 0) {
        res.json(foundBooks);
      } else {
        res.status(404).json({ message: 'No books found for the author' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching books by author' });
    }
  });
  */
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const foundBook = Object.values(books).find(book => book.title === title);

  if (foundBook) {
    res.json(foundBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//Task 13 - get books by title
/*
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {      
      const allBooks = Object.values(books);
      const foundBook = allBooks.find(book => book.title === title);  
      if (foundBook) {
        res.json(foundBook);
      } else {
        res.status(404).json({ message: 'Book not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching book by title' });
    }
  });
  */
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    //res.send(book.reviews);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: 'Book not found'   });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
