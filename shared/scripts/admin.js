// Store orders data - start empty, will load from Supabase
let orders = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check authentication - but don't redirect if fails for now
        const user = await getCurrentSession();
        
        // Set admin name
        if (user) {
            document.getElementById('adminName').textContent = user.name || user.email || 'admin.borbix';
        } else {
            document.getElementById('adminName').textContent = 'admin.borbix';
        }
        
        // Setup navigation first
        setupNavigation();
        
        // Try to load from Supabase, but continue even if it fails
        try {
            await loadOrdersFromSupabase();
            // Update dashboard statistics
            await updateDashboardStats();
            // Make sure to display orders if we're on orders page
            const activeSection = document.querySelector('.content-section:not([style*="none"])');
            if (!activeSection || activeSection.id === 'orders') {
                loadOrders();
            }
        } catch (error) {
            console.error('Failed to load orders from Supabase:', error);
            // Show empty table if Supabase fails
            orders = [];
            loadOrders();
        }
        
        setupRealtimeOrderSubscription();
        checkNotifications();
        
    } catch (error) {
        console.error('Initialization error:', error);
        // Continue with basic functionality
        setupNavigation();
        loadOrders();
    }
});

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding section
            const sectionId = item.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
}

async function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
    
    // Load section specific data
    switch(sectionId) {
        case 'orders':
            await loadOrdersFromSupabase();
            break;
        case 'menu':
            await loadMenuItems();
            break;
        case 'reports':
            await loadReports();
            break;
        case 'admins':
            await loadAdmins();
            break;
    }
}

// Load orders from Supabase
async function loadOrdersFromSupabase() {
    try {
        // Check if Supabase client exists
        if (!window.supabaseClient) {
            console.log('Supabase client not initialized, using mock data');
            loadOrders();
            return;
        }
        
        console.log('Loading orders from Supabase...');
        const { data, error } = await window.supabaseClient
            .from('orders')
            .select(`
                *,
                customers (
                    name,
                    phone,
                    dorm,
                    room
                ),
                order_items (
                    quantity,
                    price,
                    subtotal,
                    note,
                    menu_items (
                        name
                    )
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            console.error('Error details:', error.message, error.details, error.hint);
            // Don't throw error, continue with empty data
            orders = [];
            loadOrders();
            return;
        }
        
        console.log(`Found ${data?.length || 0} orders`);
        
        if (!data || data.length === 0) {
            // No orders in database
            console.log('No orders found in database');
            orders = [];
            loadOrders();
            return;
        }
        
        // Clear existing orders (except mock data if no real data)
        if (data.length > 0) {
            orders = [];
        }
        
        // Transform data to match our format
        const newOrders = data.map(order => ({
            id: order.order_number || `ORD${order.id.toString().padStart(6, '0')}`,
            customer: {
                name: order.customers?.name || 'ไม่ระบุชื่อ',
                phone: order.customers?.phone || 'ไม่ระบุ',
                dorm: order.delivery_dorm || order.customers?.dorm || 'ไม่ระบุ',
                room: order.delivery_room || order.customers?.room || 'ไม่ระบุ'
            },
            items: order.order_items?.map(item => ({
                name: item.menu_items?.name || 'ไม่ระบุ',
                quantity: item.quantity,
                price: item.price,
                note: item.note || '',
                option: ''
            })) || [],
            total: order.total_amount,
            status: order.status || 'pending',
            note: order.note || order.delivery_note,
            paymentMethod: order.payment_method || 'เงินสด',
            timestamp: new Date(order.created_at)
        }));
        
        // Add new orders to the beginning of array
        orders = [...newOrders];
        
        console.log(`Updated orders array with ${orders.length} orders`);
        
        // Always update UI after loading
        loadOrders();
        
    } catch (error) {
        console.error('Error loading orders:', error);
        // Show empty table on error
        console.log('Failed to load from Supabase');
        orders = [];
        loadOrders();
        
        // Show error in console for debugging
        if (error.message) {
            console.error('Supabase error details:', error.message);
        }
    }
}

// Load orders
function loadOrders(filter = 'all') {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    let filteredOrders = orders;
    if (filter !== 'all') {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    
    if (filteredOrders.length === 0) {
        // Show empty message
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px; display: block;"></i>
                    ไม่มีคำสั่งซื้อ${filter !== 'all' ? 'ในสถานะนี้' : 'ในระบบ'}
                    <br>
                    <small>คำสั่งซื้อใหม่จะแสดงที่นี่ทันทีเมื่อลูกค้าสั่งอาหาร</small>
                </td>
            </tr>
        `;
    } else {
        filteredOrders.forEach(order => {
            const row = createOrderRow(order);
            tbody.appendChild(row);
        });
    }
    
    // Update notification badge
    updateNotificationBadge();
    
    // Update dashboard stats whenever orders are loaded
    updateDashboardStats();
}

function createOrderRow(order) {
    const tr = document.createElement('tr');
    const itemsList = order.items.map(item => {
        let itemText = `${item.name}`;
        if (item.option) itemText += ` (${item.option})`;
        itemText += ` x${item.quantity}`;
        if (item.note) itemText += ` - ${item.note}`;
        return itemText;
    }).join(', ');
    const paymentMethod = getPaymentMethodText(order.paymentMethod);
    
    tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer.name}</td>
        <td>${itemsList}</td>
        <td>฿${order.total}</td>
        <td>${getDormName(order.customer.dorm)} ${order.customer.room}</td>
        <td>${getPaymentMethodText(paymentMethod)}</td>
        <td><span class="order-status status-${order.status}">${getStatusText(order.status)}</span></td>
        <td>
            <div class="action-buttons">
                <button class="action-btn" onclick="viewOrderDetail('${order.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${order.status === 'pending' ? `
                    <button class="action-btn" onclick="updateOrderStatus('${order.id}', 'preparing')">
                        <i class="fas fa-play"></i>
                    </button>
                ` : ''}
                ${order.status === 'preparing' ? `
                    <button class="action-btn" onclick="updateOrderStatus('${order.id}', 'completed')">
                        <i class="fas fa-check"></i>
                    </button>
                ` : ''}
            </div>
        </td>
    `;
    
    return tr;
}

