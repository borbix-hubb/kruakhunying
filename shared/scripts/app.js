// Menu Data
let menuData = [];

// Check if user selected "Other" building
function checkOtherBuilding(select) {
    const noteRequired = document.getElementById('noteRequired');
    const noteTextarea = document.querySelector('textarea[name="note"]');
    
    if (select.value === 'other') {
        noteRequired.style.display = 'inline';
        noteTextarea.required = true;
        noteTextarea.placeholder = 'กรุณาระบุที่อยู่ของคุณ (จำเป็น)';
    } else {
        noteRequired.style.display = 'none';
        noteTextarea.required = false;
        noteTextarea.placeholder = 'ระบุที่อยู่หรือรายละเอียดเพิ่มเติม';
    }
}

// Load menu with options from Supabase
async function loadMenuFromSupabase() {
    try {
        // Load menu items with their options
        const { data, error } = await window.supabaseClient
            .from('menu_with_options')
            .select('*')
            .order('category_id, id, option_name');
        
        if (error) throw error;
        
        console.log('Loaded menu data:', data);
        
        // Group menu items by id and collect their options
        const menuMap = new Map();
        
        data.forEach(row => {
            if (!menuMap.has(row.id)) {
                menuMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    category: getCategorySlug(row.category_name),
                    basePrice: row.base_price,
                    description: row.description || '',
                    emoji: getMenuEmoji(row.category_id, row.name),
                    popular: row.is_popular || false,
                    recommended: row.is_recommended || false,
                    options: []
                });
            }
            
            // Add option if it exists
            if (row.option_name) {
                menuMap.get(row.id).options.push({
                    name: row.option_name,
                    price: row.final_price
                });
            }
        });
        
        // Convert map to array
        menuData = Array.from(menuMap.values());
        
        // For items without options, set single price option
        menuData.forEach(item => {
            if (item.options.length === 0) {
                item.options.push({
                    name: 'ปกติ',
                    price: item.basePrice
                });
            }
        });
        
        console.log('Processed menu data:', menuData);
        
        // Display menu after loading
        displayMenu();
        
    } catch (error) {
        console.error('Error loading menu:', error);
        // Fallback to default menu with options
        menuData = [
            // Rice dishes with meat options
            { 
                id: 1, 
                name: "ข้าวผัด", 
                category: "rice", 
                basePrice: 45,
                emoji: "🍚", 
                description: "ข้าวผัดหอมมัน ใส่ไข่", 
                popular: true,
                options: [
                    { name: "หมู", price: 45 },
                    { name: "ไก่", price: 45 },
                    { name: "กุ้ง", price: 55 },
                    { name: "ทะเลรวม", price: 65 },
                    { name: "ปู", price: 70 }
                ]
            },
            { 
                id: 2, 
                name: "ข้าวผัดกะเพรา", 
                category: "rice", 
                basePrice: 45,
                emoji: "🌿", 
                description: "ผัดกะเพราราดข้าว เผ็ดแท้", 
                recommended: true,
                options: [
                    { name: "หมูสับ", price: 45 },
                    { name: "หมูกรอบ", price: 50 },
                    { name: "ไก่", price: 45 },
                    { name: "กุ้ง", price: 55 },
                    { name: "ทะเล", price: 65 }
                ]
            },
            { 
                id: 3, 
                name: "ข้าวผัดพริกแกง", 
                category: "rice", 
                basePrice: 45,
                emoji: "🌶️", 
                description: "ผัดพริกแกงเผ็ดจัดจ้าน", 
                hot: true,
                options: [
                    { name: "หมู", price: 45 },
                    { name: "ไก่", price: 45 },
                    { name: "เนื้อวัว", price: 50 },
                    { name: "กุ้ง", price: 55 }
                ]
            },
            { 
                id: 4, 
                name: "ข้าวผัดกระเทียม", 
                category: "rice", 
                basePrice: 45,
                emoji: "🧄", 
                description: "ผัดกระเทียมหอมมัน", 
                options: [
                    { name: "หมู", price: 45 },
                    { name: "ไก่", price: 45 },
                    { name: "กุ้ง", price: 55 },
                    { name: "ทะเลรวม", price: 65 }
                ]
            },
            { 
                id: 5, 
                name: "ข้าวผัดน้ำพริกเผา", 
                category: "rice", 
                basePrice: 45,
                emoji: "🌶️", 
                description: "ผัดน้ำพริกเผารสเผ็ด", 
                options: [
                    { name: "หมู", price: 45 },
                    { name: "ไก่", price: 45 },
                    { name: "กุ้ง", price: 55 },
                    { name: "หมึก", price: 60 }
                ]
            },
            
            // Noodle dishes with meat options
            { 
                id: 6, 
                name: "ผัดไทย", 
                category: "noodle", 
                basePrice: 40,
                emoji: "🍜", 
                description: "ผัดไทยรสชาติต้นตำรับ",
                popular: true,
                options: [
                    { name: "หมู", price: 40 },
                    { name: "ไก่", price: 40 },
                    { name: "กุ้ง", price: 50 },
                    { name: "ทะเลรวม", price: 60 }
                ]
            },
            { 
                id: 7, 
                name: "ผัดซีอิ๊ว", 
                category: "noodle", 
                basePrice: 40,
                emoji: "🍝", 
                description: "เส้นใหญ่ผัดซีอิ๊ว", 
                options: [
                    { name: "หมู", price: 40 },
                    { name: "ไก่", price: 40 },
                    { name: "เนื้อวัว", price: 45 },
                    { name: "ทะเล", price: 55 }
                ]
            },
            { 
                id: 8, 
                name: "ราดหน้า", 
                category: "noodle", 
                basePrice: 40,
                emoji: "🍲", 
                description: "ราดหน้าเส้นใหญ่", 
                options: [
                    { name: "หมู", price: 40 },
                    { name: "ไก่", price: 40 },
                    { name: "กุ้ง", price: 50 },
                    { name: "ทะเล", price: 55 }
                ]
            },
            { 
                id: 9, 
                name: "ผัดกะเพราสปาเก็ตตี้", 
                category: "noodle", 
                basePrice: 45,
                emoji: "🍝", 
                description: "สปาเก็ตตี้ผัดกะเพรา", 
                options: [
                    { name: "หมูสับ", price: 45 },
                    { name: "ไก่", price: 45 },
                    { name: "กุ้ง", price: 55 },
                    { name: "ทะเล", price: 65 }
                ]
            },
            { 
                id: 10, 
                name: "ก๋วยเตี๋ยวต้มยำ", 
                category: "noodle", 
                basePrice: 40,
                emoji: "🍜", 
                description: "ต้มยำรสจัดจ้าน", 
                options: [
                    { name: "หมู", price: 40 },
                    { name: "ไก่", price: 40 },
                    { name: "กุ้ง", price: 50 },
                    { name: "รวมมิตร", price: 55 }
                ]
            },
            
            // Side dishes  
            { id: 11, name: "ไก่ทอดกระเทียม", category: "sidedish", basePrice: 50, emoji: "🍗", description: "ไก่ทอดกรอบ หอมกระเทียม", options: [{name: "ปกติ", price: 50}] },
            { id: 12, name: "หมูกรอบคั่วพริกเกลือ", category: "sidedish", basePrice: 55, emoji: "🥓", description: "หมูกรอบ คั่วพริกเกลือ", options: [{name: "ปกติ", price: 55}] },
            { 
                id: 13, 
                name: "ต้มยำ", 
                category: "sidedish", 
                basePrice: 60,
                emoji: "🍲", 
                description: "ต้มยำรสจัด", 
                hot: true,
                options: [
                    { name: "กุ้ง", price: 70 },
                    { name: "ทะเลรวม", price: 80 },
                    { name: "ปลากระพง", price: 60 },
                    { name: "ไก่", price: 60 }
                ]
            },
            { id: 14, name: "ต้มยำกุ้ง", category: "sidedish", price: 60, emoji: "🦐", description: "ต้มยำกุ้งน้ำข้น รสชาติจัดจ้าน" },
            { id: 15, name: "ยำวุ้นเส้น", category: "sidedish", price: 35, emoji: "🥗", description: "ยำวุ้นเส้น รสชาติกลมกล่อม" },
            
            // Drinks
            { id: 16, name: "ชาเย็น", category: "drink", price: 25, emoji: "🧋", description: "ชาเย็นหวานมัน" },
            { id: 17, name: "กาแฟเย็น", category: "drink", price: 25, emoji: "☕", description: "กาแฟเย็นหอมมัน" },
            { id: 18, name: "น้ำส้ม", category: "drink", price: 20, emoji: "🍊", description: "น้ำส้มคั้นสด" },
            { id: 19, name: "โค้ก", category: "drink", price: 15, emoji: "🥤", description: "โค้กเย็นๆ" },
            { id: 20, name: "น้ำเปล่า", category: "drink", price: 10, emoji: "💧", description: "น้ำเปล่าเย็น" }
        ];
        displayMenu();
    }
}

