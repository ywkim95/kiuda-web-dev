import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from "react-responsive-carousel";
import {useNavigate} from "react-router-dom";
import { Image } from '../../../../Common/Model/Image.model';
import axios from 'axios';
import { useRoomIdStore } from '../../../../Common/Store/roomIdStore';


const Camera = () => {
  const [imageList, setImageList] = useState<Image[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const roomId = useRoomIdStore(state => state.roomId);
  
  const navigate = useNavigate();
  const next = () => {
    if (currentSlide === imageList.length - 1) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide((prevState) => prevState + 1);
    }
  }
  
  const prev = () => {
    if (currentSlide === 0) {
      setCurrentSlide(imageList.length - 1);
    } else {
      setCurrentSlide((prevState) => prevState - 1);
    }
  }
  
  const onChangeSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };
  
  const onClickImg = () => {
    navigate('/monitorings');
  };
  
  useEffect(() => {
    axios.get(`/monitoring/${roomId}/today`).then((response) => {
      setImageList(response.data);
    }).then(() => {
      setCurrentSlide(0);
    });
  }, [roomId]);
  
  return (
    <div className="camera">
      <div className="camera__title">
        <div className="camera__title-text">카메라 01</div>
      </div>
      <div className="camera__screen">
        <div className="camera__screen-image">
          <Carousel
            autoPlay={false}
            showArrows={false}
            showThumbs={false}
            showStatus={false}
            infiniteLoop={false}
            selectedItem={currentSlide}
            onChange={onChangeSlide}
            emulateTouch={true}
          >
            {
              imageList.map((image, index) => {
                return (
                  <div onClick={onClickImg} className="pointer" key={image.id}>
                    <img src={image.imageUrl} alt="카메라 이미지" loading="lazy"/>
                  </div>
                );
              })
            }
          </Carousel>
          {/*<img src="/assets/image/example.jpg" className="camera__example-img" alt="카메라 이미지"/>*/}
        </div>
      </div>
      <div className="camera__control">
        <button className="camera__control-button" onClick={prev}>
          <FontAwesomeIcon icon={faChevronLeft}/>
        </button>
        <div className="camera__page">
          <span>{currentSlide + 1}</span>
          <span>/</span>
          <span>{imageList.length}</span>
        </div>
        <button className="camera__control-button" onClick={next}>
          <FontAwesomeIcon icon={faChevronRight}/>
        </button>
      </div>
    </div>
  );
};

export default Camera;
