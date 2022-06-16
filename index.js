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
var allproducts=require("./products.js")
var socktokens=new Map()
var socketInvalidationInterval=setInterval(()=>{
    var dn=Date.now()
    socktokens.forEach((v,k)=>v<dn?socktokens.delete(k):1)
},5000)
function checkAuth(a,sock,inv){
    socktokens.has(a)?clearTimeout(inv)||sockethandler(new socketUser(sock,a)):sock.disconnect(true)
}
function requestData(info){
    try{
        switch(info.what){
            case"fetchHomePageProductsHTML":{
                return allproducts.asShowOfHTML
            }
            case"fetchProductInfo":{
                if(!info.hasOwnProperty('products'))return false
                var returnv={}
                for(var prd in info.products)
                returnv[info.products[prd]] = allproducts.basic_info[info.products[prd]]
                return returnv
            }
            default: return false
        }
    }catch{return false}
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

/**
 * 
 * @param {sio.Socket} sock 
 */
function sockethandler(sock){
if(sock instanceof socketUser){
    console.log(sock)
}
else{
    var invalidator=setTimeout(sock.disconnect,3000,true)
    sock.on("auth",auth=>checkAuth(auth,sock,invalidator))
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