// Helper function to convert category name to slug
function getCategorySlug(categoryName) {
    const categoryMap = {
        'อาหารจานเดียวแนะนำ': 'rice',
        'อาหารจานเดียว': 'rice',
        'อาหารประเภทเส้น': 'noodle',
        'ประเภทกับข้าว': 'sidedish',
        'ประเภทยำ': 'salad',
        'ประเภทน้ำตก': 'grill',
        'ประเภทตำ': 'papaya',
        'เมนูทานเล่น': 'snack',
        'เมนูเพิ่มเติม': 'extra',
        'ร้านน้ำ Sipit': 'sipit-drinks'  // แก้ไขให้ตรงกับ database slug
    };
    return categoryMap[categoryName] || 'rice';
}

// Helper function to get emoji for menu item
function getMenuEmoji(categoryId, name) {
    // Map emojis based on category or specific items
    const categoryEmojiMap = {
        1: '🍛', // recommended dishes
        2: '🍚', // rice dishes
        3: '🍜', // noodles
        4: '🍲', // side dishes
        5: '🥗', // salads
        6: '🍖', // namtok
        7: '🥒', // somtam
        8: '🍟', // snacks
        9: '➕', // extras
        10: '☕' // drinks (Sipit)
    };
    
    // Special emojis for specific items
    if (name.includes('กุ้ง')) return '🍤';
    if (name.includes('หมู')) return '🥓';
    if (name.includes('ไก่')) return '🍗';
    if (name.includes('ปู')) return '🦀';
    if (name.includes('ผัก')) return '🥦';
    if (name.includes('ชา') && !name.includes('อเมริกาโน่')) return '🧋';
    if (name.includes('กาแฟ') || name.includes('อเมริกาโน่') || name.includes('คาปู') || name.includes('ลาเต้') || name.includes('มอค')) return '☕';
    if (name.includes('โซดา')) return '🥤';
    if (name.includes('สมูทตี้')) return '🧋';
    if (name.includes('โกโก้') || name.includes('ช็อคโกแลต')) return '🍾';
    if (name.includes('นม')) return '🥛';
    if (name.includes('โอวัลติน')) return '🍼';
    if (name.includes('ส้ม') && !name.includes('ชา')) return '🍊';
    
    return categoryEmojiMap[categoryId] || '🍽️';
}

