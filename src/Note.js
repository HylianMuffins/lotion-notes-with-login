import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TabsBar from './TabsBar';

function Note() {
  const [setNoteNumberState, tabsVisible, noteNumberState, profile, saveNote, deleteNote] = useOutletContext();
  const navigate = useNavigate();
  const { noteNumber } = useParams();
  const noteList = JSON.parse(localStorage.getItem("noteList"));
  const noteInfo = noteList[noteNumber - 1];
  let {title, noteDate, content} = noteInfo;

  const [value, setValue] = useState(content);
  useEffect(() => { setValue(content)}, [content] )
  const titleElement = useRef();
  const dateElement = useRef();

  const onSave = () => {
    noteInfo.title = titleElement.current.value;
    noteInfo.date = dateElement.current.value;
    noteInfo.content = value;
    if (saveNote(profile, noteInfo)) {
      localStorage.setItem("noteList", JSON.stringify(noteList));
      navigate("/notes/" + noteNumber);
    } else {
      window.alert("Error saving note.\nPlease try again.");
    }
  }

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

  return (
    <>
      <TabsBar tabsVisible={tabsVisible} noteNumberState={noteNumberState} setNoteNumberState={setNoteNumberState}/>
      <section className={'note '}>
        <header className='note-header'>
          <div className='note-info'>
            <textarea rows="1" type='text' className='note-title-input' defaultValue={title} ref={titleElement}></textarea>
            <input type="datetime-local" defaultValue={noteDate} ref={dateElement}/>
          </div>
          <div className='note-buttons'>
            <div itemID='save' className='button' onClick={onSave}>Save</div>
            <div itemID='delete' className='button' onClick={onDelete}>Delete</div>
          </div>
        </header>
        <ReactQuill 
          theme="snow" 
          value={value}
          onChange={setValue} 
          placeholder="Your Note Here"
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

export default Note;