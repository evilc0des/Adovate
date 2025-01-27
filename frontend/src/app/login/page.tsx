"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';



const LoginPage: React.FC = () => {
    const { user, login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (user) {
            router.push(searchParams.get('redirect') || '/');
        }
    }, [user, router]);

    const handleEmailLogin = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle email login logic here
        const email: string = ((event.target as HTMLFormElement).elements[0] as HTMLInputElement).value;
        const password: string = ((event.target as HTMLFormElement).elements[1] as HTMLInputElement).value;

        login(email, password).then(() => {
            router.push('/');
        }).catch((error) => {
            console.error('Error logging in:', error);
        });

    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
        loginWithGoogle().then(() => {
            router.push('/');
        }).catch((error) => {
            console.error('Error logging in:', error);
        });
    };

    return (
        <div className="flex flex-col justify-center h-screen p-16 pl-32 text-gray-700">
            <Image
                className=""
                src="/logo.png"
                alt="Next.js logo"
                width={180}
                height={20}
                priority
            />
            <h1 className="text-4xl font-bold">Welcome back!</h1>
            <p className='mb-8'>Analyse your Ad Performance with the power of AI</p>
            <form onSubmit={handleEmailLogin} className="flex flex-col items-stretch w-72">
                <input type="email" placeholder="Email" required className="mb-2 p-2 border rounded" />
                <input type="password" placeholder="Password" required className="mb-2 p-2 border rounded" />
                <button type="submit" className="p-2 bg-background-alt text-white rounded mt-2 uppercase">Login</button>
            </form>
            <div className='flex justify-center w-72 gap-2'>
                <button onClick={handleGoogleLogin} className="p-2 border-2 border-background-alt text-background-alt rounded mt-2 grow uppercase">Google</button>
                <button onClick={handleGoogleLogin} className="p-2 border-2 border-background-alt text-background-alt rounded mt-2 grow uppercase">Facebook</button>
            </div>
            <div className='w-72 text-center'>
                <p className="text-sm mt-4">Don&apos;t have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;