import React from 'react';
import classNames from 'classnames';
import styles from './styles.less';

export interface SectionProps {
  children?: React.ReactNode;
  secondary?: boolean;
  fullWidth?: boolean;
  oneHalf?: boolean;
  oneThird?: boolean;
}

const Section = ({ children, secondary, fullWidth, oneHalf, oneThird }: SectionProps) => {
  const className = classNames(
    styles.Section,
    secondary && 'Section-secondary',
    fullWidth && 'w-full',
    oneHalf && 'w-1/2',
    oneThird && 'w-1/3',
  );

  return <div className={className}>{children}</div>;
};

export default Section;
