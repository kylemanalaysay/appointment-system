import { useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from "../context/AuthContext.js";
import { BASE_URL } from "../config";
import { toast } from "react-toastify";
import HashLoader from 'react-spinners/HashLoader'

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { dispatch } = useContext(AuthContext)

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const submitHandler = async event => {
        event.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json()

            if (!res.ok) {
                throw new Error(result.message)
            }

            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    existingUser: result.data,
                    token: result.token,
                },
            });
            
            const isAdmin = result.data.isAdmin;
            console.log(result, "login data");

            setLoading(false)
            toast.success(result.message)
            if (isAdmin) {
                navigate('/admin/profile/me'); 
              } else {
                navigate('/'); 
              }
        } catch (err) {
            toast.error(err.message)
            setLoading(false)
        }
    };

    return (
        <section className="px-5 lg:px-0 flex justify-center items-center h-screen">
            <div className="w-full max-w-[450px] mx-auto rounded-lg shadow-md md:p-10 text-center">
                <h3 className="text-headingColor text-2xl font-bold mb-4">
                    Hello! <span className="text-primaryColor">Welcome</span> Back
                </h3>
                <form className="py-4 md:py-0 w-full mx-auto" onSubmit={submitHandler}>
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
                    </div>
                    <div className="mb-4">
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
                    </div>
                    <div className="mt-7">
                        <button
                            disabled={loading && true}
                            type="submit"
                            className="w-full text-[18px] leading-[30px] rounded-lg px-4 py-2"
                            style={{ width: "20%" }}
                        >{loading ? <HashLoader size={35} color="#7941B0" /> : 'Login'}</button>
                    </div>
                    <p className="mt-3 text-textColor text-center">
                        Don't have an account? <Link to='/register' className="text-primaryColor font-medium ml-1">
                            Register</Link>
                    </p>
                </form>
            </div>
        </section>
    );
}

export default Login;


