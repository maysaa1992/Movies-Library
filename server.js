
const express = require('express');
const cors=require('cors');
const axios =require('axios');
const bodyParser = require('body-parser')
const { Client } = require('pg')
let url=`postgres://maysaa:0000@localhost:5432/moves`
const client = new Client(url)
const app= express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('dotenv').config();
const port = process.env.port;
const apikey=process.env.api_key;
const spiderData=require("./MovieData/data.json");

app.get('/', dataHandller)
app.get('/favorite', favoriteHandller)
app.get('/trending', trendingHandller)
app.get('/search', searchHandller)
app.get('/now_playing', nowPlayHandller)
app.get('/tv-airing-today', airingTodayHandller)
app.post('/addMove',addMoveHandller)
app.get('/getMovies',getMoveHandller)
app.get("*",errorHandller)
app.use(errorHandller)
app.put('/UPDATE/:id',updateMoveHandller)
app.delete('/DELETE/:id',deletMoveHandller)
app.get('getMovie/:id',getMoveByidHandller)
function dataHandller(req,res){
    let newdatajson=new JsonData(spiderData.title,spiderData.poster_path,spiderData.overview)
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
        return new Trending(move.id,move.title,move.release_date,move.poster_path,move.overview)  
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

function nowPlayHandller(req,res){
 
let URL=`https://api.themoviedb.org/3/movie/now_playing?api_key=${apikey}&language=en-US&page=1`;
axios.get(URL)
.then((result)=>{
    let playingData =result.data.results.map((playMove)=>{
        return new NowPlaying(playMove.id,playMove.original_title,playMove.original_language,playMove.overview)  
    })
    res.json(playingData)
})
.catch((error)=>{
    errorHandller(error,req,res);
})
}
function airingTodayHandller(req,res){
 
let URL=`https://api.themoviedb.org/3/tv/airing_today?api_key=${apikey}&language=en-US&page=1`;
axios.get(URL)
.then((result)=>{
    let dataAiring =result.data.results.map((airToday)=>{
        return new AiringToday(airToday.id,airToday.name,airToday.original_language)  
    })
    res.json(dataAiring)
})
.catch((error)=>{
    errorHandller(error,req,res);
})
}
function addMoveHandller(req,res){ 
    let {title,overview,imag}=req.body //destructuring
let sql=`INSERT INTO trending_moves(title, overview, imag)
VALUES ($1,$2,$3) RETURNING *;`
let values=[title,overview,imag]
   client.query(sql,values).then((result)=>{

   // res.status(201).send("data saved in Dada Base")
    res.status(201).json(result.rows);

   })
    .catch()
}

function getMoveHandller (req,res){
    let sql=`SELECT * FROM trending_moves;`;
    client.query(sql).then((result)=>{
       // console.log(result);
        res.json(result.rows);
    }).catch();
}
function updateMoveHandller(req,res){
    let moveId=req.param.id;
    let { title, overview, imag,id,comments}=req.body;
    let sql=`UPDATE trending_moves
    SET title = $1, overview = $2,imag=$3,id=$4,comments=$5
    WHERE id=$6; RETURNING *`
    let values=[ title, overview, imag,id,comments,moveId];
    client.query(sql,values).then(result=>{
        res.send(result.rows)
    }).catch();}

    function deletMoveHandller(req,res){
        let {id}=req.param;
        let sql=`DELETE FROM trending_moves WHERE id=$1;`
        let values=[id]
        client.query(sql,values).then(result=>{
            res.status(204).send("delet")
        }).catch();
    }
function getMoveByidHandller(req,res){
    let moveId=req.param.id;
    let sql=`SELECT * FROM trending_moves WHERE id=$1;`;
    let values=[moveId];
    client.query(sql,values).then((result)=>{
        res.json(result.rows);
    }).catch();
}
function errorHandller(req,res){
    res.status(404).send("server error 404")
}
function errorHandller(err,req,res){
    res.status(500).send(err);
}


function JsonData(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}
function Trending (id,title,release_date,poster_path,overview){
this.id=id;
this.title=title;
this.release_date=release_date;
this.poster_path=poster_path;
this.overview=overview;
}
function NowPlaying(id,original_title,original_language,overview){
    this.id=id;
    this.original_title=original_title;
    this.original_language=original_language;
    this.overview=overview;
}
function AiringToday(id,name,original_language){
    this.id=id;
    this.name=name;
    this.original_language=original_language;
    
}
client.connect().then(()=>{
    app.listen(port,()=>{console.log("hello" ,port);})

}).catch()

