'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import Header from '@/components/header';
import { auth, db } from '@/lib/firebase';
import { doc, DocumentData, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const editorRoles = ['admin', 'curriculum-developer'];

export default function CurriculumPage() {
    const router = useRouter();
    const [user, setUser] = useState<DocumentData | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            const userData = (await getDoc(doc(db, 'users', currentUser?.uid ?? ''))).data();
            setUser(userData ?? null);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login');
        }
        if (!authLoading && user && !editorRoles.some(role => user.roles?.includes(role))) {
            router.replace('/account');
        }
    }, [authLoading, router, user]);

    if (authLoading || !user) {
        return (
            <>
                <Header />
                {/* <p>Loading...</p> */}
            </>
        );
    }

    /*

    */

    return (
        <div className="root">
            <link rel="stylesheet" href="/css/curriculum.css" />
            <Header />
            <div className="curriculum-container">
                test
            </div>
        </div>
    )
}