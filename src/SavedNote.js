import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TabsBar from './TabsBar';

function SavedNote() {
  const [setNoteNumberState, tabsVisible, noteNumberState, profile, saveNote, deleteNote] = useOutletContext();

  // to handle saveNote unused warning
  if (false) {saveNote()}

  const navigate = useNavigate();
  const { noteNumber } = useParams();
  const noteList = JSON.parse(localStorage.getItem("noteList"));
  const noteInfo = noteList[noteNumber - 1];
  let {title, noteDate, content} = noteInfo;

  const [value, setValue] = useState(content);
  useEffect(() => { setValue(content)}, [content] )

  const onDelete = () => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
      if (deleteNote(profile, noteInfo)) {
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
      } else {
        window.alert("Error deleting note.\nPlease try again.");
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
    <>
      <TabsBar tabsVisible={tabsVisible} noteNumberState={noteNumberState} setNoteNumberState={setNoteNumberState}/>
      <section className={'note saved'}>
        <header className='note-header'>
          <div className='note-info'>
            <h2 rows="1" className='note-title'>{title}</h2>
            <p className='note-date'>{formatDate(noteDate)}</p>
          </div>
          <div className='note-buttons'>
            <div itemID='edit' className='button' onClick={() => {navigate("/notes/" + noteNumber + "/edit")}}>Edit</div>
            <div itemID='delete' className='button' onClick={onDelete}>Delete</div>
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
    </>
  );
}

export default SavedNote