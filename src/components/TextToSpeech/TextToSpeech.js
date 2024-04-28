import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
const TextToSpeech = ({ text }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const u = new SpeechSynthesisUtterance(text);
    setUtterance(u);
  }, [text]);

  const handlePlay = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.speak(utterance);
    }
    setIsPaused(true);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPaused(false);
  };

  return (
    <div>
      <button type="button" className="btn btn-info m-1" onClick={handlePlay}>{isPaused ? "อ่าน" : "อ่าน"}</button>
      <button type="button" className="btn btn-info" onClick={handleStop}>หยุดอ่าน</button>
    </div>
  );
};

export default TextToSpeech;
