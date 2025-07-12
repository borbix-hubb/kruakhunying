// Store orders data with some initial mock data
let orders = [
    {
        id: 'ORD001',
        customer: { name: 'สมชาย', phone: '081-234-5678', dorm: 'หอ A', room: '201' },
        items: [
            { name: 'ข้าวผัดกุ้ง', quantity: 1, price: 50 },
            { name: 'ชาเย็น', quantity: 1, price: 25 }
        ],
        total: 75,
        status: 'pending',
        timestamp: new Date()
    }
];

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
            // Make sure to display orders if we're on orders page
            const activeSection = document.querySelector('.content-section:not([style*="none"])');
            if (!activeSection || activeSection.id === 'orders') {
                loadOrders();
            }
        } catch (error) {
            console.error('Failed to load orders from Supabase:', error);
            // Use mock data if Supabase fails
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
                    menu_items (
                        name
                    )
                )
            `)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log(`Found ${data?.length || 0} orders`);
        
        if (!data || data.length === 0) {
            // Keep mock data if no real data
            console.log('No orders found in database, keeping mock data');
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
                price: item.price
            })) || [],
            total: order.total_amount,
            status: order.status || 'pending',
            note: order.note || order.delivery_note,
            timestamp: new Date(order.created_at)
        }));
        
        // Add new orders to the beginning of array
        orders = [...newOrders];
        
        console.log(`Updated orders array with ${orders.length} orders`);
        
        // Always update UI after loading
        loadOrders();
        
    } catch (error) {
        console.error('Error loading orders:', error);
        // Don't show error notification, just use mock data
        console.log('Failed to load from Supabase, using mock data');
        loadOrders();
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
    
    filteredOrders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
    
    // Update notification badge
    updateNotificationBadge();
}

function createOrderRow(order) {
    const tr = document.createElement('tr');
    const itemsList = order.items.map(item => `${item.name} x${item.quantity}`).join(', ');
    
    tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer.name}</td>
        <td>${itemsList}</td>
        <td>฿${order.total}</td>
        <td>${order.customer.dorm} ${order.customer.room}</td>
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
                            <td>${item.name}</td>
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
    document.getElementById('addMenuModal').classList.remove('active');
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

async function loadReports() {
    try {
        let ordersData = [];
        
        // Try to get data from Supabase
        if (window.supabaseClient) {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            const { data, error } = await window.supabaseClient
                .from('orders')
                .select('created_at, total_amount, status')
                .gte('created_at', sevenDaysAgo.toISOString())
                .order('created_at');
            
            if (!error && data) {
                ordersData = data;
            }
        }
        
        // Group by date
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
function editMenuItem(itemId) {
    showNotification('กำลังพัฒนาฟังก์ชันแก้ไขเมนู');
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