$(document).ready(() => {
    $("#my_cart_buttons").hide();
    $("#alert").hide();
    $("#ratings").hide();
    $("#finishRatingButton").hide();
    httpRequest("routes.php/products", displayProducts);
    getCartContent();
    removeDeliveryFee();
    getCurrentBalance();
});

/**
 * HANDLE ALL HTTP REQUESTS
 * @param {String} url url to fetch the API data
 * @param {*} cFunction callback function to handle the response data
 * @param {String} method Default set to GET options inclue POST, PUT, DELETE
 * @param {Array} data Request Data in case of POST, PUT
 */
function httpRequest(url, cFunction, method = "GET", data = null) {
    $("#spinner").html(
        "<i class='fa fa-circle-o-notch fa-spin text-warning'></i>"
    );
    let xHttp = new XMLHttpRequest();
    xHttp.open(method, url, true);
    if (method == "POST")
        xHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xHttp.send(JSON.stringify(data));
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
 * Dispaly all product
 *
 * @param {Object} products Get products and display on the html products div
 *
 */
function displayProducts(products) {
    let productsColumn = document.getElementById("products");
    let productFragment = new DocumentFragment();

    products.forEach(product => {
        const rating = product.average_rating == null ? 0 : product.average_rating;
        let productColumn = document.createElement("div");
        productColumn.classList.add("col-md-3");
        product.average_rating = rating;
        productColumn.innerHTML = productHTMLContent(product);
        productFragment.appendChild(productColumn);
    });
    productsColumn.appendChild(productFragment);
}

/**
 * Set Product HTML content
 *
 * @param {Object} product Product Object
 *
 * @return {String} Html content
 */
function productHTMLContent(product) {
    return (
        '<div class="card">' +
        '<img src="' +
        product.image +
        '" class="card-img-top" alt="' +
        product.name +
        '" id="product_image_' +
        product.id +
        '" />' +
        '<div class="card-body">' +
        '<h5 class="card-title text-sm text-primary">' +
        '<span id="product_name_' +
        +product.id +
        '">' +
        product.name +
        '</span> $ <span id="product_price_' +
        product.id +
        '">' +
        product.price +
        "</span></h5>" +
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
        '<input type="hidden" value="' +
        product.ratings +
        '" id="product_ratings_' +
        product.id +
        '" />' +
        '<i class="fa fa-star"></i> <span id="product_rating_' +
        product.id +
        '">' +
        parseFloat(product.average_rating).toFixed(1) +
        "</span></button>" +
        '<div class="py-2" id="rating_' +
        product.id +
        '"> ' +
        "</div>" +
        "</div>" +
        "</div>"
    );
}

/**
 * Get Cart Contents
 */
function getCartContent() {
    let cartButton = document.getElementById("cartDropdownMenuLink");
    const cartItems = getCartItems();
    cartButton.innerHTML = `<i class="fa fa-shopping-basket"></i> My Cart [${cartItems.length}]`;
    getMyCartProducts();
}

/**
 * Add product to cart
 *
 * @param {*} productId
 */
function addToCart(productId, newQuantity = null, cartId = null) {
    const productQuantity = newQuantity
        ? newQuantity
        : parseInt($(`#quantity_${productId}`).val());
    const productName = $(`#product_name_${productId}`).html();
    const productImage = $(`#product_image_${productId}`).attr("src");
    const productPrice = $(`#product_price_${productId}`).html();
    const productRating = $(`#product_rating_${productId}`).html();

    const maxQuantity = parseInt($(`#quantity_${productId}`).attr("max"));
    if (productQuantity > maxQuantity || productQuantity < 1) {
        alert(
            `Enter a Valid Qty, Min Qty: 1 - Max: ${maxQuantity}, Your Quantity: ${productQuantity}`
        );
    } else {
        let cartItems = getCartItems();

        if (cartId) {
            const itemExistsIndex = cartItems.findIndex(item => item.id == cartId);
            cartItems[itemExistsIndex].quantity = productQuantity;
        } else {
            cartItems.push({
                id: cartItems.length + 1,
                product_id: productId,
                quantity: productQuantity,
                name: productName,
                image: productImage,
                rating: productRating,
                price: productPrice,
                quantity_available: maxQuantity
            });
        }
        localStorage.setItem("cart_items", JSON.stringify(cartItems));
        getCartContent();
        removeDeliveryFee();
    }
    $("#checkoutButton").show();
}

/**
 * clear cart items in storage
 */
function clearCart() {
    resetAddToCartToButton();
    localStorage.setItem("cart_items", JSON.stringify([]));
    $("#finishRatingButton").show();
    $("#checkoutButton").show();
    if (getCartItems().length < 1) {
        $("#checkoutButton").hide();
        $("#finishRatingButton").hide();
    }
    getCartContent();
}

/**
 * Remove particular item from cart
 *
 * @param {*} cartId cart Item ID
 */
function removeCartItem(cartId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => {
        $(`#quantity_${item.id}`).val(1);
        return item.id != cartId;
    });
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
    getCartContent();
    removeDeliveryFee();
}

