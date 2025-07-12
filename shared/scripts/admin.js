// Sample order data
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
    },
    {
        id: 'ORD002', 
        customer: { name: 'สมหญิง', phone: '082-345-6789', dorm: 'หอ B', room: '305' },
        items: [
            { name: 'ผัดไทยกุ้งสด', quantity: 2, price: 45 }
        ],
        total: 90,
        status: 'preparing',
        timestamp: new Date(Date.now() - 900000)
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    setupNavigation();
    setupRealtimeUpdates();
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

function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
    
    // Load section specific data
    switch(sectionId) {
        case 'orders':
            loadOrders();
            break;
        case 'menu':
            loadMenuItems();
            break;
        case 'reports':
            loadReports();
            break;
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
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    order.status = newStatus;
    loadOrders();
    
    // Send notification
    showNotification(`อัพเดทสถานะ ${order.id} เป็น ${getStatusText(newStatus)}`);
    
    // In real app, would update backend and send LINE notification
    if (newStatus === 'completed') {
        sendLineNotification(orderId);
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
function loadMenuItems() {
    const menuList = document.getElementById('menuList');
    
    // Use sample menu data
    const menuItems = [
        { id: 1, name: 'ข้าวผัดกุ้ง', category: 'rice', price: 50, emoji: '🍤' },
        { id: 2, name: 'ผัดไทยกุ้งสด', category: 'noodle', price: 45, emoji: '🍜' },
        { id: 3, name: 'ชาเย็น', category: 'drink', price: 25, emoji: '🧋' }
    ];
    
    menuList.innerHTML = menuItems.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-info">
                <div>
                    <h4>${item.name}</h4>
                    <p>฿${item.price} - ${getCategoryText(item.category)}</p>
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

function addMenuItem(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newItem = {
        name: formData.get('name'),
        category: formData.get('category'),
        price: formData.get('price'),
        description: formData.get('description'),
        emoji: formData.get('emoji')
    };
    
    // In real app, would save to backend
    console.log('New menu item:', newItem);
    
    closeAddMenuModal();
    showNotification('เพิ่มเมนูใหม่เรียบร้อยแล้ว');
    loadMenuItems();
}

// Reports
let salesChart = null;

function loadReports() {
    // Generate sample data for the last 7 days
    const labels = [];
    const salesData = [];
    const ordersData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric' }));
        
        // Generate random sales data
        salesData.push(Math.floor(Math.random() * 3000) + 1000);
        ordersData.push(Math.floor(Math.random() * 30) + 10);
    }
    
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
                    data: ordersData,
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
    loadCategoryChart();
    
    // Load popular items
    const popularList = document.querySelector('.popular-list');
    if (popularList) {
        popularList.innerHTML = `
            <div class="popular-item">
                <span>1. ข้าวผัดกุ้ง</span>
                <span>150 จาน</span>
            </div>
            <div class="popular-item">
                <span>2. ผัดไทยกุ้งสด</span>
                <span>120 จาน</span>
            </div>
            <div class="popular-item">
                <span>3. กะเพราหมูสับ</span>
                <span>95 จาน</span>
            </div>
            <div class="popular-item">
                <span>4. ข้าวผัดหมู</span>
                <span>87 จาน</span>
            </div>
            <div class="popular-item">
                <span>5. ชาเย็น</span>
                <span>156 แก้ว</span>
            </div>
        `;
    }
}

// Category sales chart
let categoryChart = null;

function loadCategoryChart() {
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
                labels: ['ข้าว', 'เส้น', 'กับข้าว', 'เครื่องดื่ม'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#FF6B35',
                        '#FF8C42',
                        '#FFD166',
                        '#FFC947'
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
}

// Realtime updates simulation
function setupRealtimeUpdates() {
    // Simulate new orders every 30 seconds
    setInterval(() => {
        const random = Math.random();
        if (random > 0.7) {
            const newOrder = {
                id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
                customer: {
                    name: `ลูกค้า ${orders.length + 1}`,
                    phone: '08X-XXX-XXXX',
                    dorm: 'หอ C',
                    room: Math.floor(Math.random() * 500) + 100
                },
                items: [
                    { name: 'ข้าวผัดหมู', quantity: 1, price: 45 }
                ],
                total: 45,
                status: 'pending',
                timestamp: new Date()
            };
            
            orders.unshift(newOrder);
            loadOrders();
            showNotification('มีคำสั่งซื้อใหม่!');
            updateNotificationBadge();
        }
    }, 30000);
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