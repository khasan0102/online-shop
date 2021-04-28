let productsBox = document.querySelector("#products-box");
let all = document.querySelector("#all");
let categoriesItems = document.querySelectorAll('.categories-item');
let cartCount = document.querySelector("#cart-count");
console.log(cartCount)
async function  getProducts (event) {
    productsBox.innerHTML = null
    let div = document.createElement('div');
    div.classList = 'lds-dual-ring';
    productsBox.append(div);

    let response = await fetch('/graphql', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                query {
                    products {
                        id
                        name
                        price
                        imgPath
                        categoryId
                    }
                }          
            `
        }),
    });  
    let {data: { products }} = await response.json()
    renderProducts(products, productsBox)
    
}
getProducts();
all.addEventListener('click', getProducts)

function renderProducts(array, elementBox) {
    let wishlist = JSON.parse(window.localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(window.localStorage.getItem('cart')) || [];
    cartCount.textContent = cart.length;
    elementBox.innerHTML = null
    if(array.length === 0) {
        elementBox.textContent = "Not products"
    }
    for(let el of array) {
      //global div  
      let divCol = document.createElement('div');
      let divTop = document.createElement('div');
      
      //productImgBox elements
      let productImgBox = document.createElement('div');
      let productImgA = document.createElement('a');
      let productImg = document.createElement('img');
      let productIcons = document.createElement('ul');
      let li1 = document.createElement('li');
      let li2 = document.createElement('li');
      let heartAnchor = document.createElement('a');
      let cartAnchor = document.createElement('a');
      let heartIcon = document.createElement('i');
      let cartIcon = document.createElement('i');
      
      //Products content
      let contentBox = document.createElement('div');
      let contentHeading = document.createElement('h3');
      let productTitle = document.createElement('a');
      let productPrice = document.createElement('span');

      //productImage Box setting
      productImgA.style.cursor = "pointer"
      productImg.src = el.imgPath;
      productImgA.append(productImg);
      let isTrust = wishlist.find((elm) => elm.id === el.id);
      let isTrust2 = cart.find(el1 => el1.id === el.id);
      heartIcon.classList =  isTrust ? 'fas fa-heart' : "far fa-heart";  
      cartIcon.classList =  isTrust2 ? "fas fa-shopping-cart" : "fas fa-cart-plus"; 

      heartAnchor.append(heartIcon);
      cartAnchor.append(cartIcon);
      heartAnchor.dataset.id = el.id;
      cartAnchor.dataset.id = el.id;  
      heartAnchor.onclick = (event) => {
         let wishlist = JSON.parse(window.localStorage.getItem('wishlist')) || [];
         
         if(event.target.classList.value === 'far fa-heart'){
            event.target.classList.value = 'fas fa-heart'
            wishlist.push(el)
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
         }else{
            event.target.classList.value = 'far fa-heart'
            for(let wish in wishlist){
              if(wishlist[wish].id === el.id){
                  wishlist.splice(wish, 1);
                  break
              }
            }
           
            window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
         }
      }
      cartAnchor.onclick = (event) => {
        if(event.target.classList.value === 'fas fa-shopping-cart') {
            event.target.classList.value = "fas fa-cart-plus";
            for(let i in cart) {
                if(cart[i].id === el.id) {
                    cart.splice(i, 1);
                    break;
                }
            }
        }else {
            event.target.classList.value = 'fas fa-shopping-cart';
            let obj = el;
            obj.allPrice = obj.price;
            obj.count = 1;
            cart.push(obj);
        }
        cartCount.textContent = cart.length;
        window.localStorage.setItem('cart', JSON.stringify(cart));
      }

      heartAnchor.style.cursor = 'pointer'
      cartAnchor.style.cursor = 'pointer'
      li1.append(heartAnchor);
      li2.append(cartAnchor);
      productIcons.classList = 'products-action'
      productIcons.append(li1);
      productIcons.append(li2);
      
      productImgBox.classList = "products-image"
      productImgBox.append(productImgA);
      productImgBox.append(productIcons);

      //end Product Img Box


      //Product content setting
      productTitle.textContent = el.name;
      productTitle.href = "#"
      productPrice.textContent = new Intl.NumberFormat('en-US', {
          currency: 'USD', 
          style: 'currency'
      }).format(el.price);
      
      contentHeading.append(productTitle);
      contentHeading.append(productPrice);

      contentBox.classList = 'products-content m-0 mt-2'
      contentBox.append(contentHeading);

      //end


      divTop.classList = "top-products-item";
      divTop.append(productImgBox);
      divTop.append(contentBox);

      divCol.classList = "col-lg-3 col-md-6";
      divCol.append(divTop);

      elementBox.append(divCol);
    }
}

for(let el of categoriesItems) {
    el.onclick = async event => {
       if(event.target.dataset.value){
        productsBox.innerHTML = null
        let div = document.createElement('div');
        div.classList = 'lds-dual-ring';
        productsBox.append(div);
        let response = await fetch('/graphql', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                query: `
                query add($categoryId: Int!){
                    categoryProducts(categoryId: $categoryId) {
                      name
                      price 
                      imgPath
                      id
                      categoryId    
                    }
                  }
                `,
                variables: {
                    categoryId: event.target.dataset.value - 0
                }
            }),
        });
        
        let {data: { categoryProducts }} = await response.json();
        renderProducts(categoryProducts, productsBox);
       }
    }
}