/**
 * Check if item exists in cart
 *
 * @param {*} productId
 *
 * @return {Boolean}
 */
function checkItemInCart(productId) {
    const cartItems = getCartItems();
    const exists = cartItems.findIndex(item => item.product_id == productId);
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
        $(`#quantity_${item.product_id}`).val(1);
        const button = $(`#add_to_cart_button_${item.product_id}`);
        button.html('<i class="fa fa-cart-plus"></i> ');
        button.removeClass("btn-warning");
        button.addClass("btn-primary");
        button.attr("onclick", `addToCart(${item.product_id})`);
    });
}

/**
 * Get Current Cart Items in sorted array
 *
 * @return {Array} sortedCartItems
 */
function getCartItems() {
    let cartItems = JSON.parse(localStorage.getItem("cart_items")) || [];
    let sortedCartItems = [];
    let groupedCartItems = arrayCartItems(cartItems);
    Object.keys(groupedCartItems).forEach(key => {
        Array.prototype.push.apply(sortedCartItems, groupedCartItems[key]);
    });

    return sortedCartItems;
}

/**
 * Reduce cart Items data to objects
 * @param {Array} arrayData
 */
function arrayCartItems(cartItems) {
    return cartItems.reduce((items, item) => {
        const value = item["name"];
        items[value] = (items[value] || []).concat(item);
        return items;
    }, {});
}

/**
 * Get Cart Items
 * @param {*} cartID cartID
 * @return {Object} cartItem
 */
function getCartItem(cartID) {
    const cartItems = getCartItems();
    return cartItems.find(item => item.id == cartID);
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
    $("#my_cart_buttons").show();
    $("#ratings").empty();
    if (cartItems.length === 0) {
        setAlertContent(
            "Your Cart is Empty",
            "alert-danger",
            "alert-success alert-warning"
        );
        $("#my_cart_modal_content").hide();
        $("#my_cart_buttons").hide();
    }

    cartItems.forEach(item => {
        setMyCartContent(item);
    });
    setRatings();
}

/**
 * This is a callback function to handle data from http Request
 * Get the http response and display on dropdown and modal
 * @param {Object} product
 */
function setMyCartContent(product) {
    const myCartColumn = document.createElement("li");
    const totalCost = parseFloat(product.quantity * parseFloat(product.price));
    setTotalAmount(totalCost);
    myCartColumn.classList.add("text-sm");
    myCartColumn.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center",
        "rounded-0",
        "py-2"
    );
    myCartColumn.innerHTML =
        product.name +
        " [" +
        product.quantity +
        "]" +
        '<button class="btn btn-link text-danger text-right" onclick="removeCartItem(' +
        product.id +
        ')"><i class="fa fa-trash"></i></button>';
    document.getElementById("my_cart_items").appendChild(myCartColumn);
    const tableRow = setTableRow(product, product.quantity, totalCost);
    $("#my_cart_table tbody").append(tableRow);
}

/**
 * Set Table row content to display checkout items
 * @param {Object} data
 * @param {Int} quantity
 * @param {Float} totalCost
 */
function setTableRow(data, quantity, totalCost) {
    return (
        '<tr class="text-sm">' +
        '<td><img src="' +
        data.image +
        '" alt="product image" class="" height="20" width="20" /></td>' +
        "<td>" +
        data.name +
        "</td>" +
        "<td>" +
        '<input type="number" min="1" max="' +
        data.quantity_available +
        '" class="form-control form-control-sm rounded-0" id="change_quantity_' +
        data.id +
        '" value="' +
        quantity +
        '" onchange="updateQuantity(' +
        data.product_id +
        ", " +
        data.price +
        ", " +
        data.id +
        ')" />' +
        "</td>" +
        "<td> $" +
        data.price +
        "</td>" +
        '<td> $ <span id="total_cost_' +
        data.product_id +
        '">' +
        parseFloat(totalCost).toFixed(2) +
        "</span></td>" +
        '<td class="text-center">' +
        '<i class="fa fa-trash text-danger delete-icon" onclick="removeCartItem(' +
        data.id +
        ')"></i>' +
        "</td>" +
        "</tr>"
    );
}

