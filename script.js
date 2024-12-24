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
            const size = button.closest(".card-body").querySelector(".size-select").value; // Get selected size

            const existingItem = cart.find((item) => item.name === name && item.size === size);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, size, quantity: 1 });
            }

            updateCart();
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

    // Handle order form submission
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const address = document.getElementById("address").value;
        const orderId = document.getElementById("orderId").value;
        const total = parseFloat(cartTotalElement.textContent);
        const items = cart;

        const orderData = { order_id: orderId, name, email, phone, address, total_price: total, items };

        // Send data to backend
        fetch("https://aurawear-backend.onrender.com/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(`Order placed successfully! Order ID: ${data.orderId}`);
                orderFormModal.hide();
                cart = [];
                updateCart();
            })
            .catch((error) => {
                alert("Error placing order. Please try again.");
                console.error(error);
            });
    });
});
