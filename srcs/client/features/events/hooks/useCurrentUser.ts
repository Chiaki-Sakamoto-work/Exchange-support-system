import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export const useCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted) {
        if (user) {
          setCurrentUserId(user.id);
        }
        setIsLoadingAuth(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { currentUserId, isLoadingAuth };
};
