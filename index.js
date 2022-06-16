#!/usr/local/bin/node
var fs=require("fs")
var express=require("express")
var sio=require("socket.io")
var assets={}
function fetchAsset(assetName){
    if(!assets.hasOwnProperty(assetName)){
    try{
    try{
        assets[assetName]=fs.readFileSync("./assets/"+assetName)
    }catch{
        assets[assetName]=fs.readFileSync("./assets/"+assetName+"/index.html")
    }
    } catch{
        assets[assetName]=fetchAsset("404.html")
    }
    }
    return assets[assetName]
}
var socktokens=new Map()
function checkAuth(socktoken){
    return socktokens.has(socktoken)
}
/**
 * 
 * @param {sio.Socket} sock 
 */

function sockethandler(sock,auth){
if(!auth){
sock.emit("auth","auth_self")
sock.on("auth",a=>checkAuth(a)?sockethandler(sock,true):sock.disconnect(true))
}
else{

}

}
var httpsv=express()

httpsv.get("/*",(req,res)=>{
    console.info(`${req.method} request at ${req.path} IP: ${req.socket.remoteAddress}`)
    if(req.path.includes(".."))return res.end("nah man thats not gonna work :)")
    return res.end(fetchAsset(req.path.substring(1)))
})

var socket_server=new sio.Server(httpsv.listen(process.env.PORT||12839,()=>console.log("HTTP server is up (express) url: http://"+(!process.env.PORT?"localhost:"+12839:"squarebrezhnik.herokuapp.com"))))
socket_server.on("connection",sockethandler)