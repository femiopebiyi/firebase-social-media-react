import React from 'react'
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom'

import './App.css';
import { Main } from './pages/main/main';
import { Login } from './pages/login';
import { Navbar } from './components/Navbar';
import { CreatePost } from './pages/create-post/create-post';
import { Profile } from './pages/Profile';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import { ProfileInd } from './pages/IndiProfile';
import { FaReact } from "react-icons/fa";

function App() {
  const [user]= useAuthState(auth)
  return (
    <div className="App">
      <div className= 'logo'><FaReact /></div>
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Main/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/createpost' element={<CreatePost/>}/>
          <Route path= {`/profile/${user?.uid}`} element={<Profile/>}/>
          <Route path= '/:userId' element={<ProfileInd/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
