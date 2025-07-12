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
        ${badges.length > 0 ? `<div class="badges">${badges.join('')}</div>` : ''}
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
        orderId: generateOrderId(),
        customer: {
            name: formData.get('name'),
            phone: formData.get('phone'),
            dorm: formData.get('dorm'),
            room: formData.get('room'),
            note: formData.get('note')
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date()
    };
    
    // Store order data temporarily
    window.currentOrder = orderData;
    
    // Close order modal and show summary
    closeOrderModal();
    showOrderSummary(orderData);
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

// Generate order ID
function generateOrderId() {
    return 'ORD' + Date.now().toString().slice(-6);
}

// Show order summary
function showOrderSummary(orderData) {
    const modal = document.getElementById('orderSummaryModal');
    const content = document.getElementById('orderSummaryContent');
    
    const itemsList = orderData.items.map(item => `
        <div class="summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>฿${item.price * item.quantity}</span>
        </div>
    `).join('');
    
    content.innerHTML = `
        <div class="order-success">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>สั่งอาหารสำเร็จ!</h3>
            <p class="order-id">หมายเลขคำสั่งซื้อ: ${orderData.orderId}</p>
        </div>
        
        <div class="order-details">
            <h4>รายละเอียดคำสั่งซื้อ</h4>
            <div class="summary-items">
                ${itemsList}
                <div class="summary-total">
                    <strong>รวมทั้งหมด</strong>
                    <strong>฿${orderData.total}</strong>
                </div>
            </div>
            
            <div class="delivery-info">
                <h4>ข้อมูลจัดส่ง</h4>
                <p><i class="fas fa-user"></i> ${orderData.customer.name}</p>
                <p><i class="fas fa-phone"></i> ${orderData.customer.phone}</p>
                <p><i class="fas fa-home"></i> ${orderData.customer.dorm} ห้อง ${orderData.customer.room}</p>
                ${orderData.customer.note ? `<p><i class="fas fa-sticky-note"></i> ${orderData.customer.note}</p>` : ''}
            </div>
        </div>
        
        <div class="payment-section">
            <h4>ชำระเงิน</h4>
            <div class="payment-methods">
                <div class="payment-method active" onclick="selectPaymentMethod('promptpay')">
                    <i class="fas fa-qrcode"></i>
                    <span>พร้อมเพย์</span>
                </div>
                <div class="payment-method" onclick="selectPaymentMethod('cash')">
                    <i class="fas fa-money-bill-wave"></i>
                    <span>เงินสด</span>
                </div>
            </div>
            
            <div id="promptpaySection" class="promptpay-section">
                <div class="qr-code">
                    <div class="qr-placeholder">
                        <i class="fas fa-qrcode"></i>
                        <p>QR Code พร้อมเพย์</p>
                    </div>
                    <p class="promptpay-number">หมายเลขพร้อมเพย์: 081-234-5678</p>
                    <p class="payment-amount">จำนวนเงิน: <strong>฿${orderData.total}</strong></p>
                </div>
                
                <div class="payment-instructions">
                    <h5>วิธีการชำระเงิน:</h5>
                    <ol>
                        <li>สแกน QR Code หรือโอนไปที่เบอร์ 081-234-5678</li>
                        <li>โอนจำนวน ฿${orderData.total}</li>
                        <li>ส่งสลิปให้ทางร้านผ่าน LINE: @kruakhunying</li>
                        <li>รอรับอาหารภายใน 15-20 นาที</li>
                    </ol>
                </div>
            </div>
            
            <div id="cashSection" class="cash-section" style="display: none;">
                <div class="cash-info">
                    <i class="fas fa-money-bill-wave" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                    <h5>ชำระเงินสดเมื่อรับอาหาร</h5>
                    <p>จำนวนเงิน: <strong>฿${orderData.total}</strong></p>
                    <p style="color: #666; margin-top: 1rem;">กรุณาเตรียมเงินให้พอดี</p>
                </div>
            </div>
            
            <div class="summary-actions">
                <button class="btn-primary" onclick="finishOrder()">
                    <i class="fas fa-check"></i> เสร็จสิ้น
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close order summary
function closeOrderSummary() {
    document.getElementById('orderSummaryModal').classList.remove('active');
}

// Send to LINE
function sendToLine() {
    const lineMessage = generateLineMessage(window.currentOrder);
    // In production, would open LINE app with pre-filled message
    window.open('https://line.me/R/ti/p/@kruakhunying', '_blank');
    showNotification('กรุณาส่งรายละเอียดคำสั่งซื้อและสลิปโอนเงินใน LINE');
}

// Select payment method
function selectPaymentMethod(method) {
    const methods = document.querySelectorAll('.payment-method');
    methods.forEach(m => m.classList.remove('active'));
    
    if (method === 'promptpay') {
        methods[0].classList.add('active');
        document.getElementById('promptpaySection').style.display = 'block';
        document.getElementById('cashSection').style.display = 'none';
    } else {
        methods[1].classList.add('active');
        document.getElementById('promptpaySection').style.display = 'none';
        document.getElementById('cashSection').style.display = 'block';
    }
}

// Finish order
function finishOrder() {
    cart = [];
    updateCartUI();
    closeOrderSummary();
    showNotification('ขอบคุณที่ใช้บริการ ครัวคุณหญิง! คำสั่งซื้อถูกส่งไปยังร้านแล้ว');
}