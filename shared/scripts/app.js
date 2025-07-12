// Menu Data
const menuData = [
    // Rice dishes
    { id: 1, name: "ข้าวผัดกุ้ง", category: "rice", price: 50, emoji: "🍤", description: "ข้าวผัดกุ้งสด หอมกระเทียม พริกไทย", hot: true },
    { id: 2, name: "ข้าวผัดหมู", category: "rice", price: 45, emoji: "🥓", description: "ข้าวผัดหมูนุ่ม ใส่ไข่ดาว อร่อยมาก", popular: true },
    { id: 3, name: "ข้าวผัดไก่", category: "rice", price: 45, emoji: "🍗", description: "ข้าวผัดไก่ หอมพริกไทย กลมกล่อม" },
    { id: 4, name: "ข้าวผัดปู", category: "rice", price: 55, emoji: "🦀", description: "ข้าวผัดปู เนื้อปูแน่นๆ หอมมัน", recommended: true },
    { id: 5, name: "ข้าวผัดผัก", category: "rice", price: 40, emoji: "🥦", description: "ข้าวผัดผักรวม สำหรับมังสวิรัติ สุขภาพดี" },
    
    // Noodle dishes
    { id: 6, name: "ผัดไทยกุ้งสด", category: "noodle", price: 45, emoji: "🍜", description: "ผัดไทยกุ้งสด รสชาติต้นตำรับ" },
    { id: 7, name: "ผัดซีอิ๊วหมู", category: "noodle", price: 40, emoji: "🍝", description: "เส้นใหญ่ผัดซีอิ๊ว หมูนุ่ม" },
    { id: 8, name: "ราดหน้าหมู", category: "noodle", price: 45, emoji: "🍲", description: "ราดหน้าเส้นใหญ่ น้ำข้นกำลังดี" },
    { id: 9, name: "บะหมี่แห้ง", category: "noodle", price: 35, emoji: "🥟", description: "บะหมี่แห้งหมูแดง กรอบนอกนุ่มใน" },
    { id: 10, name: "ก๋วยเตี๋ยวต้มยำ", category: "noodle", price: 40, emoji: "🌶️", description: "ต้มยำน้ำข้น รสจัดจ้าน" },
    
    // Side dishes
    { id: 11, name: "ไก่ทอดกระเทียม", category: "sidedish", price: 50, emoji: "🍗", description: "ไก่ทอดกรอบ หอมกระเทียม" },
    { id: 12, name: "หมูกรอบคั่วพริกเกลือ", category: "sidedish", price: 55, emoji: "🥓", description: "หมูกรอบ คั่วพริกเกลือ" },
    { id: 13, name: "ผัดกะเพราหมูสับ", category: "sidedish", price: 45, emoji: "🌿", description: "กะเพราหมูสับ ใบกะเพราหอม" },
    { id: 14, name: "ต้มยำกุ้ง", category: "sidedish", price: 60, emoji: "🦐", description: "ต้มยำกุ้งน้ำข้น รสชาติจัดจ้าน" },
    { id: 15, name: "ยำวุ้นเส้น", category: "sidedish", price: 35, emoji: "🥗", description: "ยำวุ้นเส้น รสชาติกลมกล่อม" },
    
    // Drinks
    { id: 16, name: "ชาเย็น", category: "drink", price: 25, emoji: "🧋", description: "ชาเย็นหวานมัน" },
    { id: 17, name: "กาแฟเย็น", category: "drink", price: 25, emoji: "☕", description: "กาแฟเย็นหอมมัน" },
    { id: 18, name: "น้ำส้ม", category: "drink", price: 20, emoji: "🍊", description: "น้ำส้มคั้นสด" },
    { id: 19, name: "โค้ก", category: "drink", price: 15, emoji: "🥤", description: "โค้กเย็นๆ" },
    { id: 20, name: "น้ำเปล่า", category: "drink", price: 10, emoji: "💧", description: "น้ำเปล่าเย็น" }
];

// Global variables
let cart = [];
let currentCategory = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupEventListeners();
    updateCartUI();
});

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchMenu(e.target.value);
    });
}

