
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
app.get('/favorite', favoriteHandller)
app.get('/trending', trendingHandller)
app.get('/search', searchHandller)
app.get('/now_playing', trendingHandller)
app.get('/tv-airing-today', airingTodayHandller)
app.get("*",errorHandller)
app.use(errorHandller)

function dataHandller(req,res){
    let newdatajson=new jsonData(spiderData.title,spiderData.poster_path,spiderData.overview)
        res.json(newdatajson);    
}

function favoriteHandller(req,res){
  res.send("Welcome to Favorite Page");    
}

function trendingHandller(req,res){
 
let URL=`https://api.themoviedb.org/3/trending/all/week?api_key=${apikey}&language=en-US`;
axios.get(URL)
.then((result)=>{
    let dataMoves =result.data.results.map((move)=>{
        return new dataMovesConstructot(move.id,move.title,move.release_date,move.poster_path,move.overview)  
    })
    res.json(dataMoves)
})
.catch((error)=>{
    errorHandller(error,req,res);
})
}

function searchHandller(req,res){
    let movesName=req.query.title
let URL=`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${movesName}`;
axios.get(URL)
.then((result)=>{
    res.json(result.data.results);
})
.catch((error)=>{
    errorHandller(error,req,res);
})
}

function trendingHandller(req,res){
 
let URL=`https://api.themoviedb.org/3/movies/now-playing?api_key=${apikey}&language=en-US`;
axios.get(URL)
.then((result)=>{
    let playingData =result.data.results.map((playMove)=>{
        return new nowPlaying(playMove.id,playMove.original_title,playMove.original_language,playMove.overview)  
    })
    res.json(playingData)
})
.catch((error)=>{
    errorHandller(error,req,res);
})
}

function airingTodayHandller(req,res){
 
let URL=`https://api.themoviedb.org/3/tv/tv-airing-today?api_key=${apikey}&language=en-US`;
axios.get(URL)
.then((result)=>{
    let dataAiring =result.data.results.map((airToday)=>{
        return new airingToday(airToday.id,airToday.name,airToday.original_language)  
    })
    res.json(dataAiring)
})
.catch((error)=>{
    errorHandller(error,req,res);
})
}

function errorHandller(req,res){
    res.status(404).send("server error 404")
}
app.listen(port,()=>{console.log("hello" ,port);})

function errorHandller(err,req,res){
    res.status(500).send(err)
}

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
function nowPlaying(id,original_title,original_language,overview){
    this.id=id;
    this.original_title=original_title;
    this.original_language=original_language;
    this.overview=overview;
}
function airingToday(id,name,original_language){
    this.id=id;
    this.name=name;
    this.original_language=original_language;
    
}


