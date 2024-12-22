
import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Form submission handler
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const orderDetails = document.getElementById('orderDetails').value;

    // Save order to Firebase
    push(ref(database, 'orders/'), {
        name,
        phone,
        email,
        address,
        orderDetails,
        timestamp: new Date().toISOString(),
    })
    .then(() => {
        alert('Order placed successfully!');
        document.getElementById('orderForm').reset();
    })
    .catch((error) => {
        console.error('Failed to save order:', error);
    });
});

const buttons = document.querySelectorAll('.order-btn');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        document.getElementById('orderDetails').value = button.getAttribute('data-details');
        window.scrollTo({ top: document.querySelector('.order-form-section').offsetTop, behavior: 'smooth' });
    });
});


export const firebaseConfig = {
    apiKey: "AIzaSyCiD04lJaZD3AksQHuIp2k4nKtQ6Cc7uvE",
    authDomain: "aurawear-fd655.firebaseapp.com",
    projectId: "aurawear-fd655",
    storageBucket: "aurawear-fd655.appspot.com",
    messagingSenderId: "875349961194",
    appId: "1:875349961194:web:386848954b254259422a93",
    measurementId: "G-5ESSGT9PF1"
};
