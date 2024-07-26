import React, { useState, useRef } from 'react';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';

const RecordAudioPage = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      const audioBlob = new Blob([event.data], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    setRecording(false);
    mediaRecorderRef.current.stop();
  };

  const sendAudio = () => {
    // Replace with your back-end API endpoint
    const apiEndpoint = 'YOUR_BACKEND_API_ENDPOINT';
    
    fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: audioURL, // Send the audio blob or URL here
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
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
