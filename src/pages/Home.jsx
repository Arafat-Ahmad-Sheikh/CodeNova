import React from 'react'
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

function Home() {
    const [showPassword, setShowPassword] = useState(false);
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

    return (
        <>
            <div className="min-h-screen w-full flex flex-col" // Ensures full viewport coverage
                style={{ minHeight: '230vh' }}>
                {/* Home Section */}
                <div
                    ref={homeRef}
                    className="relative w-full h-screen transition-opacity duration-300 ease-out"
                    style={{
                        opacity: 1 - scrollY / 1200,
                    }}
                >
                    <div className="diff aspect-[16/9] relative overflow-hidden">
                        <div className="diff-item-1">
                            <div className="bg-primary text-primary-content grid place-content-center text-9xl font-black">
                                HOME
                            </div>
                        </div>
                        <div className="diff-item-2">
                            <div className="bg-base-200 grid place-content-center text-9xl font-black">
                                CodeNova
                            </div>
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
                    style={{
                        opacity: Math.min((scrollY - 500) / 400, 1),
                        position: "relative",
                        top: "50vh",
                    }}
                >
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log("submitted");
                        }}
                        className="bg-base-200 p-6 rounded-lg space-y-6 mb-32 w-full max-w-2xl shadow-md"
                    >
                        {/* Logo & Title */}
                        <div className="flex items-center space-x-4">
                            <img
                                src="src/assets/logo.png"
                                className="w-16 rounded-lg"
                                alt="CodeNova Logo"
                            />
                            <h1 className="text-2xl font-bold text-base-content">CodeNova</h1>
                        </div>

                        {/* USERNAME */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">USERNAME</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        {/* ROOM ID / PASSWORD */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">ROOM ID</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pl-10 pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5 text-base-content/40" />
                                    ) : (
                                        <EyeOff className="h-5 w-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="btn btn-primary w-full">
                            JOIN
                        </button>
                        <div className="text-center">
                            <p className="text-base-content/60 pt-4">
                                Don&apos;t have an invite?{" "}
                                <a href="" className="link link-primary">
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