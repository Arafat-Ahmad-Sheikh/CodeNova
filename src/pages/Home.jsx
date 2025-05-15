import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { v4 as uuid } from "uuid";
import { useToast } from "../../components/ToastContext";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [roomId, setRoomId] = useState('');
  const [Username, setUsername] = useState('');
  const homeRef = useRef(null);
  const loginRef = useRef(null);
  const { showToast } = useToast(); //  use toast context
  const handler = (e) => {
    if (e.key === "Enter") {
      JoinRoom();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    showToast("success", `Room ID created successfully: ${id}`);
    console.log("New room ID:", id);
  };

  const JoinRoom = () => {

    if (!Username) {
      showToast("warning", "Please enter a username");
      return;
    }
    if (!roomId) {
      showToast("warning", "Please enter a room ID");
      return;
    }
    console.log("Joining room with ID:", roomId);
    navigate(`/editor/${roomId}`, { state: { roomId, username: Username } });
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-col" style={{ minHeight: '230vh' }}>
        {/* HOME section */}
        <div
          ref={homeRef}
          className="relative w-full h-screen transition-opacity duration-300 ease-out"
          style={{ opacity: 1 - scrollY / 1200 }}
        >
          <div className="diff aspect-[16/9] relative overflow-hidden">
            <div className="diff-item-1">
              <div className="bg-primary text-primary-content grid place-content-center text-9xl font-black">HOME</div>
            </div>
            <div className="diff-item-2">
              <div className="bg-base-200 grid place-content-center text-9xl font-black">CodeNova</div>
            </div>
            <div className="diff-resizer z-30"></div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30">
            <button
              onClick={() => loginRef.current.scrollIntoView({ behavior: "smooth" })}
              className="btn btn-outline btn-info btn-wide btn-xl"
            >
              Join Room
            </button>
          </div>
          <div style={{ height: "100vh" }}>
            <p className="text-center mt-20 text-xl">Scroll down to Join Room</p>
          </div>
        </div>

        {/* Login Section */}
        <div
          ref={loginRef}
          className="w-full flex justify-center items-center transition-opacity duration-500 ease-out"
          style={{ opacity: Math.min((scrollY - 500) / 400, 1), position: "relative", top: "50vh" }}
        >
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-base-200 p-6 rounded-lg space-y-6 mb-32 w-full max-w-2xl shadow-md"
          >
            <div className="flex items-center space-x-4">
              <img src="src/assets/logo.png" className="w-16 rounded-lg" alt="CodeNova Logo" />
              <h1 className="text-2xl font-bold text-base-content">CodeNova</h1>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">USERNAME</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyUp={handler}
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">ROOM ID</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyUp={handler}
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye className="h-5 w-5 text-base-content/40" /> : <EyeOff className="h-5 w-5 text-base-content/40" />}
                </button>
              </div>
            </div>

            <button onClick={JoinRoom} type="submit" className="btn btn-primary w-full">
              JOIN
            </button>
            <div className="text-center">
              <p className="text-base-content/60 pt-4">
                Don&apos;t have an invite?{" "}
                <a onClick={createNewRoom} href="#" className="link link-primary">
                  Create new room
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
