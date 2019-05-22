import React, { useRef } from "react";
import "./MediaDevices.css";

function MediaDevices(props) {
    const videoRef = useRef(null);

    const mediaConstraint = {
        video: true
    };
    let mediaStream;

    const onGetUserMedia = async () => {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraint);
            videoRef.current.srcObject = mediaStream;
        } catch (e) {
            alert('Unable to capture video: ' + e);
        }
    }
    
    const onGetDisplayMedia = async () => {
        try {
            mediaStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraint);
            videoRef.current.srcObject = mediaStream;
        } catch (e) {
            alert('Unable to capture display: ' + e);
        }
    }

    const onStop = async () => {
        try {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) {
            alert('Unable to stop media stream: '+ e);
        }
    }

    return <div className="MediaDevices">
        <h1>Media Devices Example!</h1>
        <video ref={videoRef} width="640" height="320" autoPlay className="Video"></video>
        <button onClick={onGetUserMedia}>getUserMedia</button>
        <button onClick={onGetDisplayMedia}>getDisplayMedia</button>
        <button onClick={onStop}>Stop</button>
    </div>;
}

export default MediaDevices;