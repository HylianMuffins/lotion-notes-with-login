import { Outlet, useParams } from "react-router-dom";
import React, { useState } from 'react';
import TitleBar from './TitleBar';

function Layout() {
  const { noteNumber } = useParams();
  const [tabsVisible, setTabsVisible] = useState(true);
  const [noteNumberState, setNoteNumberState] = useState(noteNumber);

  return (
      <>
        <TitleBar tabsVisible={tabsVisible} setTabsVisible={setTabsVisible}/>
        <main>
          <Outlet context={[setNoteNumberState, tabsVisible, noteNumberState]}/>
        </main>
      </> 
  );
}

export default Layout;
