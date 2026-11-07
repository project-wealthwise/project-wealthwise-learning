'use client';
import Header from "@/components/header";

export default function AdminPage() {
    return (
        <div className='root'>
            <Header />
            <div style={{ padding: '20px' }}>
                <h1 className='font-title font-bold'>Admin Page</h1>
                <p className='font-text'>Welcome to the admin page. Here you can manage your application.</p>
                <div className='admin-content'>
                    <div className='admin-option-container' onClick={() => window.location.href = '/admin/users'}>
                        <h2 className='admin-option-header font-title'>Manage Users</h2>
                        <p className='admin-option-description font-text'>View and manage all users in the application.</p> 
                    </div>
                    <div className='admin-option-container' onClick={() => window.location.href = '/curriculum'}>
                        <h2 className='admin-option-header font-title'>Edit Curriculum</h2>
                        <p className='admin-option-description font-text'>Edit the digital learning system's curriculum.</p> 
                    </div>
                </div>
            </div>
        </div>
    );
}