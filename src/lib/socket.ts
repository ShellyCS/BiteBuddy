import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  autoConnect: false,
});

export const connectSocket = () => {
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const joinRestaurant = (restaurantId: string) => {
  socket.emit('join_restaurant', restaurantId);
};

export const onOrderReceived = (callback: (order: any) => void) => {
  socket.on('order_received', callback);
};

export const onOrderUpdated = (callback: (data: any) => void) => {
  socket.on('order_updated', callback);
};

export const emitNewOrder = (order: any) => {
  socket.emit('new_order', order);
};

export const emitOrderStatusUpdate = (data: any) => {
  socket.emit('order_status_update', data);
};

export default socket;