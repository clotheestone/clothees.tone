const products = [
    { id: 1, name: "Pantalon Adidas Rompeviento", price: 950, category: "pantalones", imgs: ["imagenes/rompevientoscolor.jpg"] },
    { id: 8, name: "Buzo Sol", price: 790, category: "buzos", imgs: ["imagenes/buzoSol.jpg", "imagenes/buzoSolMarron.jpg", "imagenes/buzoSolRosa.jpg"] },
    { id: 9, name: "Sueter tejido", price: 750, category: "buzos", imgs: ["imagenes/variedadDeBuzos.jpg", "imagenes/buzoTejidoAzul.jpg"] },
    { id: 10, name: "Buzo BLS", price: 990, category: "buzos", imgs: ["imagenes/buzoBls.png", "imagenes/buzoBlsColor.png"] },
    { id: 11, name: "Buzo Rayado", price: 890, category: "buzos", imgs: ["imagenes/buzoConLineas.jpg"] },
    { id: 12, name: "Buzo Chomba", price: 890, category: "buzos", imgs: ["imagenes/buzosChomba.jpg", "imagenes/buzoChombaMarron.jpg"] },
    { id: 13, name: "Buzo en V", price: 890, category: "buzos", imgs: ["imagenes/buzoVyRayas.jpg", "imagenes/buzoVyRayasCeleste.jpg"] },
    { id: 14, name: "Buzo Zip Hoodie", price: 890, category: "buzos", imgs: ["imagenes/buzosCierre.jpg", "imagenes/buzoMarronCierre.jpg"] },
    { id: 15, name: "Conjunto Elisa", price: 950, category: "vestidos", imgs: ["imagenes/vestidoMariposaByN.jpg", "imagenes/vestidoMariposa.jpg"] },
    { id: 16, name: "Vestido Saten", price: 490, category: "vestidos", imgs: ["imagenes/vestidoNegro.jpg", "imagenes/vestidoNegroSaten.jpg"] },
    { id: 22, name: "Air Force 1", price: 1500, category: "calzado", imgs: ["imagenes/airForceuno.png"] },
    { id: 23, name: "Adidas Campus", price: 1500, category: "calzado", imgs: ["imagenes/campus.png"] },
    { id: 24, name: "Puma Deportivo", price: 1500, category: "calzado", imgs: ["imagenes/pumaRosa.png"] },
    { id: 25, name: "New Balance Deportivos", price: 1500, category: "calzado", imgs: ["imagenes/nbDeportivo.jpg"] },
    { id: 26, name: "New Balance con Plataforma", price: 1500, category: "calzado", imgs: ["imagenes/nbPlataformanegra.png"] },
    { id: 28, name: "Bikini Fita", price: 390, category: "bikinis", imgs: ["imagenes/bikiniButterAmarillo.jpg", "imagenes/bikiniNegro.jpg", "imagenes/bikiniRojo.jpg"] },
    { id: 29, name: "Bikini Brasil", price: 390, category: "bikinis", imgs: ["imagenes/bikiniVerde.jpg", "imagenes/bikiniAmarillo.jpg"] },
    { id: 30, name: "Bikini Animal Print", price: 390, category: "bikinis", imgs: ["imagenes/bikiniPrint.jpg"] },
    { id: 43, name: "Body Estilo Polo", price: 390, category: "bodys", imgs: ["imagenes/bodyVClarito.jpg", "imagenes/bodyVNegro.jpg"] },
    { id: 44, name: "Body Asimetrico", price: 390, category: "bodys", imgs: ["imagenes/bodyAsimetricoMarron.jpg", "imagenes/bodyAsimetricoNegro.jpg", "imagenes/bodyAsimetricoRojo.jpg"] },
];

let cart = [];
const container = document.getElementById('products-container');

function displayProducts(filter = "todos") {
    container.innerHTML = "";
    const filtered = filter === "todos" ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        let imgsHTML = p.imgs.map((src, i) => `<img src="${src}" class="slider-img ${i===0?'active':''}">`).join('');
        let controls = p.imgs.length > 1 ? `<button class="prev" onclick="changeImg(${p.id},-1)">&#10094;</button><button class="next" onclick="changeImg(${p.id},1)">&#10095;</button>` : "";

        card.innerHTML = `
            <div class="slider-container" id="slider-${p.id}">${imgsHTML}${controls}</div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="product-price">$${p.price}</p>
                <button class="btn-add" onclick="addToCart(${p.id})">Agregar</button>
            </div>`;
        container.appendChild(card);
    });
}

// Lógica de Filtrado
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.onclick = () => {
        // Quitar clase activa de todos y ponerla al actual
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        displayProducts(category);
    };
});

function changeImg(id, step) {
    const slider = document.getElementById(`slider-${id}`);
    const imgs = slider.querySelectorAll('.slider-img');
    let activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
    imgs[activeIdx].classList.remove('active');
    activeIdx = (activeIdx + step + imgs.length) % imgs.length;
    imgs[activeIdx].classList.add('active');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const inCart = cart.find(i => i.id === id);
    if (inCart) inCart.qty++; else cart.push({...product, qty: 1});
    updateCartUI();
    document.getElementById("cart-modal").classList.add('open');
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.reduce((acc, i) => acc + i.qty, 0);
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.imgs[0]}" class="cart-img">
                <div class="cart-item-info">
                    <p>${item.name}</p>
                    <b>$${item.price}</b>
                    <div class="cart-item-actions">
                        <input type="number" min="1" value="${item.qty}" onchange="changeQty(${item.id},this.value)">
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">X</button>
                    </div>
                </div>
            </div>`;
    });
    document.getElementById('total-price').innerText = total.toLocaleString('es-UY');
}

function changeQty(id, qty) {
    const item = cart.find(i => i.id === id);
    if (item && qty > 0) { item.qty = parseInt(qty); updateCartUI(); }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

document.getElementById('checkout-btn').onclick = () => {
    if(cart.length === 0) return alert("Tu carrito está vacío");
    let msg = "Hola Clothees.Tone! Quiero:\n";
    cart.forEach(i => msg += `- ${i.name} (x${i.qty})\n`);
    msg += `Total: $${document.getElementById('total-price').innerText}`;
    window.open(`https://wa.me/59892931533?text=${encodeURIComponent(msg)}`);
};

document.getElementById("cart-toggle").onclick = () => document.getElementById("cart-modal").classList.add('open');
document.querySelector(".close-cart").onclick = () => document.getElementById("cart-modal").classList.remove('open');

const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

menuToggle.onclick = () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
    }
};

// Cerrar menú al elegir categoría
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.replace('fa-xmark', 'fa-bars');
    });
});

displayProducts();
