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

  const getNotes = async (profile) => {
    let res = await fetch("https://pi3gt5akc3hiywz32dkx54devu0vomfp.lambda-url.us-west-2.on.aws/", {
        headers: {
        "email": profile.email,
        "access_token" : profile.access_token
        }
    });
    console.log(res);
    // let json = await res.json();
    // console.log(json);
    // let { notes } = json;
    // return notes;
  }

  getNotes(profile);

  // const saveNote = (profile, noteInfo) => {
  //   // call saveNotes API here
  // }

  // const deleteNote = (profile, noteInfo) => {
  //   // call deleteNotes API here
  // }

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

  useEffect(
      () => {
          if (Object.keys(profile).length !== 0) {
            localStorage.setItem("profile", JSON.stringify(profile))
            // localStorage.setItem("noteList", getNotes(profile));
            console.log("notes loaded");
            navigate("/notes");
          }
          else {
            localStorage.setItem("profile", "{}")
            navigate("/")
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [ profile ]
  );

  return (
      <>
        <TitleBar tabsVisible={tabsVisible} setTabsVisible={setTabsVisible} profile={profile} logOut={logOut}/>
        <main>
          {(Object.keys(profile).length !== 0) ? 
            <Outlet context={[setNoteNumberState, tabsVisible, noteNumberState, profile]}/> :
            <Outlet context={[login]}/>
          }
        </main>
      </> 
  );
}

export default Layout;
