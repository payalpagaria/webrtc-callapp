import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SocketProvider } from './providers/SocketProvider';
import JoinRoom from './pages/JoinRoom/JoinRoom';
import MeetingRoom from './pages/MeetingRoom/MeetingRoom';
function App() {
  return (
   <>
      <Router>
      <SocketProvider>

          <Routes>
              <Route path='/' element={<JoinRoom/>}/>
              <Route path='/meetingroom/:id' element={<MeetingRoom/>}/>
          </Routes>
          </SocketProvider>

      </Router>
   </>
  );
}

export default App;
