// Register.js
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { Link } from 'react-router-dom';


function Register() {
    // State to manage name, email, and password
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!name || !email || !password) {
            setError('Name, Email, and Password are required!');
            return;
        }

        // Make a POST request to the backend to register the user
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (data.success) {
                // Handle successful registration (redirect or show message)
                alert('Registration successful!');
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Error: Unable to register user');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex">
                <div className="w-[400px] h-[500px] mx-auto p-8 bg-red-200 flex flex-col items-center justify-center">
                    <form noValidate autoComplete="off" className="w-full" onSubmit={handleSubmit}>
                        <TextField
                            id="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
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
                        />
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
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            type="submit"
                            style={{ marginTop: '1rem' }}
                        >
                            Register
                        </Button>

                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </form>
                    <div>
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
