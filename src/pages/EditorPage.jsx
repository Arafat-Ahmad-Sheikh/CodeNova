import React, { useState, useEffect, useRef } from 'react';
import logo from "../assets/logo.png";
import Client from '../../components/Client';
import Editor from '../../components/Editor';
import ACTIONS from '../action';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { initsocket } from '../socket';
import { useToast } from '../../components/ToastContext';

function EditorPage() {
  const [scrollY, setScrollY] = useState(0);
  const homeRef = useRef(null);
  const loginRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigate = useNavigate();
  const { roomId } = useParams();
  const { showToast } = useToast();
  const socketInitialized = useRef(false);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (socketInitialized.current) return;  // Prevent double init
    socketInitialized.current = true;
    const init = async () => {
      socketRef.current = await initsocket();
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      function handleError(err) {
        console.log("socket connection failed", err);
        showToast("error", "Socket connection failed, try again later");
        reactNavigate("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username || `Anonymous-${Math.floor(Math.random() * 1000)}`
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          showToast("success", `${username} has joined the room`);
          console.log(`${username} has joined the room`);
        }

        // Sanitize usernames to be strings
        const sanitizedClients = clients.map(client => ({
          ...client,
          username: typeof client.username === 'string' ? client.username : JSON.stringify(client.username)
        }));

        setClients(sanitizedClients);
      });
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        showToast("success", `${username} has left the room`);
        setClients(prev => prev.filter(client => client.socketId !== socketId));
      });
    };
    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      showToast("success", "Room ID copied to clipboard");
    } catch (error) {
      console.error("Failed to copy room ID:", error);
      showToast("error", "Failed to copy Room ID");
    }

  }
  function leaveRoom() {
    if (socketRef.current) {
      socketRef.current.disconnect(); // disconnects the socket
    }
    reactNavigate("/"); // navigate away
  }


  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <div className="w-[23%] bg-primary text-primary-content flex flex-col justify-between p-4">
          <div>
            {/* Logo Section */}
            <div className="flex items-center space-x-4 mb-6">
              <img src={logo} alt="CodeNova_LOGO" className="w-10 h-10" />
              <h1 className="text-2xl font-bold text-base-content">CodeNova</h1>
            </div>

            {/* Connected Users */}
            <h3 className="text-lg font-semibold mb-2">Connected</h3>
            <div className="flex flex-col space-y-2 overflow-y-auto max-h-[60vh] pr-2">
              {
                clients.map((client) => (
                  <Client key={client.socketId} username={client.username} />
                ))
              }
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col space-y-2 pt-4">
            <button className="btn btn-outline btn-accent font-bold" onClick={copyRoomId}>COPY ROOM ID</button>
            <button className="btn btn-outline btn-error font-bold" onClick={leaveRoom}>LEAVE ROOM</button>
          </div>
        </div>

        {/* Editor Panel */}
        <div
          className="flex-1 min-w-0 bg-base-200 flex items-center justify-center p-4"
          style={{ paddingRight: '2%' }}
        >
          <div className="max-w-full h-100vh text-center w-full">
            <Editor socketRef={socketRef} roomId={roomId} />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditorPage;
