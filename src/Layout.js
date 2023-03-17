import { Outlet, useParams } from "react-router-dom";
import React, { useState } from 'react';
import TitleBar from './TitleBar';
import TabsBar from './TabsBar';

function Layout() {
  const { noteNumber } = useParams();
  const [tabsVisible, setTabsVisible] = useState(true);
  const [noteNumberState, setNoteNumberState] = useState(noteNumber);

  return (
      <>
        <TitleBar tabsVisible={tabsVisible} setTabsVisible={setTabsVisible}/>
        <main>
          <TabsBar tabsVisible={tabsVisible} noteNumberState={noteNumberState} setNoteNumberState={setNoteNumberState}/>
          <Outlet context={[setNoteNumberState]}/>
        </main>
      </> 
  );
}

export default Layout;
