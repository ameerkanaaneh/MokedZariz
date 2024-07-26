import React, { useState, useRef } from 'react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { redirect } from "react-router-dom";

const RecordAudioPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/wav' });
      setAudioBlob(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const sendAudio = async () => {
    // Replace with your back-end API endpoint
    const apiEndpoint = 'http://localhost:3002/upload';

    const formData = new FormData();
    formData.append('voice', audioBlob, 'audio.wav'); // Append the audio blob with a filename
    formData.append('latitude', '1.2'); // Replace with actual latitude value
    formData.append('longitude', '3.4'); // Replace with actual longitude value

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Success:', data);
      redirect("/home");
    } catch (error) {
      console.error('Error:', error);
    }
   
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1 className="text-center mb-4">Record Audio</h1>
          {recording ? (
            <Button variant="danger" onClick={stopRecording} className="mb-3">
              Stop Recording
            </Button>
          ) : (
            <Button variant="primary" onClick={startRecording} className="mb-3">
              Start Recording
            </Button>
          )}
          {audioURL && (
            <div className="mt-3">
              <Alert variant="info">Recording completed! Listen below:</Alert>
              <audio controls src={audioURL} className="w-100 mb-3"></audio>
              <Button variant="success" onClick={sendAudio}>
                Send Audio
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecordAudioPage;
