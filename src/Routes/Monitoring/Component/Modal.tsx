import React, {useState} from 'react';
import { ModifiedImage } from '../Model/ModifiedImage.model';

interface ModalProps {
  onClose: () => void;
  imageList: ModifiedImage;
}


const Modal = ({onClose, imageList}: ModalProps) => {
  const [imgType, setImgType] = useState<'RGB' | 'NIR1' | 'NIR2'>('RGB');
  const onClickClose = () => onClose();
  
  const getImageSrc = () => imageList[imgType];
  
  return (
    <>
      <div className="monitoring-modal">
        <div className="monitoring-modal__wrap">
          <div className="monitoring-modal__title">
            {imgType}
          </div>
          <button className="monitoring-modal__close" onClick={onClickClose}>
            <svg width={24} viewBox="0 0 24 24" aria-hidden="true"
                 className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03">
              <g>
                <path
                  d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
              </g>
            </svg>
          </button>
          <div className="monitoring-modal__image">
            <img src={getImageSrc()} alt={`${imgType}${imageList.captureTime}`} loading="lazy"/>
          </div>
          <div className="monitoring-modal__list">
            <div onClick={() => setImgType('RGB')} className="monitoring-modal__list-image">
              <img src={imageList.RGB} alt="RGB" loading="lazy"/>
            </div>
            <div onClick={() => setImgType('NIR1')} className="monitoring-modal__list-image">
              <img src={imageList.NIR1} alt="NIR1" loading="lazy"/>
            </div>
            <div onClick={() => setImgType('NIR2')} className="monitoring-modal__list-image">
              <img src={imageList.NIR2} alt="NIR2" loading="lazy"/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
