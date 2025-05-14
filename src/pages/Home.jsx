import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

function Home() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("submitted");
                }}
                className="min-h-screen flex items-center justify-center bg-base-100"
            >
                <div className="bg-base-200 p-6 rounded-lg space-y-6 w-1/3">
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
                                type="email"
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
                </div>
            </form>
        </>
    )
}

export default Home