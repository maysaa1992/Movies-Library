
const express = require('express');
const cors=require('cors');
const axios =require('axios');
const app= express();
app.use(cors());
require('dotenv').config();
const port = process.env.port;
const apikey=process.env.api_key;
const spiderData=require("./MovieData/data.json");

app.get('/', dataHandller)
function dataHandller(req,res){
    let newdatajson=new jsonData(spiderData.title,spiderData.poster_path,spiderData.overview)
        res.json(newdatajson);    
}
app.get('/favorite', favoriteHandller)
function favoriteHandller(req,res){
  res.send("Welcome to Favorite Page");    
}

app.get('/trending', trendingHandller)
function trendingHandller(req,res){
 
let URL=`https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}&language=en-US`;
axios.get(URL)
.then((result)=>{
    let dataMoves =result.data.results.map((move)=>{
        return new dataMovesConstructot(move.id,move.title,move.release_date,move.poster_path,move.overview)  
    })
    res.json(dataMoves)
})


.catch((err)=>{
    res.send(err);
})
}
app.get('/search', searchHandller)
function searchHandller(req,res){
    let movesName=req.query.name
let URL=`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${movesName}`;
axios.get(URL)
.then((result)=>{
    console.log(result.data.results);
    res.json(result.data.results);
})
.catch((err)=>{
    res.send(err);
})
}
app.use(function(err,req,res,text){
    console.error(err.stack)
    res.status(500).send('internal server error 500')
})

function jsonData(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}
function dataMovesConstructot (id,title,release_date,poster_path,overview){
this.id=id;
this.title=title;
this.release_date=release_date;
this.poster_path=poster_path;
this.overview=overview;
}
app.get("*",errorHandller)
function errorHandller(req,res){
    res.status(404).send("server error 404")
}
app.listen(port,()=>{console.log("hello" ,port);})
