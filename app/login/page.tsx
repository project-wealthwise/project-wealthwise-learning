"use client";

import { useEffect, useState } from "react";
import {
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    signInWithPopup,
    browserLocalPersistence,
    User,
    UserCredential,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Header from "@/components/header";
import LoginButton from "@/components/account/loginButton";

async function firestoreLogin(result: UserCredential) {
    await setDoc(doc(db, 'users', result.user.uid), {
       displayName: result.user.displayName ?? result.user.email?.split('@')[0] ?? 'User', 
       email: result.user.email, 
       uid: result.user.uid, 
       pfpUrl: result.user.photoURL ?? '/img/login/pfp-default.png',
       roles: []
    });
}

export default function LoginPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log(currentUser);
            setUser(currentUser);
        });

        return unsubscribe;
    }, []);

    const handleGoogleLogin = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // console.log(result.user);
            await firestoreLogin(result);
        } catch (error) {
            console.error("Google login failed:", error);
        }
    };

    const handleSignUp = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const email = (document.querySelector('.email-input') as HTMLInputElement).value;
            const password = (document.querySelector('.password-input') as HTMLInputElement).value;
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await firestoreLogin(result);
            localStorage.setItem('loggedIn', 'y');
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use')
                alert('Email already in use.');
            else if (error.code === 'auth/invalid-email')
                alert('Invalid email address.');
            else if (error.code === 'auth/weak-password')
                alert('Password is too weak. Please use at least 6 characters.');
            else
                alert('An error occurred during sign up.');
            console.error("Email sign up failed:", error);
        }
    };

    const handleEmailLogin = async () => {

    };

    return (
        <div className="root">
            <link rel="stylesheet" href="/css/login.css" />
            <p>{user?.email}</p>
            <Header />
            <div className="login-container">
                <div className="login-header">
                    <h1 className="font-title">Login</h1>
                </div>
                <p className="login-subheader font-medium">Login to your account or create a new one</p>
                <div className="login-separator"></div>
                <input className="login-input email-input" type="text" placeholder="Email..." />
                <input className="login-input password-input" type="password" placeholder="Password..." />
                <button className="login-button font-medium" style={{width: '380px'}} onClick={handleEmailLogin}>Log In</button>
                <button className="login-button font-medium" style={{width: '380px'}} onClick={handleSignUp}>Sign Up</button>
                <div className="login-separator"></div>
                <LoginButton
                    src="/img/login/google.png"
                    text="Continue with Google"
                    callback={handleGoogleLogin}
                    style={{width: '300px'}}
                />
            </div>
        </div>
    );
}