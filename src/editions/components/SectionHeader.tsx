import React from 'react';
import { SectionHeaderProps } from '../types';

const SectionHeader: React.FC<SectionHeaderProps> = ({ id, title }) => {
  return (
    <div className="section-header" id={id}>
      <h1>{title}</h1>
    </div>
  );
};

export default SectionHeader;