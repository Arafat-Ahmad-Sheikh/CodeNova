import React, { useState, useEffect, useRef } from 'react';
import logo from "../assets/logo.png";
import Client from '../../components/Client';
import Editor from '../../components/Editor';

function Home() {
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

  const [clients, setClients] = useState([
    { socketId: "123", username: "User1" },
    { socketId: "456", username: "User2" },
  ]);

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
            <button className="btn btn-outline btn-accent font-bold">COPY ROOM ID</button>
            <button className="btn btn-outline btn-error font-bold">LEAVE ROOM</button>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 min-w-0 bg-base-200 flex items-center justify-center p-4"
         style={{ paddingRight: '50%' }}>
          <div className="max-w-full text-center w-full">
          <Editor />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
