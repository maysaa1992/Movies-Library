
const express = require('express');
const app= express();
const port = 3002;
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
app.get("*",errorHandller)
function errorHandller(req,res){
    res.status(404).send("server error 404")
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
app.listen(port,()=>{console.log("hello");})
