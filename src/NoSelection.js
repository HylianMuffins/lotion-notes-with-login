import { useOutletContext } from "react-router-dom";
import TabsBar from './TabsBar';

function NoSelection() {
  const [setNoteNumberState, tabsVisible, noteNumberState, profile] = useOutletContext();
  console.log(profile);
  return (
      <>
        <TabsBar tabsVisible={tabsVisible} noteNumberState={noteNumberState} setNoteNumberState={setNoteNumberState}/>
        <div id="no-note">
          Select a note, or create a new one.
        </div>
      </>
      
    );
}
  
  export default NoSelection;