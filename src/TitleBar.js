function TitleBar({tabsVisible, setTabsVisible}) {

  return (
    <nav>
      <div id="burger-button" className="button" onClick={() => (tabsVisible) ? setTabsVisible(false):setTabsVisible(true)}>&#9776;</div>
      <div id="page-title">
        <h1 id="page-name">Lotion</h1>
        <p id="page-caption">Like Notion, but worse.</p>
      </div>
    </nav>
  );
}

export default TitleBar;
