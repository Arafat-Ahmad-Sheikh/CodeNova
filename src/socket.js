import { io } from 'socket.io-client';

export const initsocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempts: 'infinity',
    timeout: 10000, // before connect_error and connect_timeout are emitted
    transports: ['websocket'], // use WebSocket transport
  };

  // ✅ Correct way to access env variable in Vite
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  console.log("Backend URL:", backendURL);

  return io(backendURL, options);
};
