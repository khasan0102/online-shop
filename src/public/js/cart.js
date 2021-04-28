let cartCount = document.querySelector("#cart-count");
let cartTableBody = document.querySelector("#card-table-body");
let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
let updateCart = document.querySelector("#update-cart");
let addOrder = document.querySelector("#default-btn");
let resView = document.querySelector(".result2");
cartCount.textContent = cart.length;

function renderCart(array) {
    cartTableBody.innerHTML = null;
    if (cart.length === 0) {
        cartTableBody.textContent = "No carts";
    }
    for (let el of array) {
        let tr = document.createElement("tr");
        tr.dataset.id = el.id;
        tr.dataset.categoryId = el.categoryId;
        //   image td
        let productImage = document.createElement("td");
        let imageAnchor = document.createElement("a");
        let img = document.createElement("img");

        //product Name
        let productName = document.createElement("td");
        let nameAnchor = document.createElement("a");

        //Product Price
        let productPrice = document.createElement("td");
        let priceSpan = document.createElement("span");

        //product Quantity
        let productQuantity = document.createElement("td");
        let inputCounter = document.createElement("div");
        let minusSpan = document.createElement("span");
        let minusIcon = document.createElement("i");
        let input = document.createElement("input");
        let plusSpan = document.createElement("span");
        let plusIcon = document.createElement("i");

        //product SubTotal
        let productSubTotal = document.createElement("td");
        let totalSpan = document.createElement("span");
        let deleteAnchor = document.createElement("a");
        let deleteIcon = document.createElement("i");

        //styles
        //Product Image
        productImage.classList = "product-thumbnail";
        imageAnchor.style.cursor = "pointer";

        //product Name
        productName.classList = "product-name";
        nameAnchor.style.cursor = "pointer";

        //product Price
        productPrice.classList = "product-price";
        priceSpan.classList = "unit-amount";

        //Product Qauilty
        productQuantity.classList = "product-quantity";
        inputCounter.classList = "input-counter";
        minusSpan.classList = "minus-btn";
        minusIcon.classList = "bx bx-minus";
        plusSpan.classList = "plus-btn";
        plusIcon.classList = "bx bx-plus";

        //product SubTotal
        productSubTotal.classList = "product-subtotal";
        totalSpan.classList = "subtotal-amount";
        deleteAnchor.style.cursor = "pointer";
        deleteAnchor.classList = "remove";
        deleteIcon.classList = "bx bx-trash";

        //append and TextContents

        //product Image
        img.src = el.imgPath;
        imageAnchor.append(img);
        productImage.append(imageAnchor);

        //Product Name
        nameAnchor.textContent = el.name;
        productName.append(nameAnchor);

        //prduct Price
        priceSpan.textContent = new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency",
        }).format(el.price);
        productPrice.append(priceSpan);
        priceSpan.dataset.price = el.price;

        //Product Quantity
        input.value = el.count;
        input.disabled = true;
        minusSpan.append(minusIcon);
        plusSpan.append(plusIcon);
        inputCounter.append(minusSpan);
        inputCounter.append(input);
        inputCounter.append(plusSpan);
        productQuantity.append(inputCounter);

        //product Total
        totalSpan.textContent = new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency",
        }).format(el.allPrice);
        totalSpan.dataset.price = el.allPrice;
        deleteAnchor.append(deleteIcon);
        productSubTotal.append(totalSpan);
        productSubTotal.append(deleteAnchor);

        //and Append
        tr.append(productImage);
        tr.append(productName);
        tr.append(productPrice);
        tr.append(productQuantity);
        tr.append(productSubTotal);

        tr.classList = "tr";

        //functions
        minusSpan.onclick = (event) => {
            if (input.value > 0) {
                input.value = input.value - 0 - 1;
                el.allPrice = el.price * (input.value - 0);
                totalSpan.textContent = new Intl.NumberFormat("en-US", {
                    currency: "USD",
                    style: "currency",
                }).format(el.allPrice);
                totalSpan.dataset.price = el.allPrice;
            }
        };

        plusSpan.onclick = (event) => {
            input.value = input.value - 0 + 1;
            el.allPrice = el.price * (input.value - 0);
            totalSpan.textContent = new Intl.NumberFormat("en-US", {
                currency: "USD",
                style: "currency",
            }).format(el.allPrice);
            totalSpan.dataset.price = el.allPrice;
        };

        deleteAnchor.onclick = (event) => {
            tr.remove();
            if (cartTableBody.childNodes.length === 0) {
                cartTableBody.textContent = "No carts";
            }
        };
        cartTableBody.append(tr);
    }
}

renderCart(cart);

updateCart.onclick = (event) => {
    let trs = document.querySelectorAll(".tr");
    let res = [];
    for (let el of trs) {
        let obj = {};
        obj.imgPath = el.childNodes[0].childNodes[0].childNodes[0].src;
        obj.id = el.dataset.id;
        obj.categoryId = el.dataset.categoryId;
        obj.name = el.childNodes[1].childNodes[0].textContent;
        obj.price = el.childNodes[2].childNodes[0].dataset.price;
        obj.count = el.childNodes[3].childNodes[0].childNodes[1].value - 0;
        obj.allPrice = el.childNodes[4].childNodes[0].dataset.price;
        res.push(obj);
    }
    window.localStorage.setItem("cart", JSON.stringify(res));
    window.location.reload();
};

function subTotal() {
    let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    if(cart.length === 0) return false
    let subTotal = document.querySelector("#subTotal");
    let total = document.querySelector("#total");
    let text = 0;
    for (let el of cart) {
        text += el.allPrice - 0;
    }
    subTotal.textContent = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
    }).format(text);
    total.textContent = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
    }).format(text + 30);
}

subTotal();

addOrder.onclick = async () => {
    let cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    let loginParol = document.querySelector("#login-parol");
    if(loginParol.value.length < 3) 
         return false;
    if (cart.length === 0) {
      window.location.reload();
    };

    let response = await fetch("/cart/order", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
           cart,
           password: loginParol.value  
        }),
    });
    response = await response.json();
    if(response.ok) {
      resView.textContent = "Added product";
         resView.classList = 'result bg-success';
         setTimeout(() => {
            resView.classList = 'result2',
             resView.textContent = ""
         }, 1000);
      window.localStorage.setItem('cart', JSON.stringify([]));
      window.location.reload();
    }else{
      let div1 = document.querySelector('.alert-danger');
      if(div1) div1.remove();
      let modal = document.querySelector('.modal-body');
      let div = document.createElement("div");
      div.classList = 'alert alert-danger';
      div.textContent = response.message
      modal.prepend(div);
    }
};


let order =  document.querySelector("#order");
order.onclick = () => {
  let cart = JSON.parse(window.localStorage.getItem('cart'));
  if(cart.length === 0){
    let modal = document.querySelector('.modal-body');
    let div = document.createElement("div");
    div.classList = 'alert alert-danger';
    div.textContent = 'Your cart is Empty';
    modal.prepend(div);
    addOrder.remove();
  }
}