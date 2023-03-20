import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NoSelection from './NoSelection';
import Layout from './Layout';
import Note from './Note';
import SavedNote from './SavedNote';
import Login from './Login';

if (localStorage.getItem("noteList") == null) {
  localStorage.setItem("noteList", "[]");
}
if (localStorage.getItem("profile") == null) {
  console.log("null");
  localStorage.setItem("profile", "{}");
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="928216406117-ll6epbevdvi7f5fcvel35f9n9tek0eic.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/Login"/>}></Route>
            <Route path="/notes" element={<NoSelection />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/notes/:noteNumber" element={<SavedNote />}></Route>
            <Route path="/notes/:noteNumber/edit" element={<Note />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
