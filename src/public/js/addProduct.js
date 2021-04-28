const productForm = document.querySelector("#Product")
let productName = document.querySelector(".name");
let price = document.querySelector(".price")
let imgUrl = document.querySelector(".imgUrl");
let categories = document.querySelector("#categories");
let resView = document.querySelector(".result2");
 


productForm.addEventListener("submit", async event => {
    event.preventDefault();
     let response = await fetch("/graphql", {
         method: "POST",
         headers: {
             "Content-Type": "application/json"
         },
         body: JSON.stringify({
             query: `
             mutation add($name: String!, $price: Int!, $imgUrl: String!, $categoryId: Int!){
                addProduct(name: $name, price: $price, imgUrl: $imgUrl, categoryId: $categoryId) {
                  status
                  message
                }
              }
             `,
             variables: {
                 name: productName.value,
                 price: price.value - 0,
                 imgUrl: imgUrl.value,
                 categoryId: categories.value - 0
             }
         })
     });
      
     categories.value = 1
     price.value = ''
     productName.value = ''
     imgUrl.value = ''
     let { data } = await response.json();
     let message = data.addProduct
     if(message.status === 200) {
         resView.textContent = "Added product";
         resView.classList = 'result bg-success';
         setTimeout(() => {
            resView.classList = 'result2',
             resView.textContent = ""
         }, 1000);
     } else {
        resView.textContent = "Bad Request";
        resView.classList = 'result bg-danger';
        setTimeout(() => {
           resView.classList = 'result2',
            resView.textContent = ""
        }, 500);
     }
})