import ProfilePage from '@/components/ProfilePage/ProfilePage';
import RequireAuth from '@/components/RequireAuth/RequireAuth';

export default function Profile() {
    return (
        <RequireAuth>
            <ProfilePage />
        </RequireAuth>
    );
}
