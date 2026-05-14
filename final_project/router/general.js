const express = require('express');

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
// Promise {
//    state: "fulfilled",
//    value: books
// }

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
        // .then runs only whent the promise is resolved then it prints the books
        // else the .catch block runs 

});


// Get book by ISBN using async-await
public_users.get('/isbn/:isbn', async (req, res) => {
// async (req,res) means this fucntion can be pasued using await and automatically returns a promise
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
    // async await try/catch instead of .then and .catch()

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


module.exports.general = public_users;