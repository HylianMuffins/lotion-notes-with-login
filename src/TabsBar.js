import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Tab from "./Tab";

function TabsBar({tabsVisible, noteNumberState, setNoteNumberState}) {
  const navigate = useNavigate();

  if (tabsVisible) {
    const addNote = () => {
      // Initialize date as current date-time
      let  now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      let date = now.toISOString().slice(0,16);

      // Pull saved note info from localStorage, add new note to the start and navigate to it
      const noteList = JSON.parse(localStorage.getItem("noteList"));
      noteList.unshift({
        id : uuidv4(),
        title : "Untitled",
        date : date,
        text : ""
      });
      localStorage.setItem("noteList", JSON.stringify(noteList));

      setNoteNumberState(1);
      navigate("/notes/1/edit");
    }

    const noteList = JSON.parse(localStorage.getItem("noteList"));
    let noteIndex = 1;
    const tabs = noteList.map((note) => (
      <Tab 
        key={note.id} 
        noteIndex={noteIndex} 
        setNoteNumberState={setNoteNumberState} 
        title={note.title} 
        text={note.text} 
        date={note.date}
        currentStatus={(parseInt(noteNumberState) === noteIndex++) ? "current-tab" : ""}
      />
    ));

    return (
      <div id="tabs-bar">
        <div id="tabs-header">
            <h2 id="notes-title">Notes</h2>
            <div id="add-note" className="button" onClick={addNote}>+</div>
        </div>
        <div id="tabs">
          {tabs}
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
  
export default TabsBar;