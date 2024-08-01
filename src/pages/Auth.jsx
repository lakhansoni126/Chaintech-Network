import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import SocialButton from '../components/SocialButton';
import { signUp, signIn, signInWithGoogle } from '/src/service/firebaseService'; // Update the path as necessary

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
        occupation: '',
        company: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const toggleForm = () => setIsSignUp(!isSignUp);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { email, password, fullname, occupation, company } = formData;
            if (isSignUp) {
                await signUp(email, password, { fullname, occupation, company });
            } else {
                await signIn(email, password);
            }
            navigate('/profile');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigate('/profile');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-screen h-screen">
                {/* Left Section */}
                <div className="flex flex-col justify-center w-full md:w-1/3 p-4 md:p-6">
                    <div className="flex justify-start mb-4">
                        <img src="https://www.chaintech.network/blog/wp-content/uploads/2023/09/chaintech-logo-1.svg" alt="Logo" className="w-fit" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">{isSignUp ? 'Create your account' : 'Sign in to your account'}</h2>
                    <p className="mb-2 text-sm text-gray-600">
                        {isSignUp
                            ? <>Already a member? <a href="#" onClick={toggleForm} className="text-blue-600 hover:underline">Sign in</a></>
                            : <>Not a member? <a href="#" onClick={toggleForm} className="text-blue-600 hover:underline">Sign up</a></>}
                    </p>
                    <form onSubmit={handleSubmit}>
                        {isSignUp && (
                            <>
                                <div className="mb-2">
                                    <InputField id="fullname" label="Full Name" placeholder="Enter your Full Name" value={formData.fullname} onChange={handleChange} />
                                </div>
                                <div className="mb-2">
                                    <InputField id="occupation" label="Occupation" placeholder="Enter your occupation" value={formData.occupation} onChange={handleChange} />
                                </div>
                                <div className="mb-2">
                                    <InputField id="company" label="Company" placeholder="Enter your company" value={formData.company} onChange={handleChange} />
                                </div>
                            </>
                        )}
                        <div className="mb-2">
                            <InputField id="email" label="Email address" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="mb-2">
                            <InputField id="password" label="Password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                        </div>
                        {!isSignUp && (
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <input type="checkbox" id="remember-me" className="mr-1" />
                                    <label htmlFor="remember-me" className="text-xs text-gray-700">Remember me</label>
                                </div>
                                <a href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</a>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700"
                        >
                            {isSignUp ? 'Sign up' : 'Sign in'}
                        </button>
                        {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
                    </form>
                    <div className="mt-4 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">Or continue with</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                        <SocialButton platform="Google" onClick={handleGoogleSignIn} />
                        <SocialButton platform="GitHub" />
                    </div>
                </div>
                {/* Right Section */}
                <div className="hidden md:block md:w-3/4 bg-cover bg-left-bottom" style={{ backgroundImage: "url('/src/assets/login.jpg')" }}></div>
            </div>
        </div>
    );
};

export default Auth;
