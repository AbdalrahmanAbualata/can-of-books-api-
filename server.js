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
mongoose.connect(`${process.env.DB_LINK}`, { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify:false});

//Schema
const BookSchema = require("./moduls/BookSchema.js");

//Model
const BookModel = mongoose.model('Book', BookSchema);

server.get('/test', testHandler);
server.get('/books', getBooksHandler);//.get => using quary
server.post('/addBook', addBookHandler);//.post => using body
server.delete('/deletBook/:bookId', deletBookHandler);//.delete => using  params and quary
server.put('/updateBook/:bookId', updateBookHandler);//.put => using  params and quary
// *****************************************************************************************************************
function testHandler(req, res) {
    res.send('all good')
}
// *****************************************************************************************************************
// localhost:3002/addBook,{ title: "abd",  description: "This Book is for  managment",  status: "On Stock",  email: "abuataabooood@yahoo.com" }
async function addBookHandler(req, res) {
    console.log(req.body); // for more detalis go to branch lab13
    let { title, description, status,email } = req.body; //Destructuring assignment .
    await BookModel.create({ title, description, status,email });
    getBooksHandler(req,res); // send data to frontEnd
}
// *****************************************************************************************************************
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
// *****************************************************************************************************************
async function deletBookHandler(req,res) {
    console.log('inside deletBookHandler func');
    let bookId = req.params.bookId;
    BookModel.remove({_id:bookId},(error,deletedBook)=>{
        if(error) {
            console.log('error in deleteing the data')
        } else {
            console.log('data deleted', deletedBook)
            getBooksHandler(req,res);
        }
    })
}
// *****************************************************************************************************************
async function updateBookHandler(req,res) { // another way https://github.com/LTUC/amman-301d29/blob/master/class-14/demo/react-mongoose/backend/server.js
    console.log('inside updateBookHandler func');
    let bookId = req.params.bookId;
    let { title, description, status,email }=req.body;
    console.log(req.body);
    BookModel.findByIdAndUpdate(bookId, { title , description, status, email },(error,updatedData)=>{//updatedDatais for one obj just 
        if(error) {
            console.log('error in updating the data')
        } else {
            console.log("Data updated!");
            
            BookModel.find({email: req.body.email},function(err,data){
                if(err) {
                    console.log('error in getting the data')
                } else {
                    res.send(data);
                }
            })
        }
    })
}
// *****************************************************************************************************************
server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})



