import React from 'react';
import moment from "moment";
import useOpenModal from "./useOpenModal";
import Modal from "./Modal";
import { ModifiedImage } from '../Model/ModifiedImage.model';

const ImageCell = ({index, value, ref}: { index: number, value: ModifiedImage, ref: ((node: HTMLTableRowElement | null) => void) | null }) => {
  const {isOpenModal, closeModal, openModal} = useOpenModal();
  const {captureTime} = value;

  const date = moment(captureTime,'YYYYMMDDHHmmss').format('YYYY년 MM월 DD일');
  const onClickItem = () => {
    openModal();
  };
  return (
    <div className="monitoring__grid-item" key={index + value.RGB + captureTime}>
      <div className="monitoring__grid-imageWrap">
        <div className="monitoring__grid-item--image" onClick={onClickItem}>
          <img alt="RGB" src={value.RGB}
               className="monitoring__eximg"/>
        </div>
        <div className="monitoring__grid-textOnImage">
          <span>상세보기</span>
        </div>
      </div>
      <div className="monitoring__grid-item--text">{date}</div>
      {isOpenModal && (<Modal imageList={value} onClose={closeModal}/>)}
    </div>
  );
};

export default ImageCell;
