// var products={
//     made_of_pine:{
//         category:"pine",
//         price:['6000+'],
//         hname:"Made of pine (custom)",
//         preview:"assets/img/products/product-img-1.jpg",
//         subtext:"Depends on your desires"
        
//     },
//     made_of_oak:{
//         price:['9000+'],
//         hname:"Made of Oak (custom)",
//         category:"oak",
//         preview:"assets/img/products/product-img-3.jpg",
//         subtext:"Depends on your desires"
//     },
//     mix_of_woods:{
//         category:"mix",
//         price:['25000+'],
//         hname:"Mix of multiple woods (custom)",
//         preview:"assets/img/products/product-img-2.jpg",
//         subtext:"Depends on your desires"
//     },

// }
var fs = require('fs')
var workers=JSON.parse(fs.readFileSync("./jsondatabase/employees.json"))
var products=JSON.parse(fs.readFileSync("./jsondatabase/products.json"))
/**
 * @type{Array}
 */
var coupons=JSON.parse(fs.readFileSync("./jsondatabase/coupons.json"))
function verifyCoupon(coupon){
    var id=coupons.findIndex(v=>v.name==coupon)
    return id>-1?coupons[id]:false
}
var basic_info={}
for(var product in products){
    var prd=products[product]
    //asShowOfHTML[product] = prd.showof_html
    basic_info[product]={price:prd.price,hname:prd.hname,image:prd.preview}
}
module.exports={
    //asShowOfHTML,
    products,
    basic_info,
    workers,
    verifyCoupon
}