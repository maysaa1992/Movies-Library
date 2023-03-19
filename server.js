
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
app.use(function(err,req,res,text){
    console.error(err.stack)
    res.type('text/plain')
    res.status(500)
    res.send('internal server error 500')
})
app.get("*",(res,req)=>{
    res.send("server error 404")
})
function jsonData(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}
app.listen(port,()=>{console.log("hello");})
