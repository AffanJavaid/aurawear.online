document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotalElement = document.querySelector(".cart-total");
    const placeOrderButton = document.getElementById("place-order");
    const orderFormModal = new bootstrap.Modal(document.getElementById("orderFormModal"));
    const orderForm = document.getElementById("orderForm");

    let cart = [];

    // Add to cart functionality
    document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const size = button.closest(".card-body").querySelector(".size-btn.active").getAttribute("data-size"); // Get selected size

            const existingItem = cart.find((item) => item.name === name && item.size === size);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, size, quantity: 1 });
            }

            updateCart();
        });
    });

    document.querySelectorAll('.size-btn').forEach(button => {
        button.addEventListener('click', function () {
            const allButtons = button.closest(".size-select").querySelectorAll('.size-btn');
            allButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    

    // Update cart display
    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;

            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
                <p>${item.name} (${item.size}) - Rs ${item.price} x ${item.quantity}</p>
                <button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalElement.textContent = total.toFixed(2);

        // Enable/disable the Place Order button
        placeOrderButton.disabled = cart.length === 0;

        // Remove item functionality
        document.querySelectorAll(".remove-item").forEach((button) => {
            button.addEventListener("click", () => {
                const index = button.getAttribute("data-index");
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Open order form modal
    placeOrderButton.addEventListener("click", () => {
        document.getElementById("orderId").value = `ORD-${Date.now()}`;
        document.getElementById("orderTotal").value = `Rs ${cartTotalElement.textContent}`;
        orderFormModal.show();
    });


orderForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const orderId = document.getElementById("orderId").value;
    const total = parseFloat(cartTotalElement.textContent);
    const items = cart;

    const orderDetails = `Order Details:
Order ID: ${orderId}
Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}
Total: Rs ${total}
Items:
${items.map(item => `${item.name} (${item.size}) - Rs ${item.price} x ${item.quantity}`).join("\n")}
    `;

    // Detect if the user is on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Open WhatsApp
        const whatsappNumber = "923374993772"; // Include country code without "+"
        const whatsappMessage = encodeURIComponent(orderDetails);
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank");
    } else {
        // Open email client
        const emailRecipient = "affanraog11@gmail.com";
        const emailSubject = encodeURIComponent(`New Order - ${orderId}`);
        const emailBody = encodeURIComponent(orderDetails);
        window.open(`mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`, "_blank");
    }

    // Clear cart and update display
    cart = [];
    updateCart();

    // Optionally show confirmation message
    alert("Your order details have been prepared. Please review and send!");
});




});
