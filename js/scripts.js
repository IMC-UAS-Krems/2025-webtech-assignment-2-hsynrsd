// functions to be added:
// addToCart(name, price) - adds an item object to the cart array - done
// goBackToGallery() - hides checkout form and shows gallery again - 
// handleFormSubmit(event) -  prevents default, validates form, shows confirmation - done
// proceedToCheckout()  - hides gallery, shows checkout form - done
// updateCartCount() - updates the red badge number - done
// updateModalContent() - updates the list inside the modal - done
// showConfirmation() - calculates totals and shows receipt - done
// updateCountryCode() - updates phone number input with selected country code - done

// Global variables - yeah i know this is bad practice but its a small project !
var cart = [];
var totalAmount = 0;

// Function to add items to the cart array
function addToCart(name, price) {
    // console.log("Adding " + name);
    
    // Create an object for the item
    var item = {
        name: name,
        price: price
    };
    
    cart.push(item);
    
    // Update the counter on the navbar
    updateCartCount();
    
    alert(name + " added to cart!");
}

// Update the red badge number
function updateCartCount() {
    var countElement = document.getElementById('cart-count');
    countElement.innerText = cart.length;
}

// This function runs when you open the modal
// Source: https://getbootstrap.com/docs/5.3/components/modal/#events
var myModalEl = document.getElementById('cartModal')
    myModalEl.addEventListener('show.bs.modal', function (event) {
        updateModalContent();
})

// Update the list inside the modal
function updateModalContent() {
    var listElement = document.getElementById('cart-list');
    var totalSpan = document.getElementById('modal-total');
    
    // clear the list first or it duplicates
    listElement.innerHTML = "";
    
    var currentTotal = 0;
    
    // Loop through cart array
    for (var i = 0; i < cart.length; i++) {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerText = cart[i].name + " - $" + cart[i].price;
        listElement.appendChild(li);
        
        currentTotal = currentTotal + cart[i].price;
    }
    
    totalSpan.innerText = currentTotal;
}

// Hide gallery, show form
function proceedToCheckout() {
    // Check if empty
    if (cart.length == 0) {
        alert("Cart is empty!");
        return; 
    }

    // Hide the modal manually
    // I had to google this because the modal wouldn't close
    var modalElement = document.getElementById('cartModal');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // Hide gallery
    document.getElementById('gallery-section').style.display = "none";
    
    // Show checkout
    document.getElementById('checkout-section').style.display = "block";
}

// Go back button
function goBackToGallery() {
    document.getElementById('checkout-section').style.display = "none";
    document.getElementById('gallery-section').style.display = "block";
}

// Validate and Submit
function handleFormSubmit(e) {
    e.preventDefault(); // Stop page refresh
    
    console.log("Validating form...");

    var phone = document.getElementById('phoneNumber').value;
    var zip = document.getElementById('zipCode').value;
    var isValid = true;

    // Validation 1: Phone numbers
    // OLD CODE: var phoneRegex = /^[0-9]+$/; in case it doesn't work I'll keep it here
    // NEW CODE: Allow numbers, plus sign, and spaces
    // Source: Modified from StackOverflow to allow + and space so it's properly formatted, not just digits!
    var phoneRegex = /^\+?[0-9\s]+$/;
    
    if (!phone.match(phoneRegex)) {
        document.getElementById('phone-error').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('phone-error').style.display = "none";
    }

    // Validation 2: Zip max 6 chars
    if (zip.length > 6) {
        document.getElementById('zip-error').style.display = "block";
        isValid = false;
    } 
    else {
        document.getElementById('zip-error').style.display = "none";
    }

    if (isValid) {
        showConfirmation();
    }
}

// Calculate final totals and show receipt
function showConfirmation() {   
    document.getElementById('receipt-list').innerHTML = ""; // if you go back and change something, clear old receipt first 
    document.getElementById('checkout-section').style.display = "none";
    document.getElementById('confirmation-section').style.display = "block";

    var list = document.getElementById('receipt-list');
    var subtotal = 0;

    // Fill receipt items
    for (var i = 0; i < cart.length; i++) {
        var li = document.createElement("li");
        li.classList.add("list-group-item");
        li.innerText = cart[i].name + " - $" + cart[i].price;
        list.appendChild(li);
        subtotal += cart[i].price;
    }

    // Calculate Tax (10%)
    var tax = subtotal * 0.10;

    // Calculate Discount (if 3 or more items)
    var discount = 0;
    if (cart.length >= 3) {
        // apply discount for 3+ items but professor didn't specify how much 
        // lets say the discount is the tax amount so its tax free for buying more
        // discount = tax;
        // Actually ill just do $10 off cause its simpler, it's an example after all :)
        discount = 10;
    }

    if (finalTotal < 0) finalTotal = 0;
    var finalTotal = subtotal + tax - discount;

    // Display numbers
    document.getElementById('final-subtotal').innerText = "$" + subtotal;
    document.getElementById('final-tax').innerText = "$" + tax.toFixed(2);
    document.getElementById('final-discount').innerText = "-$" + discount;
    document.getElementById('final-total').innerText = "$" + finalTotal.toFixed(2);
}

// Decided to add country code selector for phone number cause why not
function updateCountryCode() {
    var selectBox = document.getElementById("countrySelect");
    var input = document.getElementById("phoneNumber");
    
    // Just replace the whole value with the selected code
    // It's not perfect but it works for the assignment
    input.value = selectBox.value;
}
