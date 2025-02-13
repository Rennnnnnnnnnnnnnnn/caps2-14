import React, { useState } from 'react';
import { TextField, Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    // State to manage email, password, error, and loading state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state for spinner

    const navigate = useNavigate(); // Hook to navigate programmatically

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);  // Start loading immediately

        // Delay the spinner by 3 seconds
        setTimeout(async () => {
            try {
                const response = await axios.post('http://localhost:8000/api/auth/login', {
                    email,
                    password,
                });

                // Store the JWT token in sessionStorage
                sessionStorage.setItem('jwtToken', response.data.token);  // Store token
                sessionStorage.setItem('user', JSON.stringify(response.data.user));  // Store user info (optional)

                console.log('Login successful');

                // Redirect to home page or another protected route
                navigate('/home');  // Use navigate to redirect

            } catch (err) {
                const errorMessage = err.response?.data?.message || 'An error occurred during login.';
                setError(errorMessage);  // Set the specific error message to be displayed
            } finally {
                setLoading(false);  // Hide the spinner once the request is complete
            }
        }, 2000);
    };

    return (
        <>
            <div className="h-screen flex items-center justify-center bg-gray-700">
                <div className="flex">
                    <div className="left bg-gray-300 flex justify-center items-center rounded-tl-2xl rounded-bl-2xl">
                        <div className="flex flex-col w-[500px] justify-center items-center">
                            <img
                                src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fpluspng.com%2Fimg-png%2Flogo-template-png-logo-templates-1655.png&f=1&nofb=1"
                                alt="Sample Logo"
                                className="mb-4 h-[200px] w-[200px] object-contain"
                            />
                            <div className="w-full text-center">
                                <label className="block text-6xl font-bold tracking-wider w-full text-gray-900" style={{ fontFamily: 'Quartzo' }}>
                                    MONVIREY
                                </label>
                                <label className="block text-4xl font-bold tracking-widest w-full text-gray-900" style={{ fontFamily: 'Quartzo' }}>
                                    POULTRY FARM
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="w-[400px] h-[500px] mx-auto p-2 bg-gray-300 flex flex-col items-center justify-center rounded-tr-2xl rounded-br-2xl">
                        {loading ? <CircularProgress size={95} /> :
                            <div className="bg-gray-200 p-6 mr-10 shadow-2xl rounded-lg">
                                <form noValidate autoComplete="off" className="w-full mr-8" onSubmit={handleSubmit}>
                                    {/* Username/Email field */}
                                    <TextField
                                        id="email"
                                        label="Email"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        error={!!error}
                                    />
                                    {/* Password field */}
                                    <TextField
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        error={!!error}
                                    />

                                    {/* Submit button */}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        type="submit"
                                        style={{ marginTop: '1rem' }}
                                        disabled={loading}  // Disable button when loading
                                    >
                                        Login
                                    </Button>

                                    {/* Error message */}
                                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

                                    <p className="text-sm font-sm text-right mt-2 text-blue-500 cursor-pointer">Forgot password</p>
                                </form>
                            </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;
