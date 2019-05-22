import React, { useRef } from "react";
import "./PeerConnection.css";

function PeerConnection(props) {
    const peerARemoteVideoRef = useRef(null);
    const peerALocalVideoRef = useRef(null);
    const peerBRemoteVideoRef = useRef(null);
    const peerBLocalVideoRef = useRef(null);

    let aStream;
    let bStream;
    let peerA;
    let peerB;

    const onStartCall = async () => {
        try {
            aStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            peerALocalVideoRef.current.srcObject = aStream;
            bStream = await navigator.mediaDevices.getUserMedia({ video: true });
            peerBLocalVideoRef.current.srcObject = bStream;

            // Normally it would be created with an RTCConfiguration as parameter
            // https://developer.mozilla.org/en-US/docs/Web/API/PeerConnection/PeerConnection
            peerA = new RTCPeerConnection();
            peerB = new RTCPeerConnection();

            peerA.ontrack = async (event) => {
                if (peerARemoteVideoRef.current.srcObject) return;
                peerARemoteVideoRef.current.srcObject = event.streams[0]; 
            }
            peerB.ontrack = async (event) => {
                if (peerBRemoteVideoRef.current.srcObject) return;
                peerBRemoteVideoRef.current.srcObject = event.streams[0]; 
            }
            peerA.onicecandidate = async (evt) => {
                try {
                    if (evt.candidate === null) return;
                    await peerB.addIceCandidate(evt.candidate);
                } catch (e) {
                    alert('Failed to add candidates to peerB: ' + e);
                }
            };
            peerB.onicecandidate = async (evt) => {
                try {
                    if (evt.candidate === null) return;
                    await peerA.addIceCandidate(evt.candidate);
                } catch (e) {
                    alert('Failed to add candidates to peerA: ' + e);
                }
            };

            // Add the video tracks to the Peer
            aStream.getTracks().forEach(track => peerA.addTrack(track, aStream));

            // Create an Offer and send to Peer B
            const offer = await peerA.createOffer();
            console.log(`Offer: ${JSON.stringify(offer)}`);
            await peerA.setLocalDescription(offer);

            // Create an Answer and send to Peer A
            await peerB.setRemoteDescription(peerA.localDescription);
            bStream.getTracks().forEach(track => peerB.addTrack(track, bStream));
            const answer = await peerB.createAnswer();
            console.log(`Answer: ${JSON.stringify(answer)}`);
            await peerB.setLocalDescription(answer);

            // Peer A receiving the Peer B description
            await peerA.setRemoteDescription(peerB.localDescription);
        } catch (e) {
            alert(`Call error ${e}`);
        }
    };

    return <div className="PeerConnection">
        <h1>PeerConnection Example!</h1>
        <div className="Videos">
            <div className="PeerA">
                <h2>Peer A</h2>
                <video ref={peerARemoteVideoRef} width="320" height="160" className="Video" autoPlay></video>
                <video ref={peerALocalVideoRef} width="160" height="80" className="Video" autoPlay></video>
            </div>

            <div className="PeerB">
                <h2>Peer B</h2>
                <video ref={peerBRemoteVideoRef} width="320" height="160" className="Video" autoPlay></video>
                <video ref={peerBLocalVideoRef} width="160" height="80" className="Video" autoPlay></video>
            </div>
        </div>
        <button onClick={onStartCall}>Call</button>
    </div>;
}

export default PeerConnection;
