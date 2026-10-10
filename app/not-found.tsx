import Header from "@/components/header";

export default function Page404() {
    return (
        <div className="root">
            <Header />
            <div className="flex flex-col items-center justify-center h-full" style={{ marginTop: '50px' }}>
                <h1 className="text-4xl font-title font-bold mb-4">404 - Page Not Found</h1>
                <p className="text-lg">The page you are looking for does not exist.</p>
            </div>
        </div>
    );
}