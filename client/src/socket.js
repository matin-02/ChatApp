import { io } from 'socket.io-client';

// Use the VITE_SOCKET_URL environment variable
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(SOCKET_URL);

export default socket;
