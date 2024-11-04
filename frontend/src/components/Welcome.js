import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Создайте этот файл для стилизации компонента

function Welcome() {
  return (
    <div className="welcome-container">
      <h1>Добро пожаловать в Live Jam Session</h1>
      <p>Создавайте музыку вместе с другими музыкантами в реальном времени!</p>
      <div className="welcome-buttons">
        <Link to="/login">
          <button className="welcome-button">Войти</button>
        </Link>
        <Link to="/register">
          <button className="welcome-button register">Регистрация</button>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