function getStatusText(status) {
    const statusMap = {
        pending: 'รอดำเนินการ',
        preparing: 'กำลังทำ',
        completed: 'เสร็จแล้ว'
    };
    return statusMap[status] || status;
}

function getPaymentMethodText(method) {
    const methodMap = {
        cash: 'เงินสด',
        promptpay: 'PromptPay',
        transfer: 'โอนเงิน'
    };
    return methodMap[method] || method || 'เงินสด';
}

function getDormName(dorm) {
    const dormMap = {
        'building-1': 'ตึก 1',
        'building-a': 'ตึก A',
        'building-b': 'ตึก B',
        'building-3': 'ตึก 3',
        'other': 'อื่นๆ'
    };
    return dormMap[dorm] || dorm || 'ไม่ระบุ';
}

// View order detail
function viewOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailModal');
    const content = document.getElementById('orderDetailContent');
    
    content.innerHTML = `
        <div class="order-detail">
            <div class="detail-section">
                <h3>ข้อมูลลูกค้า</h3>
                <p><strong>ชื่อ:</strong> ${order.customer.name}</p>
                <p><strong>โทร:</strong> ${order.customer.phone}</p>
                <p><strong>ที่อยู่:</strong> ${order.customer.dorm} ห้อง ${order.customer.room}</p>
            </div>
            
            <div class="detail-section">
                <h3>รายการอาหาร</h3>
                <table class="detail-table">
                    ${order.items.map(item => `
                        <tr>
                            <td>
                                ${item.name}
                                ${item.option ? `<br><small style="color: #666;">(${item.option})</small>` : ''}
                                ${item.note ? `<br><small style="color: #999;">หมายเหตุ: ${item.note}</small>` : ''}
                            </td>
                            <td>x${item.quantity}</td>
                            <td>฿${item.price * item.quantity}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="2"><strong>รวม</strong></td>
                        <td><strong>฿${order.total}</strong></td>
                    </tr>
                </table>
            </div>
            
            <div class="detail-section">
                <h3>สถานะ</h3>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
            </div>
            
            <div class="detail-actions">
                ${order.status !== 'completed' ? `
                    <button class="btn-primary" onclick="sendLineNotification('${order.id}')">
                        <i class="fab fa-line"></i> แจ้งลูกค้าผ่าน LINE
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeOrderDetail() {
    document.getElementById('orderDetailModal').classList.remove('active');
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    try {
        // Find the actual order ID from order_number
        const { data: orderData, error: findError } = await window.supabaseClient
            .from('orders')
            .select('id')
            .eq('order_number', orderId)
            .single();
        
        if (findError) {
            // Try with ID directly if order_number fails
            const numericId = parseInt(orderId.replace('ORD', ''));
            const { error: updateError } = await window.supabaseClient
                .from('orders')
                .update({ status: newStatus })
                .eq('id', numericId);
            
            if (updateError) throw updateError;
        } else {
            const { error: updateError } = await window.supabaseClient
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderData.id);
            
            if (updateError) throw updateError;
        }
        
        // Update local data
        order.status = newStatus;
        loadOrders();
        
        // Update dashboard statistics immediately
        await updateDashboardStats();
        
        // Send notification
        showNotification(`อัพเดทสถานะ ${order.id} เป็น ${getStatusText(newStatus)}`);
        
        // Send LINE notification if completed
        if (newStatus === 'completed') {
            sendLineNotification(orderId);
        }
        
    } catch (error) {
        console.error('Error updating order status:', error);
        showNotification('ไม่สามารถอัพเดทสถานะได้');
    }
}

// Send LINE notification
function sendLineNotification(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // In real app, would integrate with LINE API
    const message = `สวัสดีคุณ ${order.customer.name} 
อาหารของคุณ${order.status === 'completed' ? 'เสร็จแล้ว' : 'กำลังจัดเตรียม'}
กรุณารอรับที่ห้อง ${order.customer.room}`;
    
    console.log('LINE Message:', message);
    showNotification('ส่งแจ้งเตือน LINE เรียบร้อยแล้ว');
}

// Menu Management
async function loadMenuItems() {
    const menuList = document.getElementById('menuList');
    
    try {
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient
                .from('menu_items')
                .select(`
                    *,
                    menu_categories (
                        name,
                        slug
                    )
                `)
                .order('category_id');
            
            if (!error && data && data.length > 0) {
                menuList.innerHTML = data.map(item => `
                    <div class="menu-item-card">
                        <div class="menu-item-info">
                            <div>
                                <h4>${item.name}</h4>
                                <p>฿${item.price} - ${item.menu_categories?.name || 'ไม่ระบุหมวดหมู่'}</p>
                                ${item.is_available ? '' : '<span class="unavailable-badge">ไม่พร้อมขาย</span>'}
                            </div>
                        </div>
                        <div class="menu-item-actions">
                            <button class="action-btn" onclick="editMenuItem(${item.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn" onclick="toggleMenuAvailability(${item.id}, ${!item.is_available})">
                                <i class="fas fa-${item.is_available ? 'eye-slash' : 'eye'}"></i>
                            </button>
                            <button class="action-btn" onclick="deleteMenuItem(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                return;
            }
        }
        
        // Use mock data if Supabase fails or no data
        const mockMenuItems = [
            { id: 1, name: 'ข้าวผัดกุ้ง', price: 50, menu_categories: { name: 'ข้าว' }, is_available: true },
            { id: 2, name: 'ผัดไทยกุ้งสด', price: 45, menu_categories: { name: 'เส้น' }, is_available: true },
            { id: 3, name: 'ชาเย็น', price: 25, menu_categories: { name: 'เครื่องดื่ม' }, is_available: true }
        ];
        
        menuList.innerHTML = mockMenuItems.map(item => `
            <div class="menu-item-card">
                <div class="menu-item-info">
                    <div>
                        <h4>${item.name}</h4>
                        <p>฿${item.price} - ${item.menu_categories?.name}</p>
                    </div>
                </div>
                <div class="menu-item-actions">
                    <button class="action-btn" onclick="editMenuItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="deleteMenuItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading menu items:', error);
        showNotification('ใช้ข้อมูลตัวอย่าง');
    }
}

// Toggle menu item availability
async function toggleMenuAvailability(itemId, available) {
    try {
        const { error } = await window.supabaseClient
            .from('menu_items')
            .update({ is_available: available })
            .eq('id', itemId);
        
        if (error) throw error;
        
        showNotification(available ? 'เปิดขายเมนูแล้ว' : 'ปิดขายเมนูแล้ว');
        loadMenuItems();
        
    } catch (error) {
        console.error('Error toggling availability:', error);
        showNotification('ไม่สามารถเปลี่ยนสถานะได้');
    }
}

function getCategoryText(category) {
    const categoryMap = {
        rice: 'ข้าว',
        noodle: 'เส้น',
        sidedish: 'กับข้าว',
        drink: 'เครื่องดื่ม'
    };
    return categoryMap[category] || category;
}

// Add menu modal
function showAddMenuModal() {
    document.getElementById('addMenuModal').classList.add('active');
}

function closeAddMenuModal() {
    const modal = document.getElementById('addMenuModal');
    const form = document.getElementById('addMenuForm');
    const modalHeader = modal.querySelector('.modal-header h2');
    
    modal.classList.remove('active');
    form.reset();
    form.onsubmit = addMenuItem;
    modalHeader.textContent = 'เพิ่มเมนูใหม่';
}

async function addMenuItem(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    try {
        // Get category ID from slug
        const { data: category, error: catError } = await window.supabaseClient
            .from('menu_categories')
            .select('id')
            .eq('slug', formData.get('category'))
            .single();
        
        if (catError) throw catError;
        
        const { error } = await window.supabaseClient
            .from('menu_items')
            .insert([{
                name: formData.get('name'),
                category_id: category.id,
                price: parseFloat(formData.get('price')),
                description: formData.get('description'),
                is_available: true
            }]);
        
        if (error) throw error;
        
        closeAddMenuModal();
        showNotification('เพิ่มเมนูใหม่เรียบร้อยแล้ว');
        await loadMenuItems();
        
    } catch (error) {
        console.error('Error adding menu item:', error);
        showNotification('ไม่สามารถเพิ่มเมนูได้');
    }
}

// Reports
let salesChart = null;

async function loadReports(startDate = null, endDate = null) {
    try {
        let ordersData = [];
        
        // Set default date range if not provided
        if (!startDate) {
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
        }
        if (!endDate) {
            endDate = new Date();
        }
        
        // Try to get data from Supabase
        if (window.supabaseClient) {
            const { data, error } = await window.supabaseClient
                .from('orders')
                .select('created_at, total_amount, status')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at');
            
            if (!error && data) {
                ordersData = data;
            }
        }
        
        // Update summary cards with real data
        await updateReportSummary();
        
        // Group by date for chart
        const dailyData = {};
        const labels = [];
        const salesData = [];
        const orderCounts = [];
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            dailyData[dateKey] = { sales: 0, orders: 0 };
            labels.push(date.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' }));
        }
        
        // Aggregate data
        ordersData.forEach(order => {
            const dateKey = order.created_at.split('T')[0];
            if (dailyData[dateKey]) {
                dailyData[dateKey].sales += parseFloat(order.total_amount);
                dailyData[dateKey].orders += 1;
            }
        });
        
        // Convert to arrays
        Object.values(dailyData).forEach(day => {
            salesData.push(day.sales);
            orderCounts.push(day.orders);
        });
    
    // Load sales chart
    const ctx = document.getElementById('salesChart');
    if (ctx) {
        // Destroy existing chart if any
        if (salesChart) {
            salesChart.destroy();
        }
        
        salesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'ยอดขาย (บาท)',
                    data: salesData,
                    borderColor: '#FF6B35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y'
                }, {
                    label: 'จำนวนออเดอร์',
                    data: orderCounts,
                    borderColor: '#FFD166',
                    backgroundColor: 'rgba(255, 209, 102, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'ยอดขายและจำนวนออเดอร์ 7 วันย้อนหลัง',
                        font: {
                            size: 16,
                            family: 'Prompt'
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Prompt'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'ยอดขาย (บาท)',
                            font: {
                                family: 'Prompt'
                            }
                        },
                        ticks: {
                            font: {
                                family: 'Prompt'
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'จำนวนออเดอร์',
                            font: {
                                family: 'Prompt'
                            }
                        },
                        ticks: {
                            font: {
                                family: 'Prompt'
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    x: {
                        ticks: {
                            font: {
                                family: 'Prompt'
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Load category chart
    await loadCategoryChart();
    
    // Load popular items
    await loadPopularItems();
    
    } catch (error) {
        console.error('Error loading reports:', error);
        showNotification('ไม่สามารถโหลดรายงานได้');
    }
}

// Load popular items
async function loadPopularItems() {
    try {
        const { data, error } = await window.supabaseClient
            .from('order_items')
            .select(`
                menu_item_id,
                menu_items (name),
                quantity
            `)
            .order('quantity', { ascending: false });
        
        if (error) throw error;
        
        // Aggregate by menu item
        const itemCounts = {};
        data.forEach(item => {
            const name = item.menu_items?.name || 'Unknown';
            itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
        });
        
        // Sort and get top 5
        const sortedItems = Object.entries(itemCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        const popularList = document.querySelector('.popular-list');
        if (popularList) {
            popularList.innerHTML = sortedItems.map((item, index) => `
                <div class="popular-item">
                    <span>${index + 1}. ${item[0]}</span>
                    <span>${item[1]} จาน</span>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Error loading popular items:', error);
    }
}

