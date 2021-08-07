import React from 'react';
import { Helmet } from 'react-helmet';
const Meta = ({
  title = 'Welcome to Ibay',
  description = 'We sell the best products at the best price',
  keywords = 'electronics, buy electronics',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

export default Meta;
