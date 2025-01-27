"use client"
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { ChartBarIcon, CogIcon, TvIcon } from '@heroicons/react/24/outline';
import { Fade } from 'react-slideshow-image';

import 'react-slideshow-image/dist/styles.css'


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

    const fadeImages = [
        {
            url: 'https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
            caption: 'First Slide'
          },
          {
            url: 'https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80',
            caption: 'Second Slide'
          },
          {
            url: 'https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
            caption: 'Third Slide'
          },
    ];

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
                <div className="h-full w-full flex flex-col items-center justify-center overflow-hidden relative">
                    <div className="absolute bottom-10 right-0 p-8 pr-24 w-1/2 bg-background-alt text-left z-10">
                        <h2 className="text-2xl">Unlock the Power of Your Ad Data</h2>
                        <p className="text-sm">Supercharge your ad strategy with powerful insights. Discover high-performing keywords, and optimize like never before. The future of smarter advertising starts here.</p>
                    </div>
                    <div className="slide-container w-[180%]">
                        <Fade
                            arrows={false}
                        >
                            {fadeImages.map((fadeImage, index) => (
                                <div key={index}>
                                    <img style={{ width: '150%' }} src={fadeImage.url} />
                                    <h2>{fadeImage.caption}</h2>
                                </div>
                            ))}
                        </Fade>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;