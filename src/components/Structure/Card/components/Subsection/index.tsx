import React from 'react';

export interface SubsectionProps {
  children?: React.ReactNode;
}

const Subsection = ({ children }: SubsectionProps) => {
  return <div>{children}</div>;
};

export default Subsection;
