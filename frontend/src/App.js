import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Rooms from './components/Rooms';
import CreateRoom from './components/CreateRoom';
import Profile from './components/Profile';
import Room from './components/Room';
import './App.css';

function App() {
  return (
    <div>
      <header>Live Jam Session</header>
      <Router>
        <main>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<Rooms />} />
	    <Route path="/room" element={<Room />} />
            <Route path="/create-room" element={<CreateRoom />} />
	    <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </Router>
      <footer>© 2024 Live Jam Session. Все права защищены.</footer>
    </div>
  );
}

export default App;
