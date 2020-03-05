$(document).ready(() => {
    httpRequest("products.php", displayProducts);
    getCartContent();
});

/**
 * HANDLE ALL HTTP REQUESTS
 * @param {*} url url to fetch the API data
 * @param {*} cFunction callback function to handle the response data
 * @param {*} method Default set to GET options inclue POST, PUT, DELETE
 * @param {*} data Request Data in case of POST, PUT
 */
function httpRequest(url, cFunction, method = "GET", data = null) {
    $("#loader").html("<p class='text-warning'>Loading data...</p>");
    const xHttp = new XMLHttpRequest();

    xHttp.open(method, url, true);
    xHttp.send(data);
    xHttp.onreadystatechange = res => {
        $("#loader").html("");
        if (res.target.readyState == 4 && res.target.status == 200) {
            const jsonResonse = JSON.parse(res.target.responseText);
            cFunction(jsonResonse);
        } else {
            $("#loader").html("<p class='text-danger'>Error Fetching data</p>");
        }
    };
}

/**
 * Display All products
 *
 * @param {*} products Get products and display on the html products div
 */
function displayProducts(products) {
    let productsColumn = document.getElementById("products");
    let productFragment = new DocumentFragment();

    products.forEach(product => {
        let productColumn = document.createElement("div");
        productColumn.classList.add("col-md-3");
        productColumn.innerHTML =
            '<div class="card">' +
            '<img src="' +
            product.image +
            '" class="card-img-top" alt="' +
            product.name +
            '">' +
            '<div class="card-body">' +
            '<h5 class="card-title text-sm">' +
            product.name +
            ' $' +
            product.price +
            '</h5>' +
            '<button id="add_to_cart_button_' +
            product.id +
            '" onclick="addToCart(' +
            product.id +
            ')" class="btn btn-sm btn-primary">' +
            '<i class="fa fa-cart-plus"></i> ' +
            '</button>' +
            '<button type="button" class="btn btn-sm float-right btn-link text-warning">' +
            '<i class="fa fa-star" aria-hidden="true"></i> 0.0' +
            '</button>' +
            '</div>' +
            '</div>';
        productFragment.appendChild(productColumn);
    });

    productsColumn.appendChild(productFragment);
    setCartItemContents();
}

function getCartContent() {
    let cartButton = document.getElementById("cartDropdownMenuLink");
    const cartItems = getCartItems();
    cartButton.innerHTML = `<i class="fa fa-shopping-cart"></i> My Cart [${cartItems.length}]`;
    setCartItemContents();
    getMyCartProducts();
}

function addToCart(id) {
    const cartItems = getCartItems();
    cartItems.push({ id });
    localStorage.setItem(
        "cart_items",
        JSON.stringify(
            [...new Set(cartItems.map(item => item.id))].map(id => {
                return cartItems.find(item => item.id === id);
            })
        )
    );
    setAddToCartButtonContent(id);
    getCartContent();
}

function clearCart() {
    resetAddToCartToButton();
    localStorage.setItem("cart_items", JSON.stringify([]));
    getCartContent();
}

/**
 * Remove particular item from cart
 * @param {*} id 
 */
function removeCartItem(id) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => {
        return item.id != id;
    });
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
    setAddToCartButtonContent(id);
    getCartContent();
}

/**
 * Check if item exists in cart
 * @param {*} id 
 */
function checkItemInCart(id) {
    const cartItems = getCartItems();
    const exists = cartItems.findIndex(item => item.id == id);
    if (exists != -1) {
        return true;
    }
    return false;
}

/**
 * Set Cart button content
 * @param {*} id 
 */
function setAddToCartButtonContent(id) {
    const button = $(`#add_to_cart_button_${id}`);
    if (checkItemInCart(id) == true) {
        button.html('<i class="fa fa-cart-arrow-down"></i>');
        button.addClass("btn-warning");
        button.removeAttr("onclick");
        button.attr("onclick", `removeCartItem(${id})`);
    }
    else {
        button.html('<i class="fa fa-cart-plus"></i> ');
        button.removeClass("btn-warning");
        button.addClass("btn-primary");
        button.attr("onclick", `addToCart(${id})`);
    }
}

/**
 * Set Cart Item content for each product
 */
function setCartItemContents() {
    const cartItems = getCartItems();
    cartItems.forEach(item => {
        setAddToCartButtonContent(item.id);
    });
}

/**
 * Reset Cart button content to Add Cart
 */
function resetAddToCartToButton() {
    const cartItems = getCartItems();
    cartItems.forEach(item => {
        const button = $(`#add_to_cart_button_${item.id}`);
        button.html('<i class="fa fa-cart-plus"></i> ');
        button.removeClass("btn-warning");
        button.addClass("btn-primary");
        button.attr("onclick", `addToCart(${item.id})`);
    });
}

/**
 * Get Current Cart Items
 * 
 * @return array
 */
function getCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    return cartItems;
}

function getMyCartProducts() {
    const cartItems = getCartItems();
    $('#my_cart_items').html('');
    cartItems.forEach(item => {
        httpRequest(`products.php?product_id=${item.id}`, setMyCartContent)
    });
}

function setMyCartContent(data) {
    const myCartColumn = document.createElement('li')
    myCartColumn.classList.add("list-group-item");
    myCartColumn.classList.add("rounded-0");
    myCartColumn.classList.add("py-2");
    myCartColumn.innerHTML = data.product.name +
    '<button class="btn btn-link text-danger" onclick="removeCartItem(' + data.product.id +')"><i class="fa fa-trash"></i></button>';
    document.getElementById('my_cart_items').appendChild(myCartColumn);
}
