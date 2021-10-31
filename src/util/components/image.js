  
import React, { useEffect,useState} from "react";
import useProgressiveImg from './../hooks/progressiverImage';
import imageService from './../services/ImageService';
import configration from './../configration';

const Image = (props) => {
  const { sourceSmall, sourceMedium, styles, ...otherProps } = props
  const [url,setUrl]=useState(configration.SERVER_URL_1) ;
  
  useEffect(() => {
    setUrl(imageService.getUrl());
  },[])
  
  const [src, { blur }] = useProgressiveImg(url + sourceSmall, url + sourceMedium);

  return (
    <React.Fragment>
      <img src={src} alt="" style={{ ...styles, filter: blur ? "blur(20px)" : "none", transition: blur ? "none" : "filter 0.3s ease-out" }} {...otherProps}></img>
    </React.Fragment>
  );
};

export default Image;