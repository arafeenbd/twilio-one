import React, {useState, useEffect, useRef} from 'react';
import './App.css';
import StartForm from './StartForm';
import TwilioVideo from "twilio-video";

const Video = ({ token }) => {
  const localVidRef = useRef()
  const remoteVidRef = useRef()

  useEffect(() => {
    TwilioVideo.connect(token, { video: true, audio: true, name: "test" }).then(
      room => {
        // Attach the local video
        alert(token);
        TwilioVideo.createLocalVideoTrack().then(track => {
          localVidRef.current.appendChild(track.attach())
        })

        const addParticipant = participant => {
          console.log("new participant!")
          alert("new participant!")
          console.log(participant)
          participant.tracks.forEach(publication => {
            if (publication.isSubscribed) {
              const track = publication.track

              remoteVidRef.current.appendChild(track.attach())
              console.log("attached to remote video")
            }
          })

          participant.on("trackSubscribed", track => {
            console.log("track subscribed")
            remoteVidRef.current.appendChild(track.attach())
          })
        }

        room.participants.forEach(addParticipant)
        room.on("participantConnected", addParticipant)
      },error => {
        console.error(`Unable to connect to Room: ${error.message}`);
        alert(`Unable to connect to Room: ${error.message}`)
      }
    )
  }, [token])

  return (
    <div>
      <div ref={localVidRef} />
      <div ref={remoteVidRef} />
    </div>
  )
}

function App() {
  const [token, setToken] = useState(false)
  return (
    <div className="App">
      <header className="App-header">
        <div>
        {!token ? <StartForm storeToken={setToken} /> : <Video token={token} />}
        </div>
      </header>
    </div>
  );
}

export default App;
