#!/usr/local/bin/node
var fs=require("fs")
var express=require("express")
var sio=require("socket.io")
var md5=require("md5")
var nm=require("nodemailer")
var emtrans=global.emailTransport=nm.createTransport({
    service:"hotmail",
    "auth":{
        "user":"squarebrezhnik@outlook.com",
        "pass":fs.readFileSync("emailpsw.txt").toString()
    }
})
assets={}
var emailtemplates={}
fs.readdirSync("email_templates").forEach(f=>emailtemplates[f] = fs.readFileSync('email_templates/'+f,'utf8'))
global.clearCache=()=>assets={}
var questionsdb=JSON.parse(fs.readFileSync("./jsondatabase/questions.json"))
function saveQuestion(question){
questionsdb.questions.push(question)
var rawdb=JSON.stringify(questionsdb,null,4)
fs.writeFileSync("./jsondatabase/questions.json",rawdb)
}

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
function template(template,replace,...replacers){
    var splitted=template.split(replace)
    var result=''
    for (let i = 0; i < splitted.length; i++) {
        result+=splitted[i]+replacers[i]
    }
    //var i=0
    //splitted.forEach(v=>result+=v+replacers[i]?replacers[i++]:'')
    return result
}
var allproducts=require("./db.js")
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
            case"verifyCoupon":{
                return allproducts.verifyCoupon(info.coupon)
                break
            }
            case"fetchAllProducts":{
                return allproducts.products
                break
            }
            case"fetchProductInfo":{
                if(!info.hasOwnProperty('products'))return false
                var returnv={}
                for(var prd in info.products)
                returnv[info.products[prd]] = allproducts.basic_info[info.products[prd]]
                return returnv
                break
            }
            case "fetchWorkers":{
                //console.log(allproducts)
                return allproducts.workers
            }
            case"postQuestion":{
                //cheshinskiy.n@rischool.community
                console.log("Received a contact form",info.formData)
                var formData=info.formData
                //var text=template(emailtemplates['question.html'],'${prop}',formData.identification.name,formData.messageC.message,formData.identification.email)
                // emtrans.sendMail({
                //     from:"squarebrezhnik@outlook.com",
                //     to:info.formData.identification.email,
                //     subject:"Received your support request",
                //     text:`${formData.identification.name},We have received your support request. Your question is "${formData.messageC.message}". The response message will be sent to ${formData.identification.email}`
                // },console.log)
                saveQuestion(info.formData)
                return "question posted successfully. The response will be sent to your email"
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
function generateCookie(res){
    var cookie=md5(Date.now().toString(16))
    res.cookie("squarebrezhnik.socketToken",cookie)
    return cookie
}
httpsv.get("/*",(req,res)=>{
    // console.log()
    var cookie=req.headers.cookie
    if(!cookie)cookie=generateCookie(res)
    socktokens.set(req.headers.cookie,Date.now()+5*60*1000)
    
    console.info(`${req.method} request at ${req.path} IP: ${req.socket.remoteAddress}`)
    if(req.path.includes(".."))return res.end("nah man thats not gonna work :)")
    return res.end(fetchAsset(req.path.substring(1)))
})

var socket_server=new sio.Server(httpsv.listen(process.env.PORT||12839,()=>console.log("HTTP server is up (express) url: http://"+(!process.env.PORT?"localhost:"+12839:"squarebrezhnik.herokuapp.com"))))
socket_server.on("connection",sockethandler)