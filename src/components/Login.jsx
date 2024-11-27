import { useState } from 'react';

function Login() {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState(null);

    
    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            
            const response = await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            
            const data = await response.json();

            if (response.ok) {
                
                setToken(data.token);
                setError('');
                console.log('Login exitoso:', data.token);
            } else {
                
                setError(data.message);
                setToken(null);
            }
        } catch (error) {
            console.error('Error al hacer login:', error);
            setError('Hubo un error al intentar hacer login.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {token && <p>Token: {token}</p>} 
        </div>
    );
}

export default Login;