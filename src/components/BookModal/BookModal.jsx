import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './BookModal.module.css'; 
import TextToSpeech from '../TextToSpeech/TextToSpeech';

const BookModal = ({ showModal, handleModalClose, currentPage, handlePrevPage, handleNextPage, bookContent  }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    handleModalOpen(); 
  }, [currentPage]); 

  const generateAudio = (text) => {
    setAudioUrl(null); 
  };

  const handleModalOpen = () => {
    const text = bookContent[currentPage]?.eng_content; 
    generateAudio(text);
  };

  return (
    <Modal show={showModal} onHide={handleModalClose} size="xl">
      <Modal.Body style={{ overflow: 'hidden' }}>
        {bookContent[currentPage] && (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {audioUrl && <audio controls autoPlay><source src={audioUrl} type="audio/mpeg" /></audio>}
          <div>
          <h4>{bookContent[currentPage].eng_content}</h4>
          <h4>{bookContent[currentPage].thai_content}</h4></div>
          <img className={styles.imgModal} src={bookContent[currentPage].url}/>
        </div>
            )}

      </Modal.Body>
     
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          ปิด
        </Button>
        <Button variant="primary" onClick={handlePrevPage} disabled={currentPage === 0}>
          หน้าก่อนหน้า
        </Button>
        <Button variant="primary" onClick={handleNextPage} disabled={currentPage === bookContent.length - 1}>
          หน้าถัดไป
        </Button>
        <TextToSpeech text={bookContent[currentPage]?.eng_content} /> 
      </Modal.Footer>
    </Modal>
  );
};

export default BookModal;