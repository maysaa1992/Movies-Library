
const express = require('express');
const cors=require('cors');
const axios =require('axios');
const bodyParser = require('body-parser')
const { Client } = require('pg')
let url=process.env.url;
const client = new Client(url)
const app= express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('dotenv').config();
const PORT = process.env.PORT;
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
app.put('/UPDATE/:id',updateMoveHandller)
app.delete('/DELETE/:id',deletMoveHandller)
app.get('/getMovie/:id',getMoveByidHandller)
// app.get("*",errorHandller)
// app.use(errorHandller)

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
.catch(err=>{consolo.log(err)})
}

function searchHandller(req,res){
    let movesName=req.query.title
let URL=`https://api.themoviedb.org/3/search/movie?api_key=${apikey}&query=${movesName}`;
axios.get(URL)
.then((result)=>{
    res.json(result.data.results);
})
.catch(err=>{consolo.log(err)})
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
.catch(err=>{consolo.log(err)})
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
.catch(err=>{consolo.log(err)})
}
function addMoveHandller(req,res){ 
    let {title,comments}=req.body //destructuring
let sql=`INSERT INTO trending_moves(title,comments)
VALUES($1,$2) RETURNING *;`
let values=[title,comments]
   client.query(sql,values).then((result)=>{

   // res.status(201).send("data saved in Dada Base")
    res.status(201).json(result.rows);

   })

   .catch(err=>{consolo.log(err)})
}

function getMoveHandller (req,res){
    let sql=`SELECT * FROM trending_moves;`;
    client.query(sql).then((result)=>{
       // console.log(result);
        res.json(result.rows);
    }).catch(err=>{consolo.log(err)})
}
function updateMoveHandller(req,res){
    let moveId=req.params.id;
    let { title,comments}=req.body;
    console.log(title,comments)
    let sql=`UPDATE trending_moves SET title = $1, comments=$2
    WHERE id=$3 RETURNING *;`
    let values=[ title,comments,moveId];

    client.query(sql,values).then(result=>{
       // console.log("hi")
        res.send(result.rows)
    }).catch(err=>{consolo.log(err)})
}

    function deletMoveHandller(req,res){
        let {id}=req.params;
        let sql=`DELETE FROM trending_moves WHERE id=$1;`
        let values=[id];
        client.query(sql,values).then(result=>{
            res.status(204).send("delete")
        }).catch(err=>{consolo.log(err)})
    }
function getMoveByidHandller(req,res){
    let moveId=req.params.id;
    console.log(moveId)
    console.log("hi")
    let sql=`SELECT * FROM trending_moves WHERE id=$1;`;
    let values=[moveId];
    client.query(sql,values).then((result)=>{
        res.json(result.rows);
    }).catch(err=>{consolo.log(err)})
}
// function errorHandller(req,res){
//     res.status(404).send("server error 404")
// }
// function errorHandller(err,req,res){
//     res.status(500).send(err);
// }


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
    app.listen(PORT,()=>{console.log("hello" ,PORT);})

}).catch()

