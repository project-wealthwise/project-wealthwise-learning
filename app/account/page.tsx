'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { auth } from '@/lib/firebase';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
    }, [authLoading, router, user]);

    if (authLoading || !user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="root">
            <Header />
            <h1 className="font-title">
                Account Page
            </h1>
        </div>
    );
}