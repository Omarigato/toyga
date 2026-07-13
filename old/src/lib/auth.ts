import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGetMe, isUnauthorized } from './apiClient';

export function useAuthGuard() {
    const navigate = useNavigate();

    useEffect(() => {
        adminGetMe()
            .catch((e) => {
                if (isUnauthorized(e)) {
                    navigate('/admin/login', { replace: true });
                }
            });
    }, [navigate]);
}
