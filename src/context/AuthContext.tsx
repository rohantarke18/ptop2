import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import {
  auth,
  db,
  signInWithGoogle,
  signInCitizenQuick,
  logoutFirebase,
  testFirestoreConnection,
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isAdminOrOfficer: boolean;
  isExpert: boolean;
  loading: boolean;
  loginWithGoogle: (targetRole?: UserRole) => Promise<User>;
  loginAsCitizen: (emailOrPhone?: string, name?: string) => Promise<User>;
  loginWithPhone: (phone: string, otp: string) => Promise<User>;
  loginAsOfficial: (role: UserRole, email: string, name?: string) => Promise<User>;
  loginAdmin: (email: string, pass: string, role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  switchRoleForDemo: (role: UserRole) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and listen to real Firebase Auth state
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data() as User;
          setUser({
            ...data,
            id: fbUser.uid,
            name: fbUser.displayName || data.name || 'Citizen User',
            email: fbUser.email || data.email || '',
            avatar: fbUser.photoURL || data.avatar,
          });
        } else {
          // Create initial user doc
          const newUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Citizen User',
            email: fbUser.email || '',
            role: 'citizen',
            avatar: fbUser.photoURL || undefined,
            wardOrDistrict: 'Ward 14, Pune Central',
          };
          await setDoc(userRef, {
            ...newUser,
            createdAt: new Date().toISOString(),
          });
          setUser(newUser);
        }
      } catch (err) {
        console.error('Error fetching user profile from Firestore:', err);
        // Fallback in-memory user
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || 'Citizen User',
          email: fbUser.email || '',
          role: 'citizen',
          avatar: fbUser.photoURL || undefined,
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (targetRole: UserRole = 'citizen'): Promise<User> => {
    const fbUser = await signInWithGoogle();
    const userRef = doc(db, 'users', fbUser.uid);
    const userSnap = await getDoc(userRef);

    let assignedRole: UserRole = targetRole;
    if (userSnap.exists()) {
      const existing = userSnap.data() as User;
      // If user had an existing role and no explicit target role was requested, keep it
      if (targetRole === 'citizen' && existing.role) {
        assignedRole = existing.role;
      }
    }

    const userData: User = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Citizen User',
      email: fbUser.email || '',
      role: assignedRole,
      avatar: fbUser.photoURL || undefined,
      department:
        assignedRole === 'officer'
          ? 'Municipal Road Maintenance & Civil Infrastructure'
          : assignedRole === 'department_admin'
          ? 'Sanitation & Solid Waste Management'
          : assignedRole === 'expert'
          ? 'Urban Planning & Mobility Institute'
          : undefined,
      designation:
        assignedRole === 'officer'
          ? 'Field Executive Engineer'
          : assignedRole === 'department_admin'
          ? 'Additional Municipal Commissioner'
          : assignedRole === 'super_admin'
          ? 'Chief Administrative Officer'
          : assignedRole === 'expert'
          ? 'Civic Innovation Advisory Committee Member'
          : undefined,
      wardOrDistrict: 'Ward 14, Pune Central',
    };

    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    setUser(userData);
    return userData;
  };

  const loginAsCitizen = async (emailOrPhone?: string, name?: string): Promise<User> => {
    const cleanName = name?.trim() || 'Citizen User';
    const fbUser = await signInCitizenQuick(cleanName, emailOrPhone);

    const userData: User = {
      id: fbUser.uid,
      name: cleanName,
      email: emailOrPhone && emailOrPhone.includes('@') ? emailOrPhone : (fbUser.email || ''),
      phone: emailOrPhone && !emailOrPhone.includes('@') ? emailOrPhone : '+91 98200 00000',
      role: 'citizen',
      wardOrDistrict: 'Ward 14, Pune Central',
    };

    try {
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore setDoc warning:', e);
    }

    setUser(userData);
    return userData;
  };

  const loginWithPhone = async (phone: string, _otp: string): Promise<User> => {
    return loginAsCitizen(phone, 'Verified Citizen');
  };

  const loginAsOfficial = async (role: UserRole, email: string, name?: string): Promise<User> => {
    const officialName = name || (
      role === 'officer'
        ? 'Field Engineer'
        : role === 'department_admin'
        ? 'Municipal Commissioner'
        : role === 'expert'
        ? 'Civic Innovation Advisor'
        : 'Chief Administrator'
    );

    const fbUser = await signInCitizenQuick(officialName, email);
    const userData: User = {
      id: fbUser.uid,
      name: officialName,
      email: email,
      role: role,
      department:
        role === 'officer'
          ? 'Municipal Road Maintenance & Civil Infrastructure'
          : role === 'department_admin'
          ? 'Sanitation & Solid Waste Management'
          : role === 'expert'
          ? 'Urban Planning & Mobility Institute'
          : 'Central Municipal Administration',
      designation:
        role === 'officer'
          ? 'Executive Ward Engineer'
          : role === 'department_admin'
          ? 'Additional Municipal Commissioner'
          : role === 'expert'
          ? 'Advisory Panel Member'
          : 'Chief Administrative Officer',
      wardOrDistrict: 'Ward 14, Pune Central',
    };

    try {
      const userRef = doc(db, 'users', fbUser.uid);
      await setDoc(userRef, {
        ...userData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore setDoc warning:', e);
    }

    setUser(userData);
    return userData;
  };

  const loginAdmin = async (email: string, _pass: string, roleToUse: UserRole): Promise<User> => {
    return loginAsOfficial(roleToUse, email);
  };

  const logout = async () => {
    await logoutFirebase();
    setUser(null);
  };

  const switchRoleForDemo = async (newRole: UserRole) => {
    if (!user) {
      await loginAsOfficial(newRole, `${newRole}@civicbridge.gov.in`);
      return;
    }

    const updated: User = {
      ...user,
      role: newRole,
      department:
        newRole === 'officer'
          ? 'Municipal Road Maintenance & Civil Infrastructure'
          : newRole === 'department_admin'
          ? 'Sanitation & Solid Waste Management'
          : newRole === 'expert'
          ? 'Urban Planning & Mobility Institute'
          : user.department,
      designation:
        newRole === 'officer'
          ? 'Executive Ward Engineer'
          : newRole === 'department_admin'
          ? 'Additional Municipal Commissioner'
          : newRole === 'expert'
          ? 'Advisory Panel Member'
          : user.designation,
    };

    setUser(updated);

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        role: newRole,
        department: updated.department || null,
        designation: updated.designation || null,
      });
    } catch (e) {
      console.warn('Could not update role in Firestore:', e);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updates);
    } catch (e) {
      console.warn('Error updating user profile in Firestore:', e);
    }
  };

  const role = user?.role || 'citizen';
  const isAuthenticated = !!user;
  const isAdminOrOfficer =
    role === 'officer' ||
    role === 'department_admin' ||
    role === 'super_admin' ||
    role === 'expert';
  const isExpert = role === 'expert' || role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isAdminOrOfficer,
        isExpert,
        loading,
        loginWithGoogle,
        loginAsCitizen,
        loginWithPhone,
        loginAsOfficial,
        loginAdmin,
        logout,
        switchRoleForDemo,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
