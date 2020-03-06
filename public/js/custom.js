$(document).ready(() => {
    $("#my_cart_buttons").hide();
    $("#alert").hide();
    httpRequest("routes.php/products", displayProducts);
    getCartContent();
    localStorage.removeItem('transport_ype');
    getCurrentBalance()
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
            '<h5 class="card-title text-sm text-primary">' +
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
}

function getCartContent() {
    let cartButton = document.getElementById("cartDropdownMenuLink");
    const cartItems = getCartItems();
    cartButton.innerHTML = `<i class="fa fa-shopping-basket"></i> My Cart [${cartItems.length}]`;
    getMyCartProducts();
}

function addToCart(id) {
    const cartItems = getCartItems();
    const quantity = parseInt($(`#quantity_${id}`).val());
    const maxQuantity = parseInt($(`#quantity_${id}`).attr("max"));
    if (quantity > maxQuantity || quantity < 1) {
        alert(
            `Select a valid Qty, Min Qty=1 and Max-${maxQuantity}, Your quantity ${quantity}`
        );
    } else {
        const itemExistsIndex = cartItems.findIndex((item) => item.id == id);

        if (itemExistsIndex == -1 ) cartItems.push({ id, quantity })
        
        cartItems[itemExistsIndex] = { id, quantity };
        localStorage.setItem(
            "cart_items",
            JSON.stringify(cartItems)
        );

        getCartContent();
        $("input[name=transport_ype]").prop('checked', false);
        localStorage.removeItem('transport_ype');
    }
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
        $(`#quantity_${item.id}`).val(1);
        return item.id != id;
    });
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
    getCartContent();
    $("input[name=transport_ype]").prop('checked', false);
    localStorage.removeItem('transport_ype');
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
 * Reset Cart button content to Add Cart
 */
function resetAddToCartToButton() {
    const cartItems = getCartItems();
    cartItems.forEach(item => {
        $(`#quantity_${item.id}`).val(1);
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
    $("#total_amount").val(0);
    $("#my_cart_items").html("");
    $("#alert").hide();
    $("#my_cart_modal_content").show();
    $("#my_cart_table tbody").empty();
    $("#my_cart_buttons").show()
    if (cartItems.length === 0) {
        setAlertContent(
            "Your Cart is Empty",
            "alert-danger",
            "alert-success alert-warning"
        );
        $("#my_cart_modal_content").hide();
        $("#my_cart_buttons").hide()
    }

    cartItems.forEach(item => {
        $(`#quantity_${item.id}`).val(item.quantity);
        httpRequest(`routes.php/products/${item.id}`, setMyCartContent);
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
    const totalCost = parseFloat(
        cartItem.quantity * parseFloat(data.product.price)
    );
    setTotalAmount(totalCost);
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
    const tableRow = setTableRow(data.product, cartItem.quantity, totalCost);
    $("#my_cart_table tbody").append(tableRow);
}

/**
 * Set Table row content to display checkout items
 * @param {*} data 
 * @param {*} quantity 
 * @param {*} totalCost 
 */
function setTableRow(data, quantity, totalCost) {
    return (
        "<tr>" +
        "<td>" +
        data.name +
        "</td>" +
        "<td>" +
        quantity +
        "</td>" +
        "<td> $" +
        data.price +
        "</td>" +
        "<td> $" +
        parseFloat(totalCost).toFixed(2) +
        "</td>" +
        "<td class='text-center'>" +
        '<i class="fa fa-trash text-danger delete-icon" onclick="removeCartItem(' +
        data.id +
        ')"></i>' +
        "</td>" +
        "</tr>"
    );
}

/**
 * Set Total amount
 * @param {*} amount 
 */
function setTotalAmount(amount) {
    let totalAmount = $("#total_amount").val();
    totalAmount = parseFloat(totalAmount) + amount;
    $("#total_amount").val(totalAmount.toFixed(2));
    return totalAmount;
}

/**
 * Checkout to process order
 */
function checkout() {
    const transportType = $("input[name=transport_ype]:checked").val();
    if (transportType == undefined) {
        setAlertContent("Please pick a transport type", "alert-danger");
    } else {
        const deliveryFee = transportType == "pickUp" ? 0 : 5;

        const grandTotal = parseFloat(deliveryFee) + parseFloat($("#total_amount").val());

        if ( grandTotal > getCurrentBalance()) {
            setAlertContent(
                `Please buy within your Credit of $${getCurrentBalance()}`,
                "alert-danger",
                "alert-success alert-warning"
            );
        } else {
            setCurrentBalance(grandTotal);
            setAlertContent(
                "<i class='fa fa-thumbs-up'></i> Thank you for your purchase, Your order is being processed",
                "alert-success",
                "alert-danger alert-warning"
            );
            $("#my_cart_modal_content").hide();
            setTimeout(() => {
                clearCart();
            }, 5000)
        }
    }
}

/**
 * Set Alert content
 * @param {*} message 
 * @param {*} classesToAdd 
 * @param {*} classesToRemove 
 */
function setAlertContent(message, classesToAdd, classesToRemove = null) {
    $("#alert").show();
    $("#alert").html(message);
    $("#alert").addClass(classesToAdd);
    $("#alert").removeClass(classesToRemove);
    return;
}

/**
 * Add Delivery Fee
 */
function addDeliveryFee() {
    $("#alert").hide();
    const transportType = $("input[name=transport_ype]:checked").val();
    const checkStorage = localStorage.getItem('transport_ype');
    
    let deliveryFee = transportType == "UPS" ? 5 : 0;
    
    if (transportType == 'pickUp' && checkStorage == 'UPS')  deliveryFee = -5;

    localStorage.setItem('transport_ype', transportType)
    $("#total_amount").val(
        parseFloat(deliveryFee + parseFloat($("#total_amount").val())).toFixed(2)
    );
}

/**
 * Get current Balance from storage, else set it to $100
 */
function getCurrentBalance() {
    const storageBal = parseFloat(localStorage.getItem('current_balance') || '100');
    $("#current_balance").html(`Bal. $${storageBal.toFixed(2)}`);
    return storageBal;
}

/**
 * Set new current value and save to storage
 * @param {*} amount 
 */
function setCurrentBalance(amount) {
    const storageBal = parseFloat(getCurrentBalance() - parseFloat(amount));
    localStorage.setItem('current_balance', storageBal.toFixed(2));
    getCurrentBalance();
    return;
}
