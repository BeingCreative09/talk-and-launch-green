import React from 'react';

interface MongoLeafIconProps {
  className?: string;
  size?: number;
}

const MongoLeafIcon: React.FC<MongoLeafIconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2C8.5 2 6 4.5 6 8C6 12 12 22 12 22S18 12 18 8C18 4.5 15.5 2 12 2Z"
        fill="#00684A"
        opacity="0.9"
      />
      <path
        d="M12 4C9.8 4 8 5.8 8 8C8 10.5 12 18 12 18S16 10.5 16 8C16 5.8 14.2 4 12 4Z"
        fill="#4F9A85"
        opacity="0.7"
      />
    </svg>
  );
};

export default MongoLeafIcon;