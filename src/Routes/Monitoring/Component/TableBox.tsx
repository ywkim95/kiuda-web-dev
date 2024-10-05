import { useEffect, useState } from 'react';
import ImageCell from "./ImageCell";
import useImageListStore from '../Store/ImageListStore';
import Loading from '../../../Loading';
import { ModifiedImage } from '../Model/ModifiedImage.model';



const TableBox = ({callback} : {callback: (node: HTMLTableRowElement | null) => void}) => {
  const imageList = useImageListStore(state => state.imageList);
  const [modifiedImageList, setmodifiedImageList] = useState<ModifiedImage[]>([]);

  useEffect(() => {
    const newModifiedImageList = groupImagesByCaptureTime();
    setmodifiedImageList(newModifiedImageList);
  },[imageList]);

  const groupImagesByCaptureTime = (): ModifiedImage[] => {
    const groupedByCaptureTime: {[key: string]: ModifiedImage} = {};

    imageList.forEach((image)=> {
      if(!groupedByCaptureTime[image.captureTime]) {
        groupedByCaptureTime[image.captureTime] = {
          captureTime: image.captureTime,
        } as ModifiedImage;
      }

      groupedByCaptureTime[image.captureTime][image.imageClassification] = image.imageUrl;
    });

    return Object.values(groupedByCaptureTime);
  };
  
  if(imageList.length !== 0) {
    return (
      <div className="monitoring-table">
        <div className="monitoring__grid-container">
          {
            modifiedImageList.map((value, index) => {
              const isLastImage = modifiedImageList.length === index + 1;
              return (<ImageCell ref={isLastImage ? callback : null} index={index} key={value.captureTime + value.RGB} value={value}/>);
            })
          }
        </div>
      </div>
    );
  } else {
    return (
      <Loading/>
    )
  }
};

export default TableBox;
