import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { getAuthToken } from '@/utils/auth';

interface RequireAuthProps {
    children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const storedToken = getAuthToken();
        if (!isAuthenticated && !storedToken) {
            router.push('/signin');
        }
    }, [isAuthenticated, router, token]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default RequireAuth;
