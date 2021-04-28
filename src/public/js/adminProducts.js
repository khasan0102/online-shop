let productsBox = document.querySelector("#products-box");
let categoriesItems = document.querySelectorAll('.categories-item');
let categories = document.querySelector('.categories');
let all = document.querySelector("#all");
let saveChanges = document.querySelector("#save-changes");
let imgUrl = document.querySelector('#img-url')
let productPrice = document.querySelector('.price-input')
let deleteEl = document.querySelector("#deleteEl");

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
      let editAnchor = document.createElement('a');
      let deleteAnchor = document.createElement('a');
      let editIcon = document.createElement('i');
      let deleteIcon = document.createElement('i');
      
      //Products content
      let contentBox = document.createElement('div');
      let contentHeading = document.createElement('h3');
      let productTitle = document.createElement('a');
      let productPrice = document.createElement('span');

      //productImage Box setting
      productImgA.href = "#"
      productImg.src = el.imgPath
      productImgA.append(productImg)

      editIcon.classList = "far fa-edit"
      deleteIcon.classList = "fas fa-trash"

      editAnchor.append(editIcon);
      deleteAnchor.append(deleteIcon);
      editAnchor.dataset.id = el.id;
      deleteAnchor.dataset.id = el.id;
      editAnchor.setAttribute('data-bs-toggle', "modal");
      editAnchor.setAttribute('data-bs-target', "#exampleModal");  
      deleteAnchor.setAttribute('data-bs-toggle', "modal");
      deleteAnchor.setAttribute('data-bs-target', "#deleteModal");  
      editAnchor.onclick = (event) => {
         window.localStorage.setItem('elId', event.target.parentNode.dataset.id);
      }
      deleteAnchor.onclick = (event) => {
        window.localStorage.setItem('elId', event.target.parentNode.dataset.id);
      }

      editAnchor.href = '#'
      deleteAnchor.href = '#'
      li1.append(editAnchor);
      li2.append(deleteAnchor);
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


// start changes
saveChanges.onclick = async () => {
  if(productPrice.value && imgUrl.value){
    let elId = window.localStorage.getItem('elId');
    let response = await fetch('/graphql', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
              mutation change($id: String!, $price: Int!, $imgUrl: String!) {
                  editProduct(id: $id, price: $price, imgUrl: $imgUrl) {
                      status
                      message
                  }
              }          
            `,
            variables: {
                id: elId,
                price: productPrice.value - 0,
                imgUrl: imgUrl.value
            }
        })
    })
  
    let {data: { editProduct }} = await response.json();
    productPrice.value = "";
    imgUrl.value = "";
   
    if(editProduct.status == 201) 
      window.location.reload()
  }
}

//end changes


//start delete

deleteEl.onclick = async () => {
   let elId = window.localStorage.getItem('elId');
   let response = await fetch('/graphql', {
       method: "POST",
       headers: {
        "Content-Type": "application/json"
       },
       body: JSON.stringify({
           query: `
                mutation delete($id: String!) {
                    deleteProduct(id: $id) {
                        status
                        message
                    }
                }
           `,
           variables: {
               id: elId
           }
       }),
   });

   let {data: { deleteProduct }} = await response.json();
   if(deleteProduct?.status === 201) {
       window.location.reload();
   }
}