import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export function useAuthGuard() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!supabase) {
            // No Supabase configured — redirect to login
            navigate('/admin/login', { replace: true });
            return;
        }

        supabase.auth.getSession().then(({ data }) => {
            if (!data.session) {
                navigate('/admin/login', { replace: true });
            }
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) navigate('/admin/login', { replace: true });
        });

        return () => listener.subscription.unsubscribe();
    }, [navigate]);
}
