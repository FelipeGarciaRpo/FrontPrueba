import { useState, useEffect } from 'react';
import "./App.css";

const App = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); 
  const [showLogin, setShowLogin] = useState(false); 
  const [showRegister, setShowRegister] = useState(false); 
  const [user, setUser] = useState(null); 
  const [authError, setAuthError] = useState(null); 
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    username: '',
    password: '',
    role: ''
  });

  useEffect(() => {
    if (loggedIn) {
      const websocket = new WebSocket('ws://localhost:5000');
      setWs(websocket);

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data.message]);
      };

      return () => {
        websocket.close();
      };
    }
  }, [loggedIn]);

  const sendMessage = () => {
    if (ws) {
      ws.send(JSON.stringify({ content: input }));
      setMessages((prev) => [...prev, input]); 
      setInput('');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault(); 
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (response.status === 200) {
        setLoggedIn(true);
        setUser(data.user); 
        setAuthError(null); 
      } else {
        setAuthError(data.message); 
      }
    } catch (error) {
      setAuthError('Error al conectar con el servidor');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault(); 
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();

      if (response.status === 201) {
        setShowRegister(false); 
        alert('Registro exitoso. Ahora puedes iniciar sesión');
      } else {
        setAuthError(data.message); 
      }
    } catch (error) {
      setAuthError('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <h1>Bienvenido</h1>
          {!showLogin && !showRegister && (
            <div>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <button onClick={() => setShowRegister(true)}>Register</button>
            </div>
          )}

          {showLogin && (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button type="submit">Login</button>
              <button type="button" onClick={() => setShowLogin(false)}>
                Cancelar
              </button>
              {authError && <p style={{ color: 'red' }}>{authError}</p>}
            </form>
          )}

          {showRegister && (
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
              <input
                type="text"
                placeholder="Role"
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
              />
              <button type="submit">Registrar</button>
              <button type="button" onClick={() => setShowRegister(false)}>
                Cancelar
              </button>
              {authError && <p style={{ color: 'red' }}>{authError}</p>}
            </form>
          )}
        </div>
      ) : (
        <div className='chatenvivo'>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/oKOtzIo-uYw?si=d3aPRIyYvm4_alE-"
                title="Video en vivo"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className='mensajes'>
              <h2>Participantes</h2>
              <ul>
                {user && <li>{user.username}</li>} 
              </ul>
              <div>
                <h3>Mensajes</h3>
                {messages.map((msg, index) => (
                  <p key={index}>{msg}</p>
                ))}
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
              />
              <button onClick={sendMessage}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;