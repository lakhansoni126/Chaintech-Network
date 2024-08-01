import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '/src/Firebase.js'; // Import Firebase auth and db
import { ref, get, update } from 'firebase/database';
import { signOut } from 'firebase/auth'; // Import signOut function
import InputField from '/src/components/InputField';

const Profile = () => {
    const [userData, setUserData] = useState({
        fullname: '',
        occupation: '',
        company: '',
        email: '',
        photoURL: ''
    });
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [profileIncomplete, setProfileIncomplete] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userDocId = localStorage.getItem('userDocId');
        if (!userDocId) {
            navigate('/');
        } else {
            const fetchUserData = async () => {
                try {
                    const userRef = ref(db, 'users/' + userDocId);
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setUserData(snapshot.val());
                        setProfileIncomplete(
                            !snapshot.val().fullname ||
                            !snapshot.val().occupation ||
                            !snapshot.val().company ||
                            !snapshot.val().email
                        );
                    } else {
                        setError('No user data found!');
                    }
                } catch (error) {
                    setError(error.message);
                }
            };

            fetchUserData();
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleSave = async () => {
        const userDocId = localStorage.getItem('userDocId');
        if (userDocId) {
            try {
                const userRef = ref(db, 'users/' + userDocId);
                await update(userRef, userData);
                setEditing(false);
                setProfileIncomplete(
                    !userData.fullname ||
                    !userData.occupation ||
                    !userData.company ||
                    !userData.email
                );
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userDocId');
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    console.log(userData);

    return (
        <section style={{ fontFamily: 'Montserrat' }} className="bg-[#071e34] flex items-center justify-center h-screen">
            {profileIncomplete && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black py-2 px-4 rounded-md">
                    <span>Complete your profile to unlock all features.</span>
                </div>
            )}
            <section className="w-3/5 mx-auto bg-[#20354b] rounded-2xl px-8 py-6 shadow-lg relative">
                <button
                    onClick={handleLogout}
                    className="absolute top-4 right-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                    Logout
                </button>
                {!editing && (
                    <>
                        <div className="flex items-center justify-between">
                            <span className="text-white text-sm">Occupation : {userData.occupation || "Occupation"}</span>
                            <span className="text-emerald-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                            </span>
                        </div>
                        <div className="mt-6 w-fit mx-auto">
                            <img src={userData.photoURL || 'https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png'} className="rounded-full w-28" alt='Profile' />
                        </div>
                        <div className="mt-8">
                            <h2 className="text-white font-bold text-2xl tracking-wide">
                                {userData.fullname || "Name"}
                            </h2>
                        </div>
                        <p className="text-emerald-400 font-semibold mt-2.5">Company : {userData.company || "Company"}</p>
                        <div className="h-1 w-full bg-black mt-8 rounded-full">
                            <div className="h-1 rounded-full w-2/5 bg-yellow-500"></div>
                        </div>
                        <div className="mt-3 text-white text-sm">
                            <span className="text-gray-400 font-semibold">Storage:</span>
                            <span>40%</span>
                        </div>
                    </>
                )}
                <button
                    onClick={() => setEditing(!editing)}
                    className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                    {editing ? 'Cancel' : 'Edit Profile'}
                </button>
                {editing && (
                    <div className="mt-6">
                        <div className="mb-4">
                            <InputField id="fullname" label="Full Name" value={userData.fullname} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <InputField id="occupation" label="Occupation" value={userData.occupation} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <InputField id="company" label="Company" value={userData.company} onChange={handleChange} />
                        </div>
                        <div className="mb-4">
                            <InputField id="email" label="Email Address" value={userData.email} onChange={handleChange} disabled />
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </section>
        </section>
    );
};

export default Profile;
