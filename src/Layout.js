import { Outlet, useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import TitleBar from './TitleBar';
import axios from 'axios';

function Layout() {

  const { noteNumber } = useParams();
  const [tabsVisible, setTabsVisible] = useState(true);
  const [noteNumberState, setNoteNumberState] = useState(noteNumber);
  const navigate = useNavigate();

  let storageProfile = JSON.parse(localStorage.getItem("profile"));
  const [ user, setUser ] = useState();
  const [ profile, setProfile ] = useState(storageProfile);

  const verify = async (profile) => {
    let res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${profile.access_token}`, {});
    console.log(res.status);
    if (res.status === 401) {
      logOut();
    }
  }

  const getNotes = async (profile) => {
    verify(profile);
    let res = await fetch(`https://pi3gt5akc3hiywz32dkx54devu0vomfp.lambda-url.us-west-2.on.aws?email=${profile.email}`, {
        method : "GET",
        headers : {
          "email": profile.email,
          "access_token" : profile.access_token
        }
    });
    if (res.status === 200) {
      let notes = await res.json();
      return notes;
    } else {
      return false;
    }
  }

  const saveNote = async (profile, noteInfo) => {
    let res = await fetch("https://vpaoug4ca5nrbb2aujmy3ismem0wkypv.lambda-url.us-west-2.on.aws", {
        method : "POST",
        headers : {
          "email": profile.email,
          "access_token" : profile.access_token
        },
        body : JSON.stringify(noteInfo)
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  const deleteNote = async (profile, noteInfo) => {
    let id = noteInfo.id;
    let res = await fetch(`https://6wfogup3y6ceugfhtm3f2xhrbm0ukxmi.lambda-url.us-west-2.on.aws?email=${profile.email}&id=${id}`, {
        method : "DELETE",
        headers : {
          "email": profile.email,
          "access_token" : profile.access_token
        }
    });
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  const login = useGoogleLogin({
      onSuccess: (codeResponse) => {
        setUser(codeResponse);
      },
      onError: (error) => console.log('Login Failed:', error)
  });

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      console.log("logout");
      googleLogout();
      localStorage.setItem("personal", "");
      setProfile({});
  };

  useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                      setProfile({...res.data, "access_token" : user.access_token});
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  useEffect( () => {
    async function fetchData() {
      if (Object.keys(profile).length !== 0) {
        localStorage.setItem("profile", JSON.stringify(profile));
        let notes = await getNotes(profile);
        if (!notes) {
          window.alert("Error loading notes.\nPlease log in again.");
          navigate("/");
        }
        localStorage.setItem("noteList", JSON.stringify(notes));
        console.log("notes loaded");
        navigate("/notes");
      }
      else {
        localStorage.setItem("profile", "{}")
        navigate("/")
      }
    }
    fetchData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ profile ]
  );

  return (
      <>
        <TitleBar tabsVisible={tabsVisible} setTabsVisible={setTabsVisible} profile={profile} logOut={logOut}/>
        <main>
          {(Object.keys(profile).length !== 0) ? 
            <Outlet context={[setNoteNumberState, tabsVisible, noteNumberState, profile, saveNote, deleteNote]}/> :
            <Outlet context={[login]}/>
          }
        </main>
      </> 
  );
}

export default Layout;