import Navbar from "../../components/Navbar"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

function Home() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <div className="diff aspect-[16/9]">
                <div className="diff-item-1">
                    <div className="bg-primary text-primary-content grid place-content-center text-9xl font-black">
                        HOME
                    </div>
                </div>
                <div className="diff-item-2">
                    <div className="bg-base-200 grid place-content-center text-9xl font-black">CodeNova</div>
                </div>
                <div className="diff-resizer"></div>
            </div>
            <form
                onSubmit={() => {
                    console.log("submitted");
                }}
                className="bg-slate-900 p-10 rounded-lg space-y-6 w-1/4 mx-auto my-10"
            >
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
                            className="bg-slate-900 input input-bordered w-full pl-10"
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
                        {/* Lock icon */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-base-content/40" />
                        </div>

                        {/* Input with padding-right for eye */}
                        <input
                            type={showPassword ? "text" : "password"}
                            className="bg-slate-900 input input-bordered w-full pl-10 pr-10"
                            placeholder="••••••••"
                        />

                        {/* Eye toggle icon */}
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
            </form>
        </>
    )
}

export default Home