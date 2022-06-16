var products={
    made_of_pine:{
        price:[4000,6000],
        hname:"Made of pine",
        preview:"assets/img/products/product-img-1.jpg",
        showof_html:`<div class="col-lg-4 col-md-6 text-center">
        <div class="single-product-item">
            <div class="product-image">
                <a href="single-product.html"><img src="assets/img/products/product-img-1.jpg" alt=""></a>
            </div>
            <h3>Made of pine</h3>
            <p class="product-price"><span>Starting from</span> 4000/6000₽ </p>
            <a href="/cart.html" onclick="addToCart('made_of_pine')" class="cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
        </div>
    </div>`
        
    },
    made_of_oak:{
        price:[6000,9000],
        hname:"Made of Oak",
        preview:"assets/img/products/product-img-3.jpg",
        showof_html:`<div class="col-lg-4 col-md-6 text-center">
        <div class="single-product-item">
            <div class="product-image">
                <a href="single-product.html"><img src="assets/img/products/product-img-3.jpg" alt=""></a>
            </div>
            <h3>Made of oak</h3>
            <p class="product-price"><span>Starting from</span> 6000/9000₽ </p>
            <a href="/cart.html" class="cart-btn" onclick="addToCart('made_of_oak')"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
        </div>
    </div>`
    },
    mix_of_woods:{
        price:['25000+'],
        hname:"Mix of multiple woods",
        preview:"assets/img/products/product-img-2.jpg",
        showof_html:`<div class="col-lg-4 col-md-6 text-center">
        <div class="single-product-item">
            <div class="product-image">
                <a href="single-product.html"><img src="assets/img/products/product-img-2.jpg" alt=""></a>
            </div>
            <h3>Mix of multiple woods</h3>
            <p class="product-price"><span>Depends on your desires</span> 25000₽+ </p>
            <a href="/cart.html" onclick="addToCart('mix_of_woods')" class="cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</a>
        </div>
    </div>`
    }

}
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
    basic_info
}