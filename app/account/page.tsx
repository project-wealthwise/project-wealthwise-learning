'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { auth, db } from '@/lib/firebase';
import { doc, DocumentData, getDoc, updateDoc } from 'firebase/firestore';
import { Modal } from '@/components/modal';
import { openModal } from '@/lib/modal';

export default function AccountPage() {
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
        if (!authLoading && !user) router.replace('/login');
    }, [authLoading, router, user]);

    if (authLoading || !user) {
        return (
            <>
                <Header />
                {/* <p>Loading...</p> */}
            </>
        );
    }

    return (
        <div className="root" >
            <Header />
            <div className="account-container">
                <h1 className="font-title username">{user.displayName}</h1>
                <p className="font-medium email">{user.email}</p>
                <Image 
                    className="account-pfp" 
                    src={user.pfpUrl} 
                    alt="Profile Picture" 
                    width={100} 
                    height={100} 
                />
                <div className="account-roles"></div>
                <button className="pww-button button-green button-small" onClick={() => {
                    openModal('edit-profile-modal');
                }}>
                    Edit Profile
                </button>
            </div>
            <Modal modalId='edit-profile-modal'>
                <div className="edit-profile-container">
                    <h2 className="font-title">Edit Profile</h2>
                    <form className="edit-profile-form" onSubmit={async (e) => {
                        e.preventDefault();
                        const displayName = (document.getElementById('displayName') as HTMLInputElement).value;
                        const pfpUrl = (document.getElementById('pfpUrl') as HTMLInputElement).value;
                        if (auth.currentUser) {
                            await updateProfile(auth.currentUser, {
                                displayName,
                                photoURL: pfpUrl,
                            });
                        }

                        await updateDoc(doc(db, 'users', auth.currentUser?.uid ?? ''), {
                            displayName,
                            pfpUrl,
                        });

                        setUser({
                            ...user,
                            displayName,
                            pfpUrl,
                        });
                        (document.querySelector('.modal-container') as HTMLElement).style.display = 'none';
                    }}>
                        <label htmlFor="displayName">Display Name</label>
                        <input 
                            type="text" 
                            id="displayName" 
                            className="pww-input form-input" 
                            defaultValue={user.displayName} 
                        />
                        <label htmlFor="pfpUrl">Profile Picture URL</label>
                        <input 
                            type="text" 
                            id="pfpUrl" 
                            className="pww-input form-input" 
                            defaultValue={user.pfpUrl} 
                        />
                        <button type="submit" className="pww-button button-green button-small">Save Changes</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}