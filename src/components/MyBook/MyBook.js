import React from 'react';
import styles from '../BookFav/BookFav.module.css';
import Navbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import TextToSpeech from '../TextToSpeech/TextToSpeech';
import { useState } from 'react';
import { collection, query, where,addDoc, getDocs,setDoc, doc, onSnapshot,getDoc  } from 'firebase/firestore'; 
import { firestore } from '../../firebase';
import { useUserAuth } from '../../context/UserAuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const MyBook = () => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const myBookCoverUrl = localStorage.getItem('myBookCover');
  const sceneImages = JSON.parse(localStorage.getItem('sceneImages'));
  console.log(typeof sceneImages);
  const { user } = useUserAuth();
  const userid = user.uid;
  const storyData = JSON.parse(localStorage.getItem('storyData'));
  const generatedScenesString = storyData.generated_scenes;
  const modifiedGeneratedScenesString = generatedScenesString.replace(/^\s*`/, '');
  const modifiedGeneratedScenesString2 = modifiedGeneratedScenesString.replace(/^`|`$/g, '');
  const generatedScenes = JSON.parse(modifiedGeneratedScenesString2);
  const storage = getStorage();

  const uploadImageToStorage = async (blobUrl, userId) => {
      const storageRef = ref(storage, `images/${userId}/${Date.now()}.jpg`);
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);
      return imageUrl;
    };

  const convertBlobUrlToBase64 = (blobUrl) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function() {
        const reader = new FileReader();
        reader.onloadend = function() {
          resolve(reader.result.split(',')[1]);
        }
        reader.onerror = reject;
        reader.readAsDataURL(xhr.response);
      };
      xhr.onerror = reject;
      xhr.open('GET', blobUrl);
      xhr.send();
    });
  };
  
  const convertObjectToBase64 = async (object) => {
    const base64Object = {};
    for (const key in object) {
      const base64String = await convertBlobUrlToBase64(object[key]);
      console.log(key)
      base64Object[key] = base64String;
    }
    return base64Object;
  };
  
  // แปลง object เป็น Base64 string
  convertObjectToBase64(sceneImages)
    .then((base64Object) => {
      console.log(base64Object);
    })
    .catch((error) => {
      console.error('Error converting object to Base64:', error);
    });
  
  
  
  const [imageUrl, setImageUrl] = useState('');
  
  const saveBookToFirestore = async (userId, bookData) => {
    try {
      bookData.userId = userId;
      const docRef = await addDoc(collection(firestore, 'saved'), bookData);
      console.log('Book added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  };

  const handleSaveBookClick = () => {
    saveBookToFirestore(userid, generatedScenes);
  };
  
  const generateAudio = (text) => {
    setAudioUrl(null);
  };

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
    const sceneKeys = Object.keys(generatedScenes.scenes);
    if (currentSceneIndex < sceneKeys.length - 1) {
      setCurrentSceneIndex(prevIndex => prevIndex + 1);
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
        <h2>{generatedScenes.title}</h2>
        <h3>{generatedScenes.title_thai}</h3>
          <div className='card p-3 mt-5 mb-3'>
            <div class="card-body">
              <p class="card-text">{generatedScenes.synopsis}</p>
            </div>
          </div>
          <div className='d-flex justify-content-center align-items-center '>
                <button type="button" className="btn btn-outline-info"onClick={handleSaveBookClick(user.uid)}>
                  <i className="fa-regular fa-floppy-disk"></i>&nbsp;บันทึก
                </button>
          </div>
          <hr></hr>
        </div>
      </div>
          
      

      <Modal show={modalOpen} onHide={handleCloseModal} size="xl">
      <Modal.Header closeButton>
          <Modal.Title>{generatedScenes.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body  style={{ overflow: 'hidden' }}>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {audioUrl && <audio controls autoPlay><source src={audioUrl} type="audio/mpeg" /></audio>}
          <div>
          <p>{generatedScenes.scenes[`0${currentSceneIndex + 1}`].eng}</p>
          <p>{generatedScenes.scenes[`0${currentSceneIndex + 1}`].thai}</p>
          </div> 
          <img className={styles.imgModal} src={sceneImages[`0${currentSceneIndex + 1}`]} />
          </div>
        </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={handlePreviousScene} disabled={currentSceneIndex === 0}>
            หน้าก่อนหน้า
          </Button>

          <TextToSpeech text={generatedScenes.scenes[`0${currentSceneIndex + 1}`].eng} />
          <Button variant="primary" onClick={handleNextScene} disabled={currentSceneIndex === Object.keys(generatedScenes.scenes).length - 1}>
            หน้าถัดไป
          </Button>
          
      </Modal.Footer>
    </Modal>
      </div>
  );
};

export default MyBook;