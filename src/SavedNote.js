import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function SavedNote() {
  const [setNoteNumberState] = useOutletContext();
  const navigate = useNavigate();
  const { noteNumber } = useParams();
  const noteList = JSON.parse(localStorage.getItem("noteList"));
  const noteInfo = noteList[noteNumber - 1];
  let {title, date, text} = noteInfo;
  console.log(text);

  const [value, setValue] = useState(text);
  useEffect(() => { setValue(text)}, [text] )

  const deleteNote = () => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      noteList.splice(noteNumber - 1, 1);
      localStorage.setItem("noteList", JSON.stringify(noteList));
      if (noteList.length === 0) {
        navigate("/notes");
      }
      else {
        if (noteList.length >= noteNumber) {
          setNoteNumberState(noteNumber);
          navigate("/notes/" + (noteNumber));
        }
        else {
          setNoteNumberState(noteNumber - 1);
          navigate("/notes/" + (noteNumber - 1));
        }
      }
    }
  }

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", options);
    if (formatted === "Invalid Date") {
      return "";
    }
    return formatted;
  };

  return (
    <section className={'note saved'}>
      <header className='note-header'>
        <div className='note-info'>
          <h2 rows="1" className='note-title'>{title}</h2>
          <p className='note-date'>{formatDate(date)}</p>
        </div>
        <div className='note-buttons'>
          <div itemID='edit' className='button' onClick={() => {navigate("/notes/" + noteNumber + "/edit")}}>Edit</div>
          <div itemID='delete' className='button' onClick={deleteNote}>Delete</div>
        </div>
      </header>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue} 
        readOnly={true}
        modules={{
          clipboard: {
            matchVisual: false
          }
        }}
      />
    </section>
  );
}

export default SavedNote