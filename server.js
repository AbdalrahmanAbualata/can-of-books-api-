'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const PORT = process.env.PORT;
const server = express();
server.use(cors());


// ********************************************************************************
// use books
mongoose.connect('mongodb://localhost:27017/books', { useNewUrlParser: true, useUnifiedTopology: true });

//Schema
const BookSchema = require("./moduls/BookSchema.js");

//Model
const BookModel = mongoose.model('Book', BookSchema);

function seedDataCollection() {
    const good = new BookModel({
        title: "good",
        description: "This Book is for  Developer",
        status: "On Stock",
        email: "example@gmail.com",
    });

    const amazing = new BookModel({
        title: "amazing",
        description: "This Book is for  life",
        status: "On Stock",
        email: "user@gmail.com",
    });

    const abd = new BookModel({
        title: "abd",
        description: "This Book is for  managment",
        status: "On Stock",
        email: "abuataabooood@yahoo.com",
    });
    good.save();
    amazing.save();
    abd.save();
}
// seedDataCollection(); 


server.get('/test', testHandler);


server.get('/books', getBooksHandler);

function testHandler(req, res) {
    res.send('all good')
}

// localhost:3001/books?title=abd
function getBooksHandler(req,res) {
    console.log('inside getBooksHandler func')
    // let titel = req.query.title;
    BookModel.find({},function(err,data){
        if(err) {
            console.log('error in getting the data')
        } else {
            console.log(data);
            res.send(data)
        }
    })
}

server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})


