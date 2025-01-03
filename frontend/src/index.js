import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Bootstrap CSS, JS ve Font Awesome import
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'alertifyjs/build/css/alertify.min.css';


// Custom CSS
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
