let express = require('express')
let jwt = require('jsonwebtoken');
let books = require('./booksdb.js')
let regd_users = express.Router();

let users=[];

// to check validity off username;
const isValid=(username)=>{
    let user = users.filter((u)=>{
        return u.username===username
    });
    // filter returns an array

    if(user.length>0){
        return true;
    }
    else{
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    let user = users.filter((e)=>{
     return  (e.username===username && e.password===password)
    })

    if(user.length>0){
        return true;
    }
    else{
        return false;
    }
}

regd_users.post("/login",(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password){
        return res.status(404).json({message:"Error logging in "});
    }

    if(authenticatedUser(username,password)){
        let accessToken =jwt.sign({username:username},"access",{expiresIn:(60*60)})

        req.session.authorization={
            accessToken,username
        }
        res.status(200).json({message:"user logged in"});
    }
    else{
        res.status(404).json({message:"Invalid login check username an password"})
    }

})

regd_users.put("/auth/review/:isbn",(req,res)=>{
    let review = req.body.review;
    // after : the part is called route parameters
    // and the review is given along with the body
    let username = req.session.authorization.username;
    let isbn = req.params.isbn;

    if(books[isbn]){
        if(!books[isbn]["reviews"]){
            books[isbn]["reviews"] = {}
        }
        books[isbn]["reviews"][username] = review;
        return res.status(200).json({
            message: "Review added successfully"
        });
    }
    else{
        return res.status(404).json({message:"book not found"})
    }
})

regd_users.delete("/auth/review/:isbn", (req, res) => {

    let isbn = req.params.isbn;
    let username = req.session.authorization.username;

    if (books[isbn]) {

        if (books[isbn]["reviews"] &&
            books[isbn]["reviews"][username]) {

            delete books[isbn]["reviews"][username];

            return res.status(200).json({
                message: "Review deleted successfully"
            });

        }

        return res.status(404).json({
            message: "Review not found"
        });

    }

    return res.status(404).json({
        message: "Book not found"
    });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;