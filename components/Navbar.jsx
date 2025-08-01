import { Link } from "react-router-dom";
import { LogOut, CodeXml, Settings, User } from "lucide-react";
import React from 'react'

const Navbar = () => {
    // importing authUser variable and logout function from useAuthstor
    return (
        <header
            className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg " //bg-base-100/80
        >
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <CodeXml/>
                            </div>
                            <h1 className="text-lg font-bold">CodeNova</h1>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to={"/settings"}
                            className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden sm:inline">Settings</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>

    );
};
export default Navbar;