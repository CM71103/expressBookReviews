const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register User
public_users.post("/register", async (req, res) => {

    try {

        let username = req.body.username;
        let password = req.body.password;

        if (!username || !password) {

            return res.status(400).json({
                message: "provide username and password"
            });

        }

        if (isValid(username)) {

            return res.status(400).json({
                message: "username already exists"
            });

        }

        users.push({
            username: username,
            password: password
        });

        return res.status(200).json({
            message: "user registered successfully"
        });

    }
    catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});


// Get all books using Promise callback
public_users.get('/', (req, res) => {

    let getBooks = new Promise((resolve, reject) => {

        if (books) {
            resolve(books);
        }
        else {
            reject("Books not found");
        }

    });

    getBooks
        .then((data) => {

            return res.status(200).json(data);

        })
        .catch((err) => {

            return res.status(404).json({
                message: err
            });

        });

});


// Get book by ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {

    try {

        let isbn = req.params.isbn;

        let book = await new Promise((resolve, reject) => {

            if (books[isbn]) {
                resolve(books[isbn]);
            }
            else {
                reject("Book not found");
            }

        });

        return res.status(200).json(book);

    }
    catch (err) {

        return res.status(404).json({
            message: err
        });

    }

});


// Get books by author using Promise
public_users.get('/author/:author', (req, res) => {

    let author = req.params.author;

    let getAuthorBooks = new Promise((resolve, reject) => {

        let book = Object.values(books).filter((e) => {
            return e.author === author;
        });

        if (book.length > 0) {
            resolve(book);
        }
        else {
            reject("Book not found");
        }

    });

    getAuthorBooks
        .then((data) => {

            return res.status(200).json(data);

        })
        .catch((err) => {

            return res.status(404).json({
                message: err
            });

        });

});


// Get books by title using async-await
public_users.get('/title/:title', async (req, res) => {

    try {

        let title = req.params.title;

        let book = await new Promise((resolve, reject) => {

            let result = Object.values(books).filter((e) => {
                return e.title === title;
            });

            if (result.length > 0) {
                resolve(result);
            }
            else {
                reject("Book not found");
            }

        });

        return res.status(200).json(book);

    }
    catch (err) {

        return res.status(404).json({
            message: err
        });

    }

});


// Get reviews using Promise callback
public_users.get('/review/:isbn', (req, res) => {

    let isbn = req.params.isbn;

    let getReview = new Promise((resolve, reject) => {

        if (books[isbn]) {
            resolve(books[isbn]["reviews"]);
        }
        else {
            reject("Book not found");
        }

    });

    getReview
        .then((data) => {

            return res.status(200).json({
                reviews: data
            });

        })
        .catch((err) => {

            return res.status(404).json({
                message: err
            });

        });

});


// Axios Task 10
// Get all books using async callback function

public_users.get('/asyncbooks', async (req, res) => {

    try {

        let response = await axios.get(
            "http://localhost:5000/"
        );

        return res.status(200).json(response.data);

    }
    catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }

});


// Axios Task 11
// Search by ISBN using Promises

public_users.get('/asyncisbn/:isbn', (req, res) => {

    let isbn = req.params.isbn;

    axios.get(`http://localhost:5000/isbn/${isbn}`)

        .then((response) => {

            return res.status(200).json(response.data);

        })

        .catch((err) => {

            return res.status(404).json({
                message: "Book not found"
            });

        });

});


// Axios Task 12
// Search by Author

public_users.get('/asyncauthor/:author', async (req, res) => {

    try {

        let author = req.params.author;

        let response = await axios.get(
            `http://localhost:5000/author/${author}`
        );

        return res.status(200).json(response.data);

    }
    catch (err) {

        return res.status(404).json({
            message: "Author not found"
        });

    }

});


// Axios Task 13
// Search by Title

public_users.get('/asynctitle/:title', async (req, res) => {

    try {

        let title = req.params.title;

        let response = await axios.get(
            `http://localhost:5000/title/${title}`
        );

        return res.status(200).json(response.data);

    }
    catch (err) {

        return res.status(404).json({
            message: "Title not found"
        });

    }

});


module.exports.general = public_users;