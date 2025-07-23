// Order status utilities
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
export type SimplifiedStatus = 'pending' | 'preparing' | 'completed';

// Map detailed status to simplified status
export const getSimplifiedStatus = (status: OrderStatus): SimplifiedStatus => {
  switch (status) {
    case 'pending':
    case 'confirmed':
      return 'pending';
    case 'preparing':
    case 'ready':
    case 'delivering':
      return 'preparing';
    case 'completed':
    case 'cancelled':
      return 'completed';
    default:
      return 'pending';
  }
};

// Get display text for simplified status
export const getSimplifiedStatusText = (status: OrderStatus): string => {
  const simplified = getSimplifiedStatus(status);
  const statusMap: { [key in SimplifiedStatus]: string } = {
    'pending': 'รอคิว',
    'preparing': 'กำลังทำ',
    'completed': 'เสร็จแล้ว'
  };
  return statusMap[simplified];
};

// Get color for simplified status
export const getSimplifiedStatusColor = (status: OrderStatus): string => {
  const simplified = getSimplifiedStatus(status);
  switch (simplified) {
    case 'pending':
      return 'bg-yellow-500';
    case 'preparing':
      return 'bg-orange-500';
    case 'completed':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

// Get icon for simplified status
export const getSimplifiedStatusIcon = (status: OrderStatus): string => {
  const simplified = getSimplifiedStatus(status);
  switch (simplified) {
    case 'pending':
      return 'Clock';
    case 'preparing':
      return 'ChefHat';
    case 'completed':
      return 'CheckCircle';
    default:
      return 'Clock';
  }
};