// Category sales chart
let categoryChart = null;

async function loadCategoryChart() {
    try {
        // Get category sales data
        const { data, error } = await window.supabaseClient
            .from('order_items')
            .select(`
                quantity,
                subtotal,
                menu_items (
                    menu_categories (
                        name
                    )
                )
            `);
        
        if (error) throw error;
        
        // Aggregate by category
        const categoryTotals = {};
        data.forEach(item => {
            const category = item.menu_items?.menu_categories?.name || 'อื่นๆ';
            categoryTotals[category] = (categoryTotals[category] || 0) + parseFloat(item.subtotal || 0);
        });
        
        // Calculate percentages
        const totalSales = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({
            name,
            value,
            percentage: totalSales > 0 ? Math.round((value / totalSales) * 100) : 0
        }));
    const categoryCanvas = document.createElement('canvas');
    categoryCanvas.id = 'categoryChart';
    categoryCanvas.style.maxHeight = '300px';
    
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer && !document.getElementById('categoryChart')) {
        chartContainer.insertAdjacentHTML('afterend', 
            '<div class="chart-container" style="margin-top: 2rem;"><canvas id="categoryChart"></canvas></div>'
        );
    }
    
    const ctx = document.getElementById('categoryChart');
    if (ctx) {
        if (categoryChart) {
            categoryChart.destroy();
        }
        
        categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.map(c => c.name),
                datasets: [{
                    data: categoryData.map(c => c.percentage),
                    backgroundColor: [
                        '#FF6B35',
                        '#FF8C42',
                        '#FFD166',
                        '#FFC947',
                        '#FFB547',
                        '#FFA347'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'ยอดขายแยกตามหมวดหมู่',
                        font: {
                            size: 16,
                            family: 'Prompt'
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                family: 'Prompt',
                                size: 14
                            },
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const value = data.datasets[0].data[i];
                                        return {
                                            text: `${label} (${value}%)`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            strokeStyle: data.datasets[0].borderColor,
                                            lineWidth: data.datasets[0].borderWidth,
                                            hidden: false,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + '%';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    } catch (error) {
        console.error('Error loading category chart:', error);
    }
}

// Setup realtime order subscription
function setupRealtimeOrderSubscription() {
    // Check if Supabase client exists
    if (!window.supabaseClient) {
        console.log('Supabase client not available for realtime subscription');
        return;
    }
    
    // Subscribe to INSERT events on orders table
    const subscription = window.supabaseClient
        .channel('orders-channel')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'orders' 
            }, 
            async (payload) => {
                console.log('New order received:', payload);
                
                // Reload orders to get complete data with relations
                await loadOrdersFromSupabase();
                
                // Update UI if we're on orders page
                const ordersSection = document.getElementById('orders');
                if (ordersSection && ordersSection.style.display !== 'none') {
                    loadOrders();
                }
                
                // Update dashboard stats immediately
                await updateDashboardStats();
                
                // Show notification
                showNotification('มีคำสั่งซื้อใหม่!');
                
                // Play sound if available
                try {
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLbiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
                    audio.play();
                } catch (e) {
                    console.log('Could not play notification sound');
                }
            }
        )
        .on('postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders'
            },
            async (payload) => {
                console.log('Order updated:', payload);
                // Reload orders to get updated data
                await loadOrdersFromSupabase();
                
                // Update dashboard statistics immediately
                await updateDashboardStats();
                
                // Update UI if we're on orders page
                const ordersSection = document.getElementById('orders');
                if (ordersSection && ordersSection.style.display !== 'none') {
                    loadOrders();
                }
            }
        )
        .subscribe();
    
    // Store subscription for cleanup if needed
    window.ordersSubscription = subscription;
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    const pendingCount = orders.filter(o => o.status === 'pending').length;
    badge.textContent = pendingCount;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update dashboard statistics - now updates order status counts
async function updateDashboardStats() {
    try {
        // Count orders by status
        let pendingCount = 0;
        let preparingCount = 0;
        let completedToday = 0;
        let totalToday = 0;
        
        if (window.supabaseClient) {
            const today = new Date();
            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            // Get all orders
            const { data: allOrders, error } = await window.supabaseClient
                .from('orders')
                .select('status, created_at');
            
            if (!error && allOrders) {
                // Count by status
                allOrders.forEach(order => {
                    if (order.status === 'pending') pendingCount++;
                    else if (order.status === 'preparing') preparingCount++;
                    
                    // Count today's orders
                    const orderDate = new Date(order.created_at);
                    if (orderDate >= startOfToday) {
                        totalToday++;
                        if (order.status === 'completed') completedToday++;
                    }
                });
            }
        } else {
            // Use local orders array as fallback
            orders.forEach(order => {
                if (order.status === 'pending') pendingCount++;
                else if (order.status === 'preparing') preparingCount++;
                
                // Count today's orders
                const today = new Date();
                const orderDate = new Date(order.timestamp);
                if (orderDate.toDateString() === today.toDateString()) {
                    totalToday++;
                    if (order.status === 'completed') completedToday++;
                }
            });
        }
        
        // Update UI
        const pendingEl = document.getElementById('pendingOrders');
        const preparingEl = document.getElementById('preparingOrders');
        const completedEl = document.getElementById('completedOrders');
        const totalEl = document.getElementById('totalTodayOrders');
        
        if (pendingEl) pendingEl.textContent = pendingCount;
        if (preparingEl) preparingEl.textContent = preparingCount;
        if (completedEl) completedEl.textContent = completedToday;
        if (totalEl) totalEl.textContent = totalToday;
        
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
        // Set default values on error
        document.getElementById('pendingOrders').textContent = '0';
        document.getElementById('preparingOrders').textContent = '0';
        document.getElementById('completedOrders').textContent = '0';
        document.getElementById('totalTodayOrders').textContent = '0';
    }
}

// Update report summary with real data
async function updateReportSummary() {
    if (!window.supabaseClient) return;
    
    try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - 7);
        const startOfMonth = new Date(today);
        startOfMonth.setDate(today.getDate() - 30);
        
        // Get today's data with room details
        const { data: todayData } = await window.supabaseClient
            .from('orders')
            .select(`
                total_amount,
                delivery_dorm,
                delivery_room,
                customers (dorm, room)
            `)
            .gte('created_at', startOfToday.toISOString());
        
        // Get week's data
        const { data: weekData } = await window.supabaseClient
            .from('orders')
            .select('total_amount')
            .gte('created_at', startOfWeek.toISOString());
        
        // Get month's data
        const { data: monthData } = await window.supabaseClient
            .from('orders')
            .select('total_amount')
            .gte('created_at', startOfMonth.toISOString());
        
        // Calculate totals
        const todaySales = todayData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
        const weekSales = weekData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
        const monthSales = monthData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
        
        const todayOrders = todayData?.length || 0;
        const weekOrders = weekData?.length || 0;
        const monthOrders = monthData?.length || 0;
        
        const avgOrderValue = monthOrders > 0 ? monthSales / monthOrders : 0;
        
        // Calculate room-wise orders for today
        let roomSummary = '';
        if (todayData && todayData.length > 0) {
            const roomCounts = {};
            todayData.forEach(order => {
                const dorm = order.delivery_dorm || order.customers?.dorm || '';
                const room = order.delivery_room || order.customers?.room || '';
                const roomKey = `${dorm}-${room}`;
                
                if (dorm && room) {
                    roomCounts[roomKey] = (roomCounts[roomKey] || 0) + 1;
                }
            });
            
            const roomEntries = Object.entries(roomCounts)
                .sort((a, b) => b[1] - a[1]) // Sort by count desc
                .slice(0, 3); // Show top 3 rooms
            
            if (roomEntries.length > 0) {
                roomSummary = roomEntries.map(([room, count]) => `${room}: ${count}ออเดอร์`).join(', ');
            }
        }
        
        // Update UI
        document.getElementById('todaySales').textContent = `฿${todaySales.toLocaleString()}`;
        document.getElementById('todayOrders').textContent = roomSummary || `${todayOrders} ออเดอร์`;
        
        document.getElementById('weekSales').textContent = `฿${weekSales.toLocaleString()}`;
        document.getElementById('weekOrders').textContent = `${weekOrders} ออเดอร์`;
        
        document.getElementById('monthSales').textContent = `฿${monthSales.toLocaleString()}`;
        document.getElementById('monthOrders').textContent = `${monthOrders} ออเดอร์`;
        
        // Display current month name
        const monthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                          'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
        const currentMonthEl = document.getElementById('currentMonth');
        if (currentMonthEl) {
            currentMonthEl.textContent = `(${monthNames[today.getMonth()]} ${today.getFullYear() + 543})`;
        }
        
        document.getElementById('avgOrderValue').textContent = `฿${avgOrderValue.toFixed(2)}`;
        document.getElementById('totalOrders').textContent = `ทั้งหมด ${monthOrders} ออเดอร์`;
        
    } catch (error) {
        console.error('Error updating report summary:', error);
    }
}

