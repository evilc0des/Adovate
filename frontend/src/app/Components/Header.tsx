"use client"
import { useAuth } from '@/context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    return (
        <header className="p-4 flex justify-end items-center gap-4">
            {isUserMenuOpen && <>
                <p className="text-yellow-600 text-sm">{user?.email}</p>
                <p className="uppercase text-sm hover:text-accent cursor-pointer"
                    onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                    }}>Logout</p>
            </>}
            { user && <UserCircleIcon onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="size-10 hover:text-accent cursor-pointer" />}
        </header>
    );
};

export default Header;