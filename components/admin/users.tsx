import { dbManager } from "@/lib/firebase";
import { useEffect, useState } from "react";
import AdminUser from "./user";
import { saveUser, User } from "@/lib/user";

export default function UsersTable({ searchTerms }: { searchTerms: string[] }) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await dbManager.getCollection(['users']);
            const usersData = usersCollection.docs.map(doc => doc.data as User);
            setUsers(usersData);
        };
        fetchUsers();
    }, []);
    
    return (
        <div className='admin-users-container'>
            {users.filter(user => {
                if (searchTerms.length === 0) return true;
                return searchTerms.some(term => 
                    user.displayName.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term) ||
                    user.roles.some(role => role.toLowerCase().includes(term))
                );
            }).map(user => (
                <AdminUser key={user.uid} user={user} onUserUpdated={async (updatedUser) => {
                    await saveUser(updatedUser);
                    setUsers(prevUsers => prevUsers.map(u => u.uid === updatedUser.uid ? updatedUser : u));
                }} />
            ))}
        </div>
    )
}