// Global variables
let cart = [];
let currentCategory = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Load menu from Supabase first
    loadMenuFromSupabase();
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

// Load menu items (for compatibility)
function loadMenu() {
    displayMenu();
}

// Display menu items
function displayMenu() {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';
    
    let filteredMenu;
    if (currentCategory === 'all') {
        filteredMenu = menuData;
    } else {
        filteredMenu = menuData.filter(item => {
            // Map drinks tab to sipit-drinks category
            if (currentCategory === 'drinks') {
                return item.category === 'sipit-drinks';
            }
            return item.category === currentCategory;
        });
    }
    
    console.log('Filtered menu for category', currentCategory, ':', filteredMenu);
    
    filteredMenu.forEach(item => {
        const menuItemEl = createMenuItemElement(item);
        menuContainer.appendChild(menuItemEl);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.onclick = () => showItemOptions(item.id);
    
    const badges = [];
    if (item.popular) badges.push('<span class="badge badge-popular">ยอดนิยม</span>');
    if (item.recommended) badges.push('<span class="badge badge-recommended">แนะนำ</span>');
    if (item.hot) badges.push('<span class="badge badge-hot">🌶️ เผ็ด</span>');
    
    // Show price range if multiple options
    let priceDisplay;
    if (item.options && item.options.length > 1) {
        const prices = item.options.map(opt => opt.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        priceDisplay = minPrice === maxPrice ? `฿${minPrice}` : `฿${minPrice}-${maxPrice}`;
    } else {
        priceDisplay = `฿${item.options?.[0]?.price || item.basePrice}`;
    }
    
    div.innerHTML = `
        ${badges.length > 0 ? `<div class="badges">${badges.join('')}</div>` : ''}
        <div class="menu-item-info">
            <h3 class="menu-item-name">${item.name}</h3>
            <p class="menu-item-description">${item.description}</p>
            <div class="menu-item-footer">
                <span class="menu-item-price">${priceDisplay}</span>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); showItemOptions(${item.id})">
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
    displayMenu();
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

// Show item options modal
function showItemOptions(itemId) {
    const item = menuData.find(i => i.id === itemId);
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }
    
    console.log('Showing options for item:', item);
    console.log('Item options:', item.options);
    
    // Create modal for options (always show even for single option to include note)
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'itemOptionsModal';
    
    const optionsHTML = item.options.map(option => `
        <button class="option-btn" onclick="selectOptionWithNote(${itemId}, '${option.name}', ${option.price})">
            <span class="option-name">${option.name}</span>
            <span class="option-price">฿${option.price}</span>
        </button>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content item-options-modal">
            <div class="modal-header">
                <h3>${item.name}</h3>
                <button class="close-modal" onclick="closeItemOptionsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="item-detail-description" style="margin-bottom: 1rem; color: #666;">${item.description || ''}</p>
                ${item.options.length > 1 ? '<p class="options-title">เลือกประเภทเนื้อสัตว์:</p>' : ''}
                <div class="options-grid">
                    ${optionsHTML}
                </div>
                <div class="form-group" style="margin-top: 1.5rem;">
                    <label>ตัวเลือกพิเศษ</label>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                        <button type="button" class="special-option-btn" onclick="addSpecialToCart(${itemId})" style="flex: 1; padding: 0.75rem; border: 2px solid #FF6B35; border-radius: 10px; background: #FF6B35; color: white; cursor: pointer; font-size: 1rem;">
                            <i class="fas fa-star"></i> พิเศษ +10 บาท - เพิ่มเลย!
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <label>หมายเหตุ</label>
                    <input type="text" id="itemNote" placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย, ไม่เผ็ด" style="width: 100%; padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem;">
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close item options modal
function closeItemOptionsModal() {
    const modal = document.getElementById('itemOptionsModal');
    if (modal) {
        modal.remove();
    }
}

// Select option and add to cart
function selectOption(itemId, optionName, price) {
    addToCart(itemId, optionName, price);
    closeItemOptionsModal();
}

// Select option with note and add to cart
function selectOptionWithNote(itemId, optionName, price) {
    const note = document.getElementById('itemNote').value.trim();
    const isSpecial = window.isSpecialOptionSelected || false;
    const finalPrice = isSpecial ? price + 10 : price;
    const finalNote = isSpecial ? (note ? `${note}, พิเศษ +10 บาท` : 'พิเศษ +10 บาท') : note;
    addToCart(itemId, optionName, finalPrice, finalNote);
    closeItemOptionsModal();
}

// Add special option directly to cart
function addSpecialToCart(itemId) {
    const item = menuData.find(i => i.id === itemId);
    if (!item) return;
    
    const note = document.getElementById('itemNote').value.trim();
    const defaultOption = item.options[0]; // Use first available option
    const specialPrice = defaultOption.price + 10;
    const specialNote = note ? `${note}, พิเศษ +10 บาท` : 'พิเศษ +10 บาท';
    
    addToCart(itemId, defaultOption.name, specialPrice, specialNote);
    closeItemOptionsModal();
    showNotification('เพิ่มเมนูพิเศษในตะกร้าแล้ว!');
}

// Close item options modal
function closeItemOptionsModal() {
    const modal = document.getElementById('itemOptionsModal');
    if (modal) {
        modal.remove();
    }
    // Reset special option
    window.isSpecialOptionSelected = false;
}

// Add to cart with option
function addToCart(itemId, optionName = '', price = 0, note = '') {
    const item = menuData.find(i => i.id === itemId);
    if (!item) return;
    
    // Create unique key for cart item (same item with different options = different cart items)
    const cartKey = `${itemId}_${optionName}`;
    const existingItem = cart.find(i => i.cartKey === cartKey && i.note === note);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ 
            ...item, 
            cartKey: cartKey,
            selectedOption: optionName,
            price: price || item.basePrice,
            quantity: 1, 
            note: note 
        });
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
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.selectedOption ? `<div class="cart-item-option" style="font-size: 12px; color: #FF6B35; font-weight: 500;">🍽️ ${item.selectedOption}</div>` : ''}
                ${item.note ? `<div class="cart-item-note" style="font-size: 12px; color: #666;">📝 ${item.note}</div>` : ''}
                <div class="cart-item-price">฿${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `฿${total}`;
}

// Update quantity
function updateQuantity(index, change) {
    const item = cart[index];
    if (!item) return;
    
    item.quantity += change;
    if (item.quantity <= 0) {
        cart.splice(index, 1);
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
            <div class="form-group">
                <label>หมายเหตุ (ถ้ามี)</label>
                <input type="text" id="itemNote" placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="back-btn" onclick="closeItemModal()" style="flex: 1; padding: 12px; background: #f0f0f0; color: #333; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
                    <i class="fas fa-arrow-left"></i> กลับ
                </button>
                <button class="checkout-btn" onclick="addDetailToCart(${item.id})" style="flex: 2;">
                    <i class="fas fa-cart-plus"></i> เพิ่มในตะกร้า
                </button>
            </div>
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
    const note = document.getElementById('itemNote').value.trim();
    const existingItem = cart.find(i => i.id === itemId && i.note === note);
    
    if (existingItem) {
        existingItem.quantity += window.currentDetailQuantity;
    } else {
        cart.push({ ...item, quantity: window.currentDetailQuantity, note: note });
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
    
    // Check for saved address
    checkSavedAddress();
}

// Close order modal
function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Submit order
async function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        dorm: formData.get('dorm'),
        room: formData.get('room'),
        note: formData.get('note')
    };
    
    try {
        // First, save or get customer from Supabase
        let customerId;
        
        // Check if customer exists
        const { data: existingCustomer, error: customerCheckError } = await window.supabaseClient
            .from('customers')
            .select('id')
            .eq('phone', customerData.phone)
            .maybeSingle();
        
        if (existingCustomer) {
            customerId = existingCustomer.id;
            // Update customer info
            await window.supabaseClient
                .from('customers')
                .update({
                    name: customerData.name,
                    dorm: customerData.dorm,
                    room: customerData.room
                })
                .eq('id', customerId);
        } else {
            // Create new customer
            const { data: newCustomer, error: customerError } = await window.supabaseClient
                .from('customers')
                .insert([{
                    name: customerData.name,
                    phone: customerData.phone,
                    dorm: customerData.dorm,
                    room: customerData.room
                }])
                .select()
                .single();
            
            if (customerError) throw customerError;
            customerId = newCustomer.id;
        }
        
        // Create order
        const { data: order, error: orderError } = await window.supabaseClient
            .from('orders')
            .insert([{
                order_number: generateOrderId(),
                customer_id: customerId,
                delivery_dorm: customerData.dorm,
                delivery_room: customerData.room,
                delivery_note: customerData.note || null,
                note: customerData.note || null,
                total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'pending',
                payment_method: selectedPaymentMethod,
                delivery_method: selectedDeliveryMethod
            }])
            .select()
            .single();
        
        if (orderError) throw orderError;
        
        // Create order items
        const orderItems = cart.map(item => ({
            order_id: order.id,
            menu_item_id: item.id,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        }));
        
        const { error: itemsError } = await window.supabaseClient
            .from('order_items')
            .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        // Create order data for summary
        const orderData = {
            orderId: `ORD${order.id.toString().padStart(6, '0')}`,
            customer: customerData,
            items: cart,
            total: order.total_amount,
            timestamp: new Date()
        };
        
        // Save customer info locally for convenience
        saveCustomerInfo(customerData);
        
        // Store order data temporarily
        window.currentOrder = orderData;
        
        // Close order modal and show summary
        closeOrderModal();
        showOrderSummary(orderData);
        
        // Send notification (in real app, this would trigger backend notification)
        console.log('Order created:', order);
        
    } catch (error) {
        console.error('Error submitting order:', error);
        showNotification('เกิดข้อผิดพลาด: ' + error.message);
    }
}

// Generate LINE message
function generateLineMessage(orderData) {
    const itemsList = orderData.items.map(item => 
        `- ${item.name} x${item.quantity} = ฿${item.price * item.quantity}`
    ).join('\n');
    
    return `🍴 คำสั่งซื้อใหม่ 🍴
    
ชื่อ: ${orderData.customer.name}
โทร: ${orderData.customer.phone}
ตึก: ${getDormName(orderData.customer.dorm)}
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
            
            <div class="delivery-options">
                <h4>วิธีการรับอาหาร</h4>
                <div class="delivery-methods">
                    <button type="button" class="delivery-method active" onclick="selectDeliveryMethod('delivery')" id="deliveryBtn">
                        <i class="fas fa-motorcycle"></i>
                        <span>ส่งที่ห้อง</span>
                    </button>
                    <button type="button" class="delivery-method" onclick="selectDeliveryMethod('pickup')" id="pickupBtn">
                        <i class="fas fa-shopping-bag"></i>
                        <span>มารับเอง</span>
                    </button>
                </div>
            </div>
            
            <div class="delivery-info" id="deliveryInfo">
                <h4>ข้อมูลจัดส่ง</h4>
                <p><i class="fas fa-user"></i> ${orderData.customer.name}</p>
                <p><i class="fas fa-phone"></i> ${orderData.customer.phone}</p>
                <p><i class="fas fa-building"></i> ${getDormName(orderData.customer.dorm)} ห้อง ${orderData.customer.room}</p>
                ${orderData.customer.note ? `<p><i class="fas fa-sticky-note"></i> ${orderData.customer.note}</p>` : ''}
            </div>
            
            <div class="pickup-info" id="pickupInfo" style="display: none;">
                <h4>ข้อมูลการรับอาหาร</h4>
                <p><i class="fas fa-user"></i> ${orderData.customer.name}</p>
                <p><i class="fas fa-phone"></i> ${orderData.customer.phone}</p>
                <p><i class="fas fa-store"></i> รับที่ร้านครัวคุณหญิง</p>
                <p><i class="fas fa-clock"></i> เวลารับอาหารประมาณ 15-20 นาที</p>
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
// Store selected payment method
let selectedPaymentMethod = 'promptpay'; // Default to promptpay
let selectedDeliveryMethod = 'delivery'; // Default to delivery

// Select delivery method
function selectDeliveryMethod(method) {
    selectedDeliveryMethod = method;
    const deliveryBtn = document.getElementById('deliveryBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    const deliveryInfo = document.getElementById('deliveryInfo');
    const pickupInfo = document.getElementById('pickupInfo');
    
    if (method === 'delivery') {
        deliveryBtn.classList.add('active');
        pickupBtn.classList.remove('active');
        deliveryInfo.style.display = 'block';
        pickupInfo.style.display = 'none';
    } else {
        deliveryBtn.classList.remove('active');
        pickupBtn.classList.add('active');
        deliveryInfo.style.display = 'none';
        pickupInfo.style.display = 'block';
    }
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method; // Store the selected method
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

// Address Management Functions
function checkSavedAddress() {
    const savedInfo = localStorage.getItem('customerInfo');
    
    if (savedInfo) {
        const customer = JSON.parse(savedInfo);
        const savedAddressBtn = document.querySelector('.address-option:first-child');
        const savedAddressInfo = document.getElementById('savedAddressInfo');
        
        // Show saved address info
        savedAddressInfo.innerHTML = `
            <h5>ที่อยู่เดิม</h5>
            <p><i class="fas fa-user"></i> ${customer.name}</p>
            <p><i class="fas fa-phone"></i> ${customer.phone}</p>
            <p><i class="fas fa-building"></i> ${getDormName(customer.dorm)} ห้อง ${customer.room}</p>
            ${customer.note ? `<p><i class="fas fa-sticky-note"></i> ${customer.note}</p>` : ''}
            <button type="button" class="edit-btn" onclick="useNewAddress()">
                <i class="fas fa-edit"></i> แก้ไขที่อยู่
            </button>
        `;
        
        // Disable and show saved address by default
        savedAddressBtn.disabled = false;
        useSavedAddress();
    } else {
        // No saved address, disable the button
        const savedAddressBtn = document.querySelector('.address-option:first-child');
        savedAddressBtn.disabled = true;
        savedAddressBtn.style.opacity = '0.5';
        savedAddressBtn.style.cursor = 'not-allowed';
        
        // Auto select new address
        useNewAddress();
    }
}

function getDormName(dormValue) {
    const dormMap = {
        'building-1': 'ตึก 1',
        'building-a': 'ตึก A',
        'building-b': 'ตึก B',
        'building-3': 'ตึก 3',
        'other': 'อื่นๆ',
        // Keep old values for backward compatibility
        'dorm-a': 'หอ A',
        'dorm-b': 'หอ B', 
        'dorm-c': 'หอ C'
    };
    return dormMap[dormValue] || dormValue;
}

function useSavedAddress() {
    const savedInfo = localStorage.getItem('customerInfo');
    
    if (!savedInfo) {
        showNotification('ไม่พบที่อยู่เดิม');
        useNewAddress();
        return;
    }
    
    const customer = JSON.parse(savedInfo);
    const form = document.getElementById('orderForm');
    
    // Fill form with saved data
    form.name.value = customer.name;
    form.phone.value = customer.phone;
    form.dorm.value = customer.dorm;
    form.room.value = customer.room;
    
    // Update UI
    document.querySelectorAll('.address-option').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.address-option:first-child').classList.add('active');
    
    // Show saved address info, hide form fields
    document.getElementById('savedAddressInfo').style.display = 'block';
    form.style.display = 'none';
    
    // Create a visible summary with submit button
    const formContainer = form.parentElement;
    if (!document.getElementById('savedAddressSummary')) {
        const summary = document.createElement('div');
        summary.id = 'savedAddressSummary';
        summary.innerHTML = `
            <button type="button" class="submit-order-btn" onclick="submitOrderWithSavedAddress()">
                ยืนยันคำสั่งซื้อ
            </button>
        `;
        formContainer.appendChild(summary);
    }
}

function useNewAddress() {
    // Update UI
    document.querySelectorAll('.address-option').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.address-option:last-child').classList.add('active');
    
    // Hide saved address info, show form
    document.getElementById('savedAddressInfo').style.display = 'none';
    document.getElementById('orderForm').style.display = 'block';
    
    // Remove saved address summary if exists
    const summary = document.getElementById('savedAddressSummary');
    if (summary) {
        summary.remove();
    }
    
    // Clear form for new input
    const form = document.getElementById('orderForm');
    form.reset();
}

function submitOrderWithSavedAddress() {
    const form = document.getElementById('orderForm');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
}

function saveCustomerInfo(customer) {
    localStorage.setItem('customerInfo', JSON.stringify({
        name: customer.name,
        phone: customer.phone,
        dorm: customer.dorm,
        room: customer.room
    }));
}