// Cart Open Close
// Code first select cart icon, cart element and close cart icon using queryselector
// when the cart icon is clicked. It uses CSS classes to transition the cart between open and close states.

let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
// Open Cart

// when carticon is clicked, the onclick event triggers and cart element's class is modified to add class 'active. 
// The css class .cart.active, contains styles that transition cart from closed to open state
cartIcon.onclick = () => {
    cart.classList.add('active');
};
// Close Cart
// when close cart icon is clicked, the onclick event triggers and cart element's class is modified to remove class 'active. 
// The css class .cart.active, contains styles that transition cart from open to closed state, by hiding it

closeCart.onclick = () => {
    cart.classList.remove('active');
};

//Add to Cart (adding products to cart)
// code sets up event listener for "DOMContentLoaded" to call 'ready function once HTML content has loaded.


if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
}
else {
    ready();
}

// Inside the ready function, event listeners are added to elements with classes like cart-remove, cart-quantity, and add-cart
// ready function also uses functions below.

// Remove item from cart function
// when remove cart button (trash icon) is clicked, removeCartItem function is triggered
function ready() {
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i += 1) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }
    // Quantity Change (handles changes in quantity of items in cart)
    // when quantity input for an item in cart is changed, quantityChanged function is triggered
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i += 1) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
    //Add to Cart
    // When add to cart button/icon is clicked, the "addCartClicked" function is triggered.
    var addCart = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCart.length; i += 1) {
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);
    }
    loadCartItems();
}

// remove Cart Item
// This function removes the clicked item's parent element (product box) from the cart content.

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// Quantity Changed
// Updates total price, saves updated cart items to local storage and used to update cart icon quantity

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

//Add Cart function
// this function takes the product information(title, price and image) from the clicked button/icon parent element(product container)(in this case it is div,class: container)
//  and pass it to 'addProductToCart' function
// parent element tells the javascript code which product to add to the cart
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    addProductToCart(title, price, productImg); //passes it to here, the bracket items are what are passed into
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

// The AddProductToCart function creates a new cart item(product box) with product details and adds it to cart content.
// checks if product already exist in cart to prevent duplicates, by having an alert.
function addProductToCart(title, price, productImg) {
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for (var i = 0; i < cartItemsNames.length; i += 1) {
        if (cartItemsNames[i].innerText == title) {
            alert('You have already added that item to the cart');
            return;
        }
    }
    var cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price}</div>
        <input type="number" name="" id="" value="1" class="cart-quantity"/>
    </div>
    <!-- Remove Item -->
    <i class="bx bx-trash-alt cart-remove"></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change', quantityChanged);
    saveCartItems();
    updateCartIcon();
}

// Update Total Amount
// this function calculates total price of all items in cart by going through each cart box and multiplying the price with quantity for each item.
//it is then rounded to 2dp
function updatetotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i+= 1) { //iterates through each item
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace('$', ''));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    // total price displayed in html element with class 'total-price' and value saved to local storage using LocalStorage.setItem
    total = (Math.round(total * 100) / 100).toFixed(2) ;
    document.getElementsByClassName('total-price')[0].innerText = '$' + total;

    //save total to local storage
    localStorage.setItem('cartTotal', total);

}

// Keep Item in cart when page refreshes
// this function takes out product info (title,price,quantity and image) from each box, saves it to local storage as an array of objects using LocalStorage.setItem

function saveCartItems () {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];

    for (var i = 0; i < cartBoxes.length; i+= 1) {
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cart.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

//loads in cart
// this function retrieves saved cart items from local storage, recreates each cart box, sets quantity for each item and updates total price using stored value
function loadCartItems() {
    var cartItems = localStorage.getItem('cartItems')
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        for (var i = 0; i < cartItems.length; i+= 1) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.getElementsByClassName('total-price')[0].innerText = "$" + cartTotal;
    }
    updateCartIcon();
}

// Quantity in cart icon
// updating cart icon quantity
// this function calculates total quantity of items in cart by going through/iterating through each box and summing up the quantity values
// calculated quantity is set as 'data-quantity' attribute on the cart icon, which will be used to display the current quantity of items in the cart

function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for (var i = 0; i < cartBoxes.length; i+= 1) {
        var cartBox = cartBoxes[i];
        // looks for quantity for cartbox (product 0)
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    // changes the quantity at the cart icon
    var cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity', quantity);
}

