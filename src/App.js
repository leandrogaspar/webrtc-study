import React from 'react';
import './App.css';

import MediaDevices from "./components/MediaDevices";
import PeerConnection from "./components/PeerConnection";

function App() {
  return (
    <div className="App">
      <MediaDevices></MediaDevices>
      <PeerConnection></PeerConnection>
    </div>
  );
}

export default App;
