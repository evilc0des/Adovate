"use client"
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { ChartBarIcon, CogIcon, TvIcon } from '@heroicons/react/24/outline';


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
        { name: 'Dashboard', link: '/', icon: TvIcon },
        { name: 'Reports', link: '/reports', icon: ChartBarIcon },
        { name: 'Settings', link: '/settings', icon: CogIcon },
    ]);

    return (
        <div className={`sidebar h-screen bg-background-alt text-white ${isLoggedIn ? "w-16" : "w-1/2"}`}>
            {isLoggedIn ? (
                <>
                    <div className="brand p-3">
                        <Image
                            className=""
                            src="/logo-small.png"
                            alt="Adovate logo"
                            width={50}
                            height={50}
                            priority
                        />
                    </div>
                    <div className="menu">
                        <ul className='flex flex-col items-stretch gap-4 mt-8'>
                            {menuItems.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <li className="hover:bg-gray-700 text-center p-4" key={index}>
                                        <a href={item.link}><Icon className="size-8 text-white" /></a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col items-center justify-center">
                    <h2>Welcome to the App</h2>
                    <p>Please log in to continue</p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;