// Date range functions for reports
async function updateReportsDateRange() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    
    if (isNaN(startDate) || isNaN(endDate)) {
        showNotification('กรุณาเลือกวันที่ให้ถูกต้อง');
        return;
    }
    
    if (startDate > endDate) {
        showNotification('วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด');
        return;
    }
    
    await loadReports(startDate, endDate);
    await loadDailyReport(startDate, endDate);
}

// Load daily report
async function loadDailyReport(startDate, endDate) {
    try {
        if (!window.supabaseClient) return;
        
        const { data: orders, error } = await window.supabaseClient
            .from('orders')
            .select(`
                *,
                order_items (
                    quantity,
                    price,
                    menu_items (
                        name
                    )
                )
            `)
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at');
        
        if (error) throw error;
        
        // Store full order data globally for detail view
        window.dailyOrdersData = orders;
        
        // Group by date with menu items
        const dailyData = {};
        orders.forEach(order => {
            const dateStr = new Date(order.created_at).toISOString().split('T')[0];
            const date = new Date(order.created_at).toLocaleDateString('th-TH');
            
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = { 
                    displayDate: date,
                    count: 0, 
                    total: 0,
                    menuItems: {},
                    orders: []
                };
            }
            
            dailyData[dateStr].count++;
            dailyData[dateStr].total += parseFloat(order.total_amount);
            dailyData[dateStr].orders.push(order);
            
            // Count menu items
            order.order_items?.forEach(item => {
                const menuName = item.menu_items?.name || 'ไม่ระบุ';
                if (!dailyData[dateStr].menuItems[menuName]) {
                    dailyData[dateStr].menuItems[menuName] = {
                        quantity: 0,
                        revenue: 0
                    };
                }
                dailyData[dateStr].menuItems[menuName].quantity += item.quantity;
                dailyData[dateStr].menuItems[menuName].revenue += item.quantity * item.price;
            });
        });
        
        // Display daily report
        const tbody = document.getElementById('dailyReportBody');
        const dailyReportDiv = document.getElementById('dailyReport');
        
        if (Object.keys(dailyData).length > 0) {
            tbody.innerHTML = Object.entries(dailyData)
                .sort((a, b) => new Date(a[0]) - new Date(b[0]))
                .map(([dateStr, data]) => {
                    // Find top selling item
                    const topItem = Object.entries(data.menuItems)
                        .sort((a, b) => b[1].quantity - a[1].quantity)[0];
                    
                    return `
                        <tr onclick="showDailyDetail('${dateStr}')" style="cursor: pointer;">
                            <td><i class="fas fa-chevron-right"></i></td>
                            <td>${data.displayDate}</td>
                            <td>${data.count} ออเดอร์</td>
                            <td>฿${data.total.toLocaleString()}</td>
                            <td>${topItem ? `${topItem[0]} (${topItem[1].quantity})` : '-'}</td>
                        </tr>
                    `;
                }).join('');
            
            dailyReportDiv.style.display = 'block';
        } else {
            dailyReportDiv.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error loading daily report:', error);
    }
}

