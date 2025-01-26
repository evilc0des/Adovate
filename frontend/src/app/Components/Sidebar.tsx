"use client"
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const Sidebar: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        if (!user) {
            router.push(`/login?redirect=${pathname}`);
        }
    }, [user, router]);

    const isLoggedIn = !!user;
    const [menuItems] = useState([
        { name: 'Dashboard', link: '/dashboard' },
        { name: 'Reports', link: '/reports' },
        { name: 'Settings', link: '/settings' },
    ]);

    return (
        <div className={`sidebar h-screen bg-background-alt text-white ${isLoggedIn ? "w-16" : "w-1/2"}`}>
            <div className="brand">
                <h1>Brand Name</h1>
            </div>
            {isLoggedIn ? (
                <div className="menu">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <a href={item.link}>{item.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="hero-text">
                    <h2>Welcome to the App</h2>
                    <p>Please log in to continue</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;