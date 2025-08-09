import React from 'react';
import { Helmet } from 'react-helmet-async';

const Title = ({ title }) => {
  const baseTitle = 'Whip In Time';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
    </Helmet>
  );
};

export default Title;