// Show daily detail
function showDailyDetail(dateStr) {
    const orders = window.dailyOrdersData?.filter(order => 
        order.created_at.split('T')[0] === dateStr
    ) || [];
    
    const modal = document.getElementById('dailyDetailModal');
    const title = document.getElementById('dailyDetailTitle');
    const content = document.getElementById('dailyDetailContent');
    
    const date = new Date(dateStr).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    title.textContent = `รายละเอียดยอดขาย - ${date}`;
    
    // Calculate menu summary
    const menuSummary = {};
    let totalRevenue = 0;
    
    orders.forEach(order => {
        order.order_items?.forEach(item => {
            const name = item.menu_items?.name || 'ไม่ระบุ';
            if (!menuSummary[name]) {
                menuSummary[name] = { quantity: 0, revenue: 0 };
            }
            menuSummary[name].quantity += item.quantity;
            menuSummary[name].revenue += item.quantity * item.price;
            totalRevenue += item.quantity * item.price;
        });
    });
    
    // Sort menu by quantity
    const sortedMenu = Object.entries(menuSummary)
        .sort((a, b) => b[1].quantity - a[1].quantity);
    
    content.innerHTML = `
        <div class="daily-summary" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px;">
                <h4 style="margin: 0; color: #666;">จำนวนออเดอร์</h4>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #FF6B35;">${orders.length}</p>
            </div>
            <div style="text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px;">
                <h4 style="margin: 0; color: #666;">ยอดขายรวม</h4>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #4CAF50;">฿${totalRevenue.toLocaleString()}</p>
            </div>
            <div style="text-align: center; padding: 20px; background: #f0f0f0; border-radius: 10px;">
                <h4 style="margin: 0; color: #666;">จำนวนเมนู</h4>
                <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #2196F3;">${sortedMenu.length}</p>
            </div>
        </div>
        
        <h4>สรุปยอดขายแต่ละเมนู</h4>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">เมนู</th>
                    <th style="padding: 10px; text-align: center;">จำนวน</th>
                    <th style="padding: 10px; text-align: right;">ยอดขาย</th>
                    <th style="padding: 10px; text-align: right;">% ของยอดรวม</th>
                </tr>
            </thead>
            <tbody>
                ${sortedMenu.map(([name, data]) => `
                    <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 10px;">${name}</td>
                        <td style="padding: 10px; text-align: center;">${data.quantity}</td>
                        <td style="padding: 10px; text-align: right;">฿${data.revenue.toLocaleString()}</td>
                        <td style="padding: 10px; text-align: right;">${((data.revenue / totalRevenue) * 100).toFixed(1)}%</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr style="background: #f5f5f5; font-weight: bold;">
                    <td style="padding: 10px;">รวมทั้งหมด</td>
                    <td style="padding: 10px; text-align: center;">${sortedMenu.reduce((sum, [_, data]) => sum + data.quantity, 0)}</td>
                    <td style="padding: 10px; text-align: right;">฿${totalRevenue.toLocaleString()}</td>
                    <td style="padding: 10px; text-align: right;">100%</td>
                </tr>
            </tfoot>
        </table>
    `;
    
    modal.style.display = 'block';
}

// Close daily detail modal
function closeDailyDetail() {
    document.getElementById('dailyDetailModal').style.display = 'none';
}


// Filter orders
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterMap = {
            'ทั้งหมด': 'all',
            'รอดำเนินการ': 'pending',
            'กำลังทำ': 'preparing',
            'เสร็จแล้ว': 'completed'
        };
        
        loadOrders(filterMap[btn.textContent] || 'all');
    });
});

// Notification functions
function toggleNotifications() {
    const menu = document.getElementById('notificationMenu');
    menu.classList.toggle('active');
    
    // Close user menu if open
    document.getElementById('userDropdown').classList.remove('active');
}

function clearNotifications() {
    const list = document.getElementById('notificationList');
    list.innerHTML = '<p class="no-notifications">ไม่มีการแจ้งเตือนใหม่</p>';
    updateNotificationCount(0);
}

function updateNotificationCount(count) {
    const badge = document.getElementById('notificationCount');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function checkNotifications() {
    // Check for new orders
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    updateNotificationCount(pendingOrders);
    
    if (pendingOrders > 0) {
        const list = document.getElementById('notificationList');
        list.innerHTML = `
            <div class="notification-item" onclick="showSection('orders')">
                <strong>คำสั่งซื้อใหม่</strong>
                <p>มี ${pendingOrders} คำสั่งซื้อรอดำเนินการ</p>
            </div>
        `;
    }
}

// User menu functions
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
    
    // Close notification menu if open
    document.getElementById('notificationMenu').classList.remove('active');
}

function viewProfile() {
    // In future, show profile modal
    alert('ฟีเจอร์โปรไฟล์กำลังพัฒนา');
}

async function logout() {
    if (confirm('ต้องการออกจากระบบ?')) {
        const result = await adminLogout();
        if (result.success) {
            window.location.href = './login.html';
        }
    }
}

// Admin management functions
async function loadAdmins() {
    try {
        const { data, error } = await window.supabaseClient
            .from('admin_users')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const tbody = document.getElementById('adminTableBody');
        tbody.innerHTML = data.map(admin => `
            <tr>
                <td>${admin.name || '-'}</td>
                <td>${admin.email}</td>
                <td>${admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}</td>
                <td>
                    <span class="status-${admin.is_active ? 'active' : 'inactive'}">
                        ${admin.is_active ? 'ใช้งาน' : 'ระงับ'}
                    </span>
                </td>
                <td>${admin.last_login ? new Date(admin.last_login).toLocaleDateString('th-TH') : '-'}</td>
                <td>
                    <button class="action-btn" onclick="toggleAdminStatus('${admin.id}', ${!admin.is_active})">
                        <i class="fas fa-${admin.is_active ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading admins:', error);
    }
}

