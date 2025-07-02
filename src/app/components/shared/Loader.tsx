import React from 'react';

type LoaderProps = {
  color?: string;
  size?: number;
};

const Loader: React.FC<LoaderProps> = ({ color = 'white', size = 16 }) => {
  return (
    <span
      className="animate-spin rounded-full border-2 border-solid border-t-transparent"
      style={{
        height: size,
        width: size,
        borderColor: color,
        borderTopColor: 'transparent',
      }}
    ></span>
  );
};

export default Loader;
