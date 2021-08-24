'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT;
const server = express();
server.use(cors());
server.use(express.json()); //middleware. using  post to read  req.body


// ******************************************************************************************************* 
// use books
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

//Schema
const BookSchema = require("./moduls/BookSchema.js");

//Model
const BookModel = mongoose.model('Book', BookSchema);

server.get('/test', testHandler);


server.get('/books', getBooksHandler);
server.post('/addBook', addBookHandler);
server.delete('/deletBook/:bookId', deletBookHandler);


function testHandler(req, res) {
    res.send('all good')
}

// localhost:3002/addBook,{ title: "abd",  description: "This Book is for  managment",  status: "On Stock",  email: "abuataabooood@yahoo.com" }
async function addBookHandler(req, res) {
    console.log(req.body);
    // { title: "abd",  description: "This Book is for  managment",  status: "On Stock",  email: "abuataabooood@yahoo.com" }
    // let title = req.body.title;
    // let description = req.body.description;
    // let status = req.body.status;
    // let email = req.body.email;
    let { title, description, status,email } = req.body; //Destructuring assignment .
    // const newBook = new BookModel({
        //         title: title,
        //         description: description,
        //         status: status,
        //         email: email,
        // })
        // await newBook.save();
    await BookModel.create({ title, description, status,email });
    // await BookModel.create(req.body)
    getBooksHandler(req,res); // send data to frontEnd

}

// localhost:3001/books?email=email
function getBooksHandler(req,res) {
    console.log('inside getBooksHandler func')
    let emailOwner = req.query.email;
    BookModel.find({email: emailOwner},function(err,data){
        if(err) {
            console.log('error in getting the data')
        } else {
            console.log(data);
            res.send(data);
        }
    })
}

async function deletBookHandler(req,res) {
    console.log('inside deletBookHandler func');
    console.log(req.params)
    console.log(req.params.bookId);
    let emailOwner= req.query.email;

    let bookId = req.params.bookId;
    BookModel.remove({_id:bookId},(error,deletedBook)=>{
        if(error) {
            console.log('error in deleteing the data')
        } else {
            console.log('data deleted', deletedBook)
            BookModel.find({email: emailOwner},function(err,data){
                if(err) {
                    console.log('error in getting the data')
                } else {
                    console.log(data);
                    res.send(data);
                }
            })
        }
    })



}

server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})


