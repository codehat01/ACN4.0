import React from 'react';
import Slideshow from './Slideshow';
import { BoxListProps } from '../types';

const BoxList: React.FC<BoxListProps> = ({ data, hasSlideshow }) => {
  return (
    <ul className="box-list">
      {data.map((item, index) => (
        <li key={index} className="box-item">
          <div className="box-body">
            <div className="box-image" id={item.id}>
              {hasSlideshow && item.images ? (
                <Slideshow 
                  containerId={item.id}
                  images={item.images}
                  autoPlayInterval={2000}
                />
              ) : (
                <img 
                  src={item.image} 
                  alt={item.title} 
                  loading="lazy" 
                  decoding="async" 
                  width="600" 
                  height="400"
                />
              )}
            </div>
            <div className="box-text">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BoxList;