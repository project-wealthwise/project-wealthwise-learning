import Image from 'next/image';
import { Modal } from '../modal';
import { closeModal, openModal } from '@/lib/modal';
import { User } from '@/lib/user';

export type UserProps = {
    user: User,
    onUserUpdated: (updatedUser: User) => void
}

export default function AdminUser({ user, onUserUpdated }: UserProps) {
    const pfp_size = 50;

    return (
        <div className='admin-user-container'>
            <Image 
                className='admin-user-pfp' 
                src={user.pfpUrl || '/login/pfp-default.png'} 
                alt={`${user.displayName}'s profile picture`} 
                width={pfp_size}
                height={pfp_size}
            />
            <div className='admin-user-info'>
                <p className='admin-user-name'>{user.displayName}</p>
                <p className='admin-user-email'>{user.email}</p>
                {/* <p className='admin-user-roles'><b>Roles:</b> {user.roles.join(', ') || 'None'}</p> */}
            </div>
            <div className='admin-user-roles'>
                <h2 className='font-title font-bold admin-role-header'>Roles</h2>
                {user.roles.map((role, i) => (
                    <div key={i} className='admin-role-container'>
                        <p className='font-text admin-role-label'>{role}</p>
                        <button className='pww-button button-red button-small admin-role-remove-btn' onClick={() => {
                            if (role == 'admin') {
                                alert('Only owners can promote or demote admins.');
                                return;
                            }

                            const updatedUser: User = {
                                ...user,
                                roles: user.roles.filter(r => r !== role)
                            };
                            onUserUpdated(updatedUser);
                        }}>
                            Remove Role
                        </button>
                    </div>
                ))}
                <button className='pww-button button-green button-small admin-role-add-btn' onClick={() => {
                    const newRole = prompt('Enter the new role:');
                    if (newRole == 'admin') {
                        alert('Only owners can promote or demote admins.');
                        return;
                    }
                    
                    if (newRole) {
                        const updatedUser: User = {
                            ...user,
                            roles: [...user.roles, newRole]
                        };
                        onUserUpdated(updatedUser);
                    }
                }}>
                    Add Role
                </button>
            </div>
            <div className='admin-user-actions'>
                <button className='pww-button button-green button-small admin-user-edit-btn' onClick={() => {
                    openModal(`edit-user-${user.uid}`);
                }}>
                    Edit User
                </button>
                <button className='pww-button button-green button-small admin-user-edit-btn' onClick={() => {
                    openModal(`edit-roles-${user.uid}`);
                }}>
                    Edit Roles
                </button>
            </div>
            <Modal modalId={`edit-user-${user.uid}`}>
                <h2 className='font-title font-bold'>Edit User</h2>
                <p className='font-text'>Here you can edit the user's information.</p>
                <form className='admin-user-edit-form' onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const updatedUser: User = {
                        ...user,
                        displayName: formData.get('displayName') as string,
                        email: formData.get('email') as string,
                        // roles: (formData.get('roles') as string).split(',').map(role => role.trim())
                    };
                    onUserUpdated(updatedUser);
                    closeModal();
                }}>
                    <div>
                        <label className='font-text'>Display Name</label>
                        <input className='pww-input' type='text' name='displayName' defaultValue={user.displayName} required />
                    </div>
                    <div>
                        <label className='font-text'>Email&nbsp;&nbsp;&nbsp;&nbsp;{/* This is very cursed but prevents label being on the same line */}</label>
                        <input className='pww-input' type='email' name='email' defaultValue={user.email} required />
                    </div>
                    <div></div>
                    <button type='submit' className='pww-button button-green button-small admin-user-edit-submit font-text'>Save Changes</button>
                </form>
            </Modal>
        </div>
    )
}