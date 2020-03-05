$(document).ready(() => {
    $("#my_cart_buttons").hide();
    $("#show_no_items").hide();
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
    $("#spinner").html(
        "<i class='fa fa-circle-o-notch fa-spin text-warning'></i>"
    );
    const xHttp = new XMLHttpRequest();

    xHttp.open(method, url, true);
    xHttp.send(data);
    xHttp.onreadystatechange = res => {
        $("#spinner").html("");
        if (res.target.readyState == 4 && res.target.status == 200) {
            const jsonResonse = JSON.parse(res.target.responseText);
            cFunction(jsonResonse);
        } else {
            $("#spinner").html("<p class='text-danger'>Error Fetching data</p>");
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
            " $" +
            product.price +
            "</h5>" +
            '<input type="number" id="quantity_' +
            product.id +
            '" class="form-control rounded-0 form-control-sm mr-1 w-12" value="1" min="1" max=' +
            product.quantity_available +
            " />" +
            '<button type="submit" id="add_to_cart_button_' +
            product.id +
            '" onclick="addToCart(' +
            product.id +
            ')" class="btn btn-sm rounded-0 btn-primary">' +
            '<i class="fa fa-cart-plus"></i> ' +
            "</button>" +
            '<button class="btn btn-sm float-right btn-link text-warning">' +
            '<i class="fa fa-star" aria-hidden="true"></i> 0.0' +
            "</button>" +
            "</div>" +
            "</div>";
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
    const quantity = $(`#quantity_${id}`).val();
    const maxQuantity = $(`#quantity_${id}`).attr("max");
    if (parseInt(quantity) > parseInt(maxQuantity)) {
        alert(`Quantity available is ${maxQuantity}, Your quantity ${quantity}`);
    } else {
        cartItems.push({ id, quantity });
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
}

function clearCart() {
    $("#my_cart_buttons").hide();
    resetAddToCartToButton();
    localStorage.setItem("cart_items", JSON.stringify([]));
    getCartContent();
}

/**
 * Remove particular item from cart
 * @param {*} id
 */
function removeCartItem(id) {
    $("#total_amount").val(0)
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
    const cartItem = getCartItem(id);
    if (checkItemInCart(id) == true) {
        button.html('<i class="fa fa-cart-arrow-down"></i>');
        button.addClass("btn-warning");
        button.removeAttr("onclick");
        button.attr("onclick", `removeCartItem(${id})`);
        $(`#quantity_${id}`).val(cartItem.quantity);
    } else {
        button.html('<i class="fa fa-cart-plus"></i> ');
        button.removeClass("btn-warning");
        button.addClass("btn-primary");
        button.attr("onclick", `addToCart(${id})`);
        $(`#quantity_${id}`).val(1);
    }
}

/**
 * Set Cart Item content for each product
 */
function setCartItemContents() {
    const cartItems = getCartItems();
    if (cartItems.length > 0) $("#my_cart_buttons").show();
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

function getCartItem(id) {
    const cartItems = getCartItems();
    return cartItems.find(item => item.id == id);
}

/**
 * Get Cart contents 
 */
function getMyCartProducts() {
    const cartItems = getCartItems();
    $("total_amount").val(0);
    $("#my_cart_items").html("");
    $("#show_no_items").hide();
    $("#my_cart_modal_content").show()
    $("#my_cart_table tbody").empty();
    if (cartItems.length === 0) {
        $("#show_no_items").show();
        $("#my_cart_modal_content").hide();
    };

    cartItems.forEach(item => {
        httpRequest(`products.php?product_id=${item.id}`, setMyCartContent);
    });
}

/**
 * This is a callback function to handle data from http Request
 * Get the http response and display on dropdown and modal
 * @param {*} data 
 */
function setMyCartContent(data) {
    const myCartColumn = document.createElement("li");
    const cartItem = getCartItem(data.product.id);
    const totalCost = parseFloat(cartItem.quantity * parseFloat(data.product.price));
    let totalAmount = setTotalAmount(totalCost);
    console.log(totalAmount);
    myCartColumn.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "rounded-0",
        "py-2"
    );
    myCartColumn.innerHTML =
        data.product.name +
        " [" +
        cartItem.quantity +
        "]" +
        '<button class="btn btn-link text-danger text-right" onclick="removeCartItem(' +
        data.product.id +
        ')"><i class="fa fa-trash"></i></button>';
    document.getElementById("my_cart_items").appendChild(myCartColumn);
    const tableRow =
        "<tr>" +
        "<td>" +
        data.product.name +
        "</td>" +
        "<td>" +
        cartItem.quantity +
        "</td>" +
        "<td> $" +
        totalCost +
        "</td>" +
        "<td>" +
        '<button class="btn btn-link text-danger text-right" onclick="removeCartItem(' +
        data.product.id +
        ')"><i class="fa fa-trash"></i></button>' +
        "</td>" +
        "</tr>";
    $("#my_cart_table tbody").append(tableRow);
}


function setTotalAmount(amount) {
    let totalAmount = $("#total_amount").val();
    totalAmount = parseFloat(totalAmount) + amount;
    $("#total_amount").val(totalAmount)
    return totalAmount;
}