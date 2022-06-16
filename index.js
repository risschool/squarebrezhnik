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
var socketInvalidationInterval=setInterval(()=>{
    var dn=Date.now()
    socktokens.forEach((v,k)=>v<dn?socktokens.delete(k):1)
},5000)
function checkAuth(a,sock){
    return socktokens.has(a)?sockethandler(new socketUser(sock,a)):sock.disconnect(true)
}
function requestData(info){

}
class socketUser{
    /**
     * 
     * @param {sio.Socket} sock 
     */
    constructor(sock,cookie){
        this.socket=sock
        this.cookie=cookie
        sock.on("path",p=>this.path=p)
        sock.on("requestData",(d,id)=>sock.emit("responseData",requestData(d),id))
    }
}
function isSockAuthed(sock){
    sock.disconnect(!(sock instanceof socketUser))
}
/**
 * 
 * @param {sio.Socket} sock 
 */
function sockethandler(sock){
if(sock instanceof socketUser){
    console.log(sock)
}
else{
    setTimeout(isSockAuthed,3000,sock)
    sock.on("auth",auth=>checkAuth(auth,sock))
}

}
var httpsv=express()

httpsv.get("/*",(req,res)=>{
    // console.log()
    socktokens.set(req.headers.cookie,Date.now()+5*60*1000)
    console.info(`${req.method} request at ${req.path} IP: ${req.socket.remoteAddress}`)
    if(req.path.includes(".."))return res.end("nah man thats not gonna work :)")
    return res.end(fetchAsset(req.path.substring(1)))
})

var socket_server=new sio.Server(httpsv.listen(process.env.PORT||12839,()=>console.log("HTTP server is up (express) url: http://"+(!process.env.PORT?"localhost:"+12839:"squarebrezhnik.herokuapp.com"))))
socket_server.on("connection",sockethandler)