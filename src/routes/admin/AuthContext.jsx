import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../../firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../../firebase.js';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useUserStore } from '../../store/useUserStore.js';

const AuthContext = createContext({ user: null, loading: true, role: null, profile: null, logout: async () => {} });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const setUserBasics = useUserStore.getState().setUserBasics;
    const setProfile = useUserStore.getState().setProfile;
    const clearUser = useUserStore.getState().clearUser;
    let unsubProfile = null;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        setUserBasics({ userId: u.uid, email: u.email || null });
      } else {
        clearUser();
      }
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      if (u) {
        const ref = doc(db, 'users', u.uid);
        // listener para active/role
        unsubProfile = onSnapshot(ref, async (snap) => {
          const data = snap.data();
          setProfile(data || null);
          setRole(data?.role || null);
          setProfile({ role: data?.role, profile: data });
          if (data && data.active === false) {
            await signOut(auth);
          }
        });
      }
    });
    return () => {
      unsub();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, profile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


