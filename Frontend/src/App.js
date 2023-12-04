
import { useState } from 'react';
import './App.css';
import Home from "./pages/Home";
import Contact from "./pages/Contact"
import About from "./pages/About"
import Navbar from './components/Navbar';
import {BrowserRouter, Route,Routes} from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'
import CreateMeeting from './pages/CreateMeeting';
import JoinMeeting from './pages/JoinMeeting';
import ChatRoom from './pages/ChatRoom';

function App() {
  const [progress, setProgress] = useState(0)
  return (
    <>
    <BrowserRouter>
      <LoadingBar
        color='#F4B400'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
    <Routes>
      <Route path='/' element={<Navbar/>}>
        <Route index element={<Home setProgress={setProgress}/>}/>
        <Route path='/about' element={<About setProgress={setProgress}/>}/>
        <Route path='/contact' element={<Contact setProgress={setProgress}/>}/>
        
        <Route path='/Create-Room' element={<CreateMeeting setProgress={setProgress}/>}/>
        <Route path='/Join-Room' element={<JoinMeeting setProgress={setProgress}/>}/>

        
        <Route path='/chat-room' element={<ChatRoom setProgress={setProgress}/>}/>
      </Route>
    </Routes>
    
    </BrowserRouter>
    </>
  );
}

export default App;