// Load menu items
function loadMenu() {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';
    
    const filteredMenu = currentCategory === 'all' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);
    
    filteredMenu.forEach(item => {
        const menuItemEl = createMenuItemElement(item);
        menuContainer.appendChild(menuItemEl);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.onclick = () => showItemDetail(item);
    
    const badges = [];
    if (item.popular) badges.push('<span class="badge badge-popular">ยอดนิยม</span>');
    if (item.recommended) badges.push('<span class="badge badge-recommended">แนะนำ</span>');
    if (item.hot) badges.push('<span class="badge badge-hot">🌶️ เผ็ด</span>');
    
    div.innerHTML = `
        <div class="menu-item-image">
            ${item.emoji}
            ${badges.length > 0 ? `<div class="badges">${badges.join('')}</div>` : ''}
        </div>
        <div class="menu-item-info">
            <h3 class="menu-item-name">${item.name}</h3>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-footer">
                <span class="menu-item-price">฿${item.price}</span>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${item.id})">
                    <i class="fas fa-plus"></i> เพิ่ม
                </button>
            </div>
        </div>
    `;
    
    return div;
}

// Filter by category
function filterCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    loadMenu();
}

// Search menu
function searchMenu(query) {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';
    
    const filtered = menuData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    
    filtered.forEach(item => {
        const menuItemEl = createMenuItemElement(item);
        menuContainer.appendChild(menuItemEl);
    });
}

// Add to cart
function addToCart(itemId) {
    const item = menuData.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCartUI();
    showNotification('เพิ่มสินค้าในตะกร้าแล้ว');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">ยังไม่มีสินค้าในตะกร้า</p>';
        cartTotal.textContent = '฿0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">฿${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `฿${total}`;
}

// Update quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }
    
    updateCartUI();
}

// Toggle cart
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
}

// Show item detail
function showItemDetail(item) {
    const modal = document.getElementById('itemModal');
    const itemDetail = document.getElementById('itemDetail');
    
    itemDetail.innerHTML = `
        <div class="item-detail-image">${item.emoji}</div>
        <div class="item-detail-info">
            <h2>${item.name}</h2>
            <p class="item-detail-description">${item.description}</p>
            <div class="item-detail-price">฿${item.price}</div>
            <div class="quantity-selector">
                <button onclick="updateDetailQuantity(-1)">-</button>
                <span class="quantity-display" id="detailQuantity">1</span>
                <button onclick="updateDetailQuantity(1)">+</button>
            </div>
            <button class="checkout-btn" onclick="addDetailToCart(${item.id})">
                <i class="fas fa-cart-plus"></i> เพิ่มในตะกร้า
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    window.currentDetailQuantity = 1;
}

// Update detail quantity
function updateDetailQuantity(change) {
    window.currentDetailQuantity = Math.max(1, window.currentDetailQuantity + change);
    document.getElementById('detailQuantity').textContent = window.currentDetailQuantity;
}

// Add from detail to cart
function addDetailToCart(itemId) {
    const item = menuData.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += window.currentDetailQuantity;
    } else {
        cart.push({ ...item, quantity: window.currentDetailQuantity });
    }
    
    updateCartUI();
    closeItemModal();
    showNotification('เพิ่มสินค้าในตะกร้าแล้ว');
}

// Close item modal
function closeItemModal() {
    document.getElementById('itemModal').classList.remove('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('กรุณาเลือกสินค้าก่อนสั่งซื้อ');
        return;
    }
    
    document.getElementById('orderModal').classList.add('active');
    toggleCart();
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Submit order
function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            dorm: formData.get('dorm'),
            room: formData.get('room'),
            note: formData.get('note')
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString()
    };
    
    // Here you would normally send to backend
    console.log('Order submitted:', orderData);
    
    // Generate LINE message
    const lineMessage = generateLineMessage(orderData);
    
    // Clear cart and close modal
    cart = [];
    updateCartUI();
    closeOrderModal();
    
    // Show success message
    showNotification('ส่งคำสั่งซื้อเรียบร้อยแล้ว! รอรับอาหาร 15-20 นาที');
    
    // In real app, would redirect to LINE or send notification
    alert(`คำสั่งซื้อของคุณ:\n${lineMessage}`);
}

// Generate LINE message
function generateLineMessage(orderData) {
    const itemsList = orderData.items.map(item => 
        `- ${item.name} x${item.quantity} = ฿${item.price * item.quantity}`
    ).join('\n');
    
    return `🍴 คำสั่งซื้อใหม่ 🍴
    
ชื่อ: ${orderData.customer.name}
โทร: ${orderData.customer.phone}
หอ: ${orderData.customer.dorm}
ห้อง: ${orderData.customer.room}

รายการอาหาร:
${itemsList}

รวม: ฿${orderData.total}

หมายเหตุ: ${orderData.customer.note || '-'}`;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gradient);
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}