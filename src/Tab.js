import { useNavigate } from "react-router-dom";

function Tab({noteIndex, setNoteNumberState, title, text, date, currentStatus}) {
  const navigate = useNavigate();

  if (text === "" || text === "<p><br></p>") {
    text = "<p>...</p>";
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

  const _ = require('lodash');

  return (
      <div className={"tab button " + currentStatus} onClick={() => {
        setNoteNumberState(noteIndex);
        navigate("/notes/" + noteIndex)
      }}>
      <h3 className="tab-title">{title}</h3>
      <p className="tab-date">{formatDate(date)}</p>
      <div className="tab-text" 
        dangerouslySetInnerHTML={{__html: _.truncate(text, {'length': 75, 'omission': '...'})}} 
      />
    </div>
  );
}

export default Tab;