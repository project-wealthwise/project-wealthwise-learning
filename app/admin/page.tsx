import Header from "@/components/header";

export default function AdminPage() {
    return (
        <div className='root'>
            <Header />
            <h1 className='font-title font-bold'>Admin Page</h1>
            <p className='font-text'>Welcome to the admin page. Here you can manage your application.</p>
        </div>
    );
}