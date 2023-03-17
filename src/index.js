import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NoSelection from './NoSelection';
import Layout from './Layout';
import Note from './Note';
import SavedNote from './SavedNote';

if (localStorage.getItem("noteList") == null) {
  localStorage.setItem("noteList", JSON.stringify([]));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/notes"/>}></Route>
            <Route path="/notes" element={<NoSelection />}></Route>
            <Route path="/notes/:noteNumber" element={<SavedNote />}></Route>
            <Route path="/notes/:noteNumber/edit" element={<Note />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
