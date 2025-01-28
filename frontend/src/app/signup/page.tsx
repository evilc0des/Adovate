"use client"
import React, { useEffect } from 'react';
import Image from "next/image";
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { sendEmailVerification, signOut } from 'firebase/auth';



const LoginPage: React.FC = () => {
    const { user, signup, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showVerifyEmail, setShowVerifyEmail] = React.useState(false);
    const [isSigningUp, setIsSigningUp] = React.useState(false);

    useEffect(() => {
        if (user && !showVerifyEmail && !isSigningUp) {
            router.push(searchParams.get('redirect') || '/');
        }
    }, [user, router]);

    const validatePassword = (event: React.FormEvent) => {
        const password: string = ((event.target as HTMLFormElement).elements[1] as HTMLInputElement).value;
        const confirmPassword: string = ((event.target as HTMLFormElement).elements[2] as HTMLInputElement).value;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSignup = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle email signup logic here
        const email: string = ((event.target as HTMLFormElement).elements[0] as HTMLInputElement).value;
        const password: string = ((event.target as HTMLFormElement).elements[1] as HTMLInputElement).value;

        if (!validatePassword(event)) return;

        setIsSigningUp(true);
        signup(email, password).then((userCred) => {
            const user = userCred.user;
            sendEmailVerification(user).then(() => {
                setShowVerifyEmail(true);
                setIsSigningUp(false);
                logout();
            }).catch((error) => {
                console.error('Error sending email verification:', error);
            });
        }).catch((error) => {
            console.error('Error signing up:', error);
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
            {!showVerifyEmail ? <>
                <h1 className="text-4xl font-bold mb-2">Welcome Stranger!</h1>
                <p className='mb-8'>Analyse your Ad Performance with the power of AI.<br/>Sign up Now to get Started.</p>
                <form onSubmit={handleSignup} className="flex flex-col items-stretch w-72">
                    <input type="email" placeholder="Email" required className="mb-2 p-2 border rounded" />
                    <input type="password" placeholder="Password" required className="mb-2 p-2 border rounded" />
                    <input type="password" placeholder="Confirm Password" required className="mb-2 p-2 border rounded" />
                    <button type="submit" className="p-2 bg-background-alt text-white rounded mt-2 uppercase">Signup</button>
                </form>
                <div className='w-72 text-center'>
                    <p className="text-sm mt-4">Already have an account? <span onClick={() => router.push('/login')} className="text-blue-500 cursor-pointer hover:font-semibold">Login</span></p>
                </div>
            </> :
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-4">One last step to get you started with your new Superpower!!</h1>
                <p className='mb-8'>We have sent you an email to verify your account. Please check your inbox and click on the link to verify your account.</p>
            </div>}
        </div>
    );
};

export default LoginPage;