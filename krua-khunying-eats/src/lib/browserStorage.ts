// Browser-specific storage utilities
const BROWSER_ID_KEY = 'krua_khunying_browser_id';
const ORDER_IDS_PREFIX = 'krua_khunying_orders_';

// Generate or get browser ID
export const getBrowserId = (): string => {
  let browserId = localStorage.getItem(BROWSER_ID_KEY);
  
  if (!browserId) {
    // Generate unique browser ID
    browserId = `browser_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(BROWSER_ID_KEY, browserId);
  }
  
  return browserId;
};

// Save order ID for this browser
export const saveOrderId = (orderId: string): void => {
  const browserId = getBrowserId();
  const storageKey = `${ORDER_IDS_PREFIX}${browserId}`;
  
  const savedOrderIds = localStorage.getItem(storageKey);
  const orderIds = savedOrderIds ? JSON.parse(savedOrderIds) : [];
  
  if (!orderIds.includes(orderId)) {
    orderIds.push(orderId);
    localStorage.setItem(storageKey, JSON.stringify(orderIds));
  }
};

// Get all order IDs for this browser
export const getOrderIds = (): string[] => {
  const browserId = getBrowserId();
  const storageKey = `${ORDER_IDS_PREFIX}${browserId}`;
  
  const savedOrderIds = localStorage.getItem(storageKey);
  return savedOrderIds ? JSON.parse(savedOrderIds) : [];
};

// Remove completed or cancelled orders
export const cleanupCompletedOrders = (completedOrderIds: string[]): void => {
  const browserId = getBrowserId();
  const storageKey = `${ORDER_IDS_PREFIX}${browserId}`;
  
  const savedOrderIds = localStorage.getItem(storageKey);
  if (!savedOrderIds) return;
  
  const orderIds = JSON.parse(savedOrderIds);
  const activeOrderIds = orderIds.filter((id: string) => !completedOrderIds.includes(id));
  
  localStorage.setItem(storageKey, JSON.stringify(activeOrderIds));
};

// Clear all orders for this browser (for testing)
export const clearAllOrders = (): void => {
  const browserId = getBrowserId();
  const storageKey = `${ORDER_IDS_PREFIX}${browserId}`;
  localStorage.removeItem(storageKey);
};

// Get cart key for this browser
export const getCartKey = (): string => {
  const browserId = getBrowserId();
  return `cart_${browserId}`;
};

// Migrate old data to browser-specific storage
export const migrateOldData = (): void => {
  // Migrate old order IDs
  const oldOrderIds = localStorage.getItem('userOrderIds');
  if (oldOrderIds) {
    const browserId = getBrowserId();
    const storageKey = `${ORDER_IDS_PREFIX}${browserId}`;
    
    // Only migrate if browser-specific storage doesn't exist
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, oldOrderIds);
    }
    
    // Remove old key
    localStorage.removeItem('userOrderIds');
  }
  
  // Migrate old cart
  const oldCart = localStorage.getItem('cart');
  if (oldCart) {
    const cartKey = getCartKey();
    
    // Only migrate if browser-specific cart doesn't exist
    if (!localStorage.getItem(cartKey)) {
      localStorage.setItem(cartKey, oldCart);
    }
    
    // Remove old cart
    localStorage.removeItem('cart');
  }
};