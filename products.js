var products={
    made_of_pine:{
        category:"pine",
        price:['6000+'],
        hname:"Made of pine (custom)",
        preview:"assets/img/products/product-img-1.jpg",
        subtext:"Depends on your desires"
        
    },
    made_of_oak:{
        price:['9000+'],
        hname:"Made of Oak (custom)",
        category:"oak",
        preview:"assets/img/products/product-img-3.jpg",
        subtext:"Depends on your desires"
    },
    mix_of_woods:{
        category:"mix",
        price:['25000+'],
        hname:"Mix of multiple woods (custom)",
        preview:"assets/img/products/product-img-2.jpg",
        subtext:"Depends on your desires"
    },

}
var workers=[
    {
        name:"Roman Sergeevich",
        role:"Proffesional carpenter",
        image:"assets/img/avatars/avatar1.jpg",
        description:'Works with highest qualities of wood in order to create your luxurious bird houses'

    },
    {
        name:"Guinn Neil",
        role:"CEO",
        image:"assets/img/avatars/avatar2.jpg",
        description:"Maintains the wellness of the organisation"
    }
]
var asShowOfHTML={}
var basic_info={}
for(var product in products){
    var prd=products[product]
    asShowOfHTML[product] = prd.showof_html
    basic_info[product]={price:prd.price,hname:prd.hname,image:prd.preview}
}
module.exports={
    asShowOfHTML,
    products,
    basic_info,
    workers
}