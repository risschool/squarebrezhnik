var socket = io();
    console.log(socket)
    socket.emit("auth",document.cookie)
    socket.emit("path",document.location.pathname)
    var requests=new Map()
        function generateRQID(cb){
            var id=Math.floor(Math.random()*0xffff).toString(16)
            requests.set(id,cb)
            return id
        }
    function request(what,cb){
        socket.emit("requestData",what,generateRQID(cb))
    }
    function getRequestPromise(what){
        return new Promise((res,rej)=>socket.emit("requestData",what,generateRQID(res)))
    }
    socket.on("responseData",(d,id)=>requests.get(id)(d))
