let cartTableBody = document.querySelector("#card-table-body");

function renderCart(array) {
    cartTableBody.innerHTML = null
    if (array.length === 0) {
        cartTableBody.textContent = "No Orders";
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
        let input = document.createElement("input");

        //product SubTotal
        let productSubTotal = document.createElement("td");
        let totalSpan = document.createElement("span");

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

        //product SubTotal
        productSubTotal.classList = "product-subtotal";
        totalSpan.classList = "subtotal-amount";

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
        inputCounter.append(input);
        productQuantity.append(inputCounter);

        //product Total
        totalSpan.textContent = new Intl.NumberFormat("en-US", {
            currency: "USD",
            style: "currency",
        }).format(el.allPrice);
        totalSpan.dataset.price = el.allPrice;
        productSubTotal.append(totalSpan);

        //and Append
        tr.append(productImage);
        tr.append(productName);
        tr.append(productPrice);
        tr.append(productQuantity);
        tr.append(productSubTotal);

        tr.classList = "tr";

        //functions
        cartTableBody.append(tr);
    }
}


async function getOrders () {
    cartTableBody.innerHTML = null;
    let div = document.createElement('div');
    div.classList = 'lds-dual-ring';
    cartTableBody.append(div);
    let response = await fetch('/account/order');
    response = await response.json();
    renderCart(response.order);
    let subTotal = document.querySelector("#subTotal");
    let total = document.querySelector("#total");
    let text = 0;
    for (let el of response.order) {
        text += el.allPrice - 0;
    }
    subTotal.textContent = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
    }).format(text);
    total.textContent = new Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
    }).format(text + 30)
}

getOrders();