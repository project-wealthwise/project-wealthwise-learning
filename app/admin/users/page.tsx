'use client';
import UsersTable from "@/components/admin/users";
import Header from "@/components/header";
import { useState } from "react";

export default function AdminUsersPage() {
    const [searchTerms, setSearchTerms] = useState([] as string[]);

    return (
        <div className='root'>
            <Header />
            <div style={{ padding: '20px' }}>
                <h1 className='font-title font-bold'>Manage Users</h1>
                <p className='font-text'>Here you can view and manage all users in the application.</p>
                <input className='pww-input' type='text' placeholder='Search users...' style={{ width: '95%' }} onChange={(e) => {
                    const searchTerms = e.target.value.toLowerCase().split(' ').filter(word => word.trim() !== '');
                    setSearchTerms(searchTerms);
                }} />
                <UsersTable searchTerms={searchTerms} />
            </div>
        </div> 
    )
}