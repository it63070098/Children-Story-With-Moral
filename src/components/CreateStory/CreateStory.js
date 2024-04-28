import React, { useState, useEffect } from 'react';
import styles from "./CreateStory.module.css";
import headerimg from "../../image/header-img.svg";
import { checkbox } from "../filter/filter";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import MyBook from '../MyBook/MyBook'
import { Spinner } from 'react-bootstrap';

const ageOptions = checkbox.filter(item => item.id === 'age');
const moralOptions = checkbox.filter(item => item.id === 'moral');
const genreOptions = checkbox.filter(item => item.id === 'genre');

const CreateStory = () => {
  const navigate = useNavigate();
  const [storyData, setStoryData] = useState({
    story: '',
    total_time: 0,
  });
  const [loading, setLoading] = useState(false);
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedMoral, setSelectedMoral] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const createImageFromCover = (cover) => {
    async function query(data) {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      return result;
    }
    query({"inputs": cover}).then((response) => {
        // สร้าง URL สำหรับ Blob ที่ได้รับ
        console.log(`cover`);
        const imgUrl = URL.createObjectURL(response);
        localStorage.setItem('myBookCover', imgUrl);
        console.log(`Image for cover created successfully.`);
    }).catch(error => {
        console.error('Error while creating image:', error);
    });
  };
  const createImageForScene = async (prompt) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { Authorization: "Bearer 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" },
                method: "POST",
                body: JSON.stringify({ "inputs": prompt }),
            }
        );
        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        return imgUrl;
    } catch (error) {
        console.error('Error while creating image:', error);
        throw error;
    }
};

  const handleCreateStory = async () => {
    setLoading(true);
    try {
        const response = await fetch('http://localhost:5000/generate_story', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                age: selectedAge,
                moral: selectedMoral,
                genre: selectedGenre,
            }),
        });
        const data = await response.json();
        console.log(data);
        setStoryData(data);
        console.log(data.generated_scenes)
        const generatedScenesString = data.generated_scenes;
        const modifiedGeneratedScenesString = generatedScenesString.replace(/^\s*`/, '');
        const modifiedGeneratedScenesString2 = modifiedGeneratedScenesString.replace(/^`|`$/g, '');
        const generatedScenes = JSON.parse(modifiedGeneratedScenesString2);
        console.log(generatedScenes)
        //generatedScenes.cover
        console.log(generatedScenes.scenes)
        createImageFromCover(generatedScenes.cover);
        
        // บันทึกข้อมูลใน localStorage
        localStorage.setItem('storyData', JSON.stringify(data));
        // setLoading(false);
        // navigate('/mybook'); // นำทางไปยังหน้า MyBook


        const sceneImages = {};
        for (const sceneKey in generatedScenes.scenes) {
            if (generatedScenes.scenes.hasOwnProperty(sceneKey)) {
                const imageUrl = generatedScenes.scenes[sceneKey].image;
                const imgUrl = await createImageForScene(imageUrl);
                sceneImages[sceneKey] = imgUrl;
            }
        }
        console.log(sceneImages)
        localStorage.setItem('sceneImages', JSON.stringify(sceneImages));
        setLoading(false);
        navigate('/mybook');

              
   
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
    }
};

  return (
    <div>
    <div className={`${styles.heroWrapper} center`}>
      <div className={`${styles.heroInner}`}>
        <img src={headerimg} alt="" />
        <h2 className={styles.headerText}>
          สวัสดี, เริ่มสร้างนิทานเลย!
        </h2>
        <div className={styles.slogan}>
          <p>คุณสามารถสร้างนิทานที่คุณอยากอ่านได้ตามต้องการ</p>
        </div>
      </div>
      <div className={`${styles.inputLocation}`}>
        <form className="row mx-auto">
          <div className="col-md-3">
            <label htmlFor="ageSelect" className="form-label">
              ช่วงอายุ
            </label>
            <select
              id="ageSelect"
              className="form-select"
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              required
            >
              <option selected disabled value="">
                เลือกอายุ
              </option>
              {ageOptions.map((option) => (
                <option key={option.label}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="moralSelect" className="form-label">
              คุณธรรม
            </label>
            <select
              id="moralSelect"
              className="form-select"
              value={selectedMoral}
              onChange={(e) => setSelectedMoral(e.target.value)}
              required
            >
              <option selected disabled value="">
                เลือกคุณธรรม
              </option>
              {moralOptions.map((option) => (
                <option key={option.label}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="genreSelect" className="form-label">
              ประเภทนิทาน
            </label>
            <select
              id="genreSelect"
              className="form-select"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              required
            >
              <option selected disabled value="">
                เลือกประเภท
              </option>
              {genreOptions.map((option) => (
                <option key={option.label}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-3 mt-2 d-flex flex-column justify-content-end">
            <button
              type="button"
              className="btn btn-info button-create"
              onClick={handleCreateStory}>
               {loading ? ( 
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                <>
              <i className="fas fa-pen"></i>&nbsp;สร้าง
              </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>  
    
  );
};

export default CreateStory;
