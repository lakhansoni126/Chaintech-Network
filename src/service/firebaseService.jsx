import { auth, googleProvider, db } from '/src/Firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged, fetchSignInMethodsForEmail } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { createContext, useContext, useEffect, useState } from 'react';

const isEmailRegistered = async (email) => {
    try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        return signInMethods.length > 0;
    } catch (error) {
        console.error('Error checking email registration:', error.message);
        throw error;
    }
};

export const signUp = async (email, password, additionalData) => {
    try {

        const emailRegistered = await isEmailRegistered(email);
        if (emailRegistered) {
            throw new Error('Email is already registered. Please use Google sign-in.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = ref(db, 'users/' + user.uid);
        await set(userRef, { email: user.email, ...additionalData });

        localStorage.setItem('userDocId', user.uid);

        return user;
    } catch (error) {
        console.error('Error signing up:', error.message);
        throw error;
    }
};

export const signIn = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Error signing in:', error.message);
        throw error;
    }
};

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const userRef = ref(db, 'users/' + user.uid);

        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
            await set(userRef, {
                email: user.email,
                fullname: user.displayName,
                photoURL: user.photoURL,
                occupation: '',
                company: '',
            });
        }

        localStorage.setItem('userDocId', user.uid);

        return user;
    } catch (error) {
        console.error('Error signing in with Google:', error.message);
        throw error;
    }
};

const AuthContext = createContext();

export const Auth = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                localStorage.setItem('userDocId', currentUser.uid);
            } else {
                setUser(null);
                localStorage.removeItem('userDocId');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
