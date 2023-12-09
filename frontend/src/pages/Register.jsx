import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from "../config"
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader'

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');
    }, [formData.email, formData.password, formData.confirmPassword]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const isEmailValid = (email) => {
        // Regular expression for email validation
        const emailPattern = /^[^\s@#!]+@{1}[^\s@.#!]+\.{1}[^\s@.]+$/;
        return emailPattern.test(email);
    };

    const isPasswordValid = (password) => {
        // Password validation: at least 8 characters, one uppercase letter, one lowercase letter, and one number
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return passwordPattern.test(password);
    };

    const isPasswordMatched = (password, confirmPassword) => {
        return password === confirmPassword;
    };

    const validateForm = () => {
        let isValid = true;

        if (!isEmailValid(formData.email)) {
            setEmailError('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!isPasswordValid(formData.password)) {
            setPasswordError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!isPasswordMatched(formData.password, formData.confirmPassword)) {
            setConfirmPasswordError('Passwords must match.');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };
    

    const submitHandler = async event => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const { message } = await res.json()
            if (!res.ok) {
                throw new Error(message)
            }
            setLoading(false)
            toast.success(message)
            navigate('/login')
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred';
            toast.error(errorMessage)
            setLoading(false)
        }
    };

    return (
        <section className="px-5 lg:px-0 flex justify-center items-center h-screen">
            <div className="w-full max-w-[450px] mx-auto rounded-lg shadow-md md:p-10 text-center">
                <div className='grid grid-cols-1 lg:grid-cols-2 text-center'>
                    {/* sign up form */}
                    <div className='rounded-l-lg lg:pl-16 py-10'>
                        <h3 className="text-headingColor text-2xl font-bold mb-5">
                            Create an <span className='text-primaryColor'>account</span>
                        </h3>

                        <form onSubmit={submitHandler}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    style={{ width: "20%" }}
                                    className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                                    focus:border-b-primaryColor text-lg leading-6 text-headingColor
                                    placeholder:text-textColor rounded-md cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    style={{ width: "20%" }}
                                    className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                                    focus:border-b-primaryColor text-lg leading-6 text-headingColor
                                    placeholder:text-textColor rounded-md cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    style={{ width: "20%" }}
                                    className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                                    focus:border-b-primaryColor text-lg leading-6 text-headingColor
                                    placeholder:text-textColor rounded-md cursor-pointer"
                                    required
                                />
                                {emailError && (
                                    <p className="text-sm mt-1" style={{ color: 'red' }} >{emailError}</p>
                                )}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    style={{ width: "20%" }}
                                    className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                                    focus:border-b-primaryColor text-lg leading-6 text-headingColor
                                    placeholder:text-textColor rounded-md cursor-pointer"
                                    required
                                />
                                {passwordError && <p className="text-sm mt-1" style={{ color: 'red' }}>{passwordError}</p>}
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    style={{ width: "20%" }}
                                    className="w-full px-4 py-3 border border-solid border-[#0066ff61] focus:outline-none
                                    focus:border-b-primaryColor text-lg leading-6 text-headingColor
                                    placeholder:text-textColor rounded-md cursor-pointer"
                                    required
                                />
                                {confirmPasswordError && (
                                    <p className="text-sm mt-1" style={{ color: 'red' }}>{confirmPasswordError}</p>
                                )}
                            </div>
                            <div className="mt-7">
                                <button
                                    disabled={loading && true}
                                    type="submit"
                                    className="w-full text-[18px] leading-[30px] rounded-lg px-4 py-2"
                                    style={{ width: "20%" }}
                                >{loading ? <HashLoader size={35} color="#7941B0" /> : 'Sign Up'}</button>
                            </div>
                            <p className="mt-3 text-textColor text-center">
                                Already have an account? <Link to='/login' className="text-primaryColor font-medium ml-1">
                                    Login</Link>
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;