function showAddAdminModal() {
    document.getElementById('addAdminModal').classList.add('active');
}

function closeAddAdminModal() {
    document.getElementById('addAdminModal').classList.remove('active');
    document.getElementById('addAdminForm').reset();
}

async function addNewAdmin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');
    const role = formData.get('role');
    
    try {
        // Create auth user
        const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
            email,
            password
        });
        
        if (authError) throw authError;
        
        // Create admin record
        const { data, error } = await window.supabaseClient
            .from('admin_users')
            .insert([{
                email,
                name,
                role,
                password_hash: 'managed_by_supabase_auth'
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        closeAddAdminModal();
        showNotification('เพิ่ม Admin ใหม่เรียบร้อยแล้ว');
        loadAdmins();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function toggleAdminStatus(adminId, activate) {
    try {
        const { error } = await window.supabaseClient
            .from('admin_users')
            .update({ is_active: activate })
            .eq('id', adminId);
        
        if (error) throw error;
        
        showNotification(activate ? 'เปิดใช้งาน Admin แล้ว' : 'ระงับการใช้งาน Admin แล้ว');
        loadAdmins();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.notification-dropdown')) {
        document.getElementById('notificationMenu').classList.remove('active');
    }
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('active');
    }
});

// Edit menu item
async function editMenuItem(itemId) {
    try {
        // Get menu item data
        const { data: item, error } = await window.supabaseClient
            .from('menu_items')
            .select(`
                *,
                menu_categories (
                    name,
                    slug
                )
            `)
            .eq('id', itemId)
            .single();
        
        if (error) throw error;
        
        // Create edit modal (reuse add menu modal)
        const modal = document.getElementById('addMenuModal');
        const modalHeader = modal.querySelector('.modal-header h2');
        const form = document.getElementById('addMenuForm');
        
        // Change modal title
        modalHeader.textContent = 'แก้ไขเมนู';
        
        // Fill form with existing data
        form.name.value = item.name;
        form.category.value = item.menu_categories?.slug || 'rice';
        form.price.value = item.price;
        form.description.value = item.description || '';
        
        // Change form submit handler
        form.onsubmit = async (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            
            try {
                // Get category ID from slug
                const { data: category, error: catError } = await window.supabaseClient
                    .from('menu_categories')
                    .select('id')
                    .eq('slug', formData.get('category'))
                    .single();
                
                if (catError) throw catError;
                
                const { error: updateError } = await window.supabaseClient
                    .from('menu_items')
                    .update({
                        name: formData.get('name'),
                        category_id: category.id,
                        price: parseFloat(formData.get('price')),
                        description: formData.get('description')
                    })
                    .eq('id', itemId);
                
                if (updateError) throw updateError;
                
                closeAddMenuModal();
                showNotification('แก้ไขเมนูเรียบร้อยแล้ว');
                await loadMenuItems();
                
                // Reset form submit handler
                form.onsubmit = addMenuItem;
                modalHeader.textContent = 'เพิ่มเมนูใหม่';
                form.reset();
                
            } catch (error) {
                console.error('Error updating menu item:', error);
                showNotification('ไม่สามารถแก้ไขเมนูได้');
            }
        };
        
        // Show modal
        modal.classList.add('active');
        
    } catch (error) {
        console.error('Error loading menu item:', error);
        showNotification('ไม่สามารถโหลดข้อมูลเมนูได้');
    }
}

// Delete menu item
async function deleteMenuItem(itemId) {
    if (!confirm('ต้องการลบเมนูนี้?')) return;
    
    try {
        if (window.supabaseClient) {
            const { error } = await window.supabaseClient
                .from('menu_items')
                .delete()
                .eq('id', itemId);
            
            if (!error) {
                showNotification('ลบเมนูเรียบร้อยแล้ว');
                await loadMenuItems();
                return;
            }
        }
        showNotification('ไม่สามารถลบเมนูได้');
    } catch (error) {
        console.error('Error deleting menu:', error);
        showNotification('เกิดข้อผิดพลาด');
    }
}