/**
 * Set Total amount
 * @param {Float} amount
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
        const grandTotal = parseFloat($("#total_amount").val());
        if (grandTotal > getCurrentBalance()) {
            setAlertContent(
                `Please buy within your Credit of $${getCurrentBalance()}`,
                "alert-danger",
                "alert-success alert-warning"
            );
        } else {
            setCurrentBalance(grandTotal);
            setAlertContent(
                "<i class='fa fa-thumbs-up'></i> " +
                "Thank you for your purchase, Your order is being processed. Please finish by rating our products",
                "alert-success",
                "alert-danger alert-warning"
            );
            $("#my_cart_modal_content").hide();
            $("#checkoutButton").hide();
            $("#ratings").show();
            $("#finishRatingButton").show();
        }
    }
}

/**
 * Set Alert content
 * @param {String} message
 * @param {String} classesToAdd
 * @param {String} classesToRemove
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
    const checkStorage = localStorage.getItem("transport_ype");

    let deliveryFee = transportType == "UPS" ? 5 : 0;

    if (transportType == "pickUp" && checkStorage == "UPS") deliveryFee = -5;

    localStorage.setItem("transport_ype", transportType);
    $("#total_amount").val(
        parseFloat(deliveryFee + parseFloat($("#total_amount").val())).toFixed(2)
    );
}

/**
 * Get current Balance from storage, else set it to $100
 *
 * @return {Float} storageBal
 */
function getCurrentBalance() {
    const storageBal = parseFloat(
        localStorage.getItem("current_balance") || "100"
    );
    $("#current_balance").html(`Bal. $${storageBal.toFixed(2)}`);
    return storageBal;
}

/**
 * Set new current value and save to storage
 * @param {Float} amount
 */
function setCurrentBalance(amount) {
    const storageBal = parseFloat(getCurrentBalance() - parseFloat(amount));
    localStorage.setItem("current_balance", storageBal.toFixed(2));
    getCurrentBalance();
    return;
}

/**
 * Show range values
 *
 * @param {*} productId
 */
function getRange(productId) {
    $(`#show_rating_${productId}`).html($(`#range_${productId}`).val());
}

/**
 * Set Ratings for Unique set of products
 *
 */
function setRatings() {
    const cartItems = getCartItems();
    const groupedCartItems = arrayCartItems(cartItems);
    $("#ratings").empty();
    Object.keys(groupedCartItems).map(key => {
        const ratingsDiv = document.createElement("div");
        ratingsDiv.classList.add("my-2");
        ratingsDiv.innerHTML =
            '<label for="range_' +
            groupedCartItems[key][0].product_id +
            '">Rate ' +
            groupedCartItems[key][0].name +
            ' <span id="show_rating_' +
            groupedCartItems[key][0].product_id +
            '">1</span> </label>' +
            '<input type="range" value="1" name="' +
            groupedCartItems[key][0].product_id +
            '" class="custom-range" min="0" max="5" onclick="getRange(' +
            groupedCartItems[key][0].product_id +
            ')" id="range_' +
            groupedCartItems[key][0].product_id +
            '"></input>';
        $("#ratings").append(ratingsDiv);
    });
}

/**
 * Rate items
 */
function rateItems() {
    $("#finishRatingButton").hide();
    const productRatings = [];
    $("#ratings :input").each(function (e) {
        productRatings.push({
            product_id: this.name,
            rating: this.value
        });
        console.log('product function call', this.name, this.value);
        setNewAverageRatings(this.name, this.value);
    });
    httpRequest(
        `routes.php/ratings/`,
        handleSubmitRatings,
        "POST",
        productRatings
    );
}

/**
 * Handle Ratings HTTP response
 * @param {*} data
 */
function handleSubmitRatings(data) {
    setAlertContent(
        "Thank you for rating our products",
        "alert-success",
        "alert-danger alert-warning"
    );
    $("#ratings").hide();
    setTimeout(() => {
        clearCart();
    }, 5000);
}

/**
 * UPDATE my cart quantity and set new Total Cost
 * @param {*} productId product id
 * @param {float} unitCost
 */
function updateQuantity(productId, unitCost, cartId) {
    const newQuantity = $(`#change_quantity_${cartId}`).val();
    const newTotalCost = parseFloat(unitCost * newQuantity);
    $(`#total_cost_${productId}`).html(newTotalCost.toFixed(2));
    addToCart(productId, newQuantity, cartId);
}

/**
 * Set New Average rating
 * @param {*} productId Product Id
 * @param {String} rating Rating value for the product
 */
function setNewAverageRatings(productId, rating) {
    let oldRatings = $(`#product_ratings_${productId}`).val();
    let newAverage = parseFloat(0);
    if (oldRatings === "null") {
        newAverage = parseFloat(rating);
        $(`#product_ratings_${productId}`).val(rating);
    } else {
        oldRatings = oldRatings.split(",").map(rating => {
            return parseInt(rating);
        });
        const sum = oldRatings.reduce((a, b) => {
            return a + b;
        }, 0);
        rating = parseInt(rating);
        newAverage = parseFloat((sum + rating) / (oldRatings.length + 1));
    }
    $(`#product_rating_${productId}`).html(newAverage.toFixed(1));
}

/**
 * Remove Delivery Fee and reset the radio buttons
 */
function removeDeliveryFee() {
    $("input[name=transport_ype]").prop("checked", false);
    localStorage.removeItem("transport_ype");
}
