import { useLocation } from 'react-router-dom';
import React from 'react';
import TextToSpeech from '../TextToSpeech/TextToSpeech';
import { Modal, Button } from 'react-bootstrap';
import styles from '../BookDetail/BookDetail.module.css';
import { useEffect, useState } from 'react';
import { firestore } from '../../firebase';
import { collection, query, where,addDoc, getDocs,setDoc, doc, onSnapshot  } from 'firebase/firestore'; 
import Navbar from '../Navbar/Navbar';
import { useUserAuth } from '../../context/UserAuthContext'

const BookDetail = () => {
  const location = useLocation();
  const book = location.state;
  console.log(book)
  const { user } = useUserAuth();
  // console.log(user.uid);
  const userid = user.uid;
  const [audioUrl, setAudioUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const myBookCoverUrl = localStorage.getItem('myBookCover');


  const handleStartReading = (index) => {
    setCurrentSceneIndex(index);
    setModalOpen(true);
  };
  

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handlePreviousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prevIndex => prevIndex - 1); // ลดค่า currentSceneIndex ลง 1
    }
  };
  
  const handleNextScene = () => {
    const sceneKeys = Object.keys(book.scenes);
    if (currentSceneIndex < sceneKeys.length - 1) {
      setCurrentSceneIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const [message, setMessage] = useState('');

  // ข้อเสนอแนะ
  const sendSuggestion = async () => {
    try {
      
      await addDoc(collection(firestore, `saved/${book.id}/feedback`), {
        message,
        userId: userid,
        timestamp: new Date(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending suggestion:', error);
    }
  };
  return (
    <div>
      <Navbar />
     <div className={styles.bookDetails}>
        <div className={styles.leftSide}>
          <img className={styles.bookImage} src={myBookCoverUrl} alt="Book Image" />
          <div className='d-flex justify-content-center align-items-center'>
            <button type="button" className="btn btn-info" onClick={() => handleStartReading(0)}>
                    <i className=""></i>&nbsp;เริ่มอ่านเลย!
            </button>
          </div>
        </div>
        <div className={`${styles.rightSide}`}>
        <h2>{book.title}</h2>
        <h3>{book.title_thai}</h3>
          <div className='card p-3 mt-5 mb-3'>
            <div class="card-body">
              <p class="card-text">{book.synopsis}</p>
            </div>
          </div>
          <div className='d-flex justify-content-center align-items-center '>
          </div>
          
          <hr></hr>
          
          <p class="mt-3">ข้อเสนอแนะ</p>
          <div class="input-group input-group-sm mb-3">
              <input
              type="text"
              className="form-control"
              placeholder="เขียนข้อเสนอแนะ"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button class="btn btn-outline-secondary" type="button" id="button-addon2" onClick={sendSuggestion}>ส่ง</button>
          </div>
        </div>
      </div>
          
      

      <Modal show={modalOpen} onHide={handleCloseModal} size="xl">
      <Modal.Header closeButton>
          <Modal.Title>{book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body  style={{ overflow: 'hidden' }}>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {audioUrl && <audio controls autoPlay><source src={audioUrl} type="audio/mpeg" /></audio>}
          <div>
          <p>{book.scenes[`0${currentSceneIndex + 1}`].eng}</p>
          <p>{book.scenes[`0${currentSceneIndex + 1}`].thai}</p>
          </div> 
          </div>
        </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handlePreviousScene} disabled={currentSceneIndex === 0}>
            หน้าก่อนหน้า
          </Button>

          <TextToSpeech text={book.scenes[`0${currentSceneIndex + 1}`].eng} />
          <Button variant="primary" onClick={handleNextScene} disabled={currentSceneIndex === Object.keys(book.scenes).length - 1}>
            หน้าถัดไป
          </Button>
          
      </Modal.Footer>
    </Modal>
    </div>
  );
};
export default BookDetail;
