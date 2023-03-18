function TitleBar({tabsVisible, setTabsVisible, profile, logOut}) {

  return (
    <nav>
      <div id="burger-button" className="button" onClick={() => (tabsVisible) ? setTabsVisible(false):setTabsVisible(true)}>&#9776;</div>
      <div id="page-title">
        <h1 id="page-name">Lotion</h1>
        <p id="page-caption">Like Notion, but worse.</p>
      </div>
      {(Object.keys(profile).length !== 0) ?
        <div id="profile">
          <span id="email">{profile.email}</span>
          <span id="log-out" className="underline" onClick={logOut}>Log-out</span>
        </div> 
        :
        <></>
        }
    </nav>
  );
}

export default TitleBar;
