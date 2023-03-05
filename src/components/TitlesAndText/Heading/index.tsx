import React from 'react';
import type, { HeadingTagName } from '../../../types';
import styles from './styles.less';

export interface HeadingProps {
  /**
   * The element name to use for the Heading
   * @default 'h2'
   */
  element?: HeadingTagName;
  /** Text to display in Heading */
  children?: React.ReactNode;
}

/**
 * Headings are used as the titles of each major section of a page in the interface. For example, card components generally use headings as their title.
 *
 * Inspired from https://polaris.shopify.com/components/titles-and-text/Heading#navigation
 * @returns
 */
const Heading = ({ element: Element = 'h3', children }: HeadingProps) => {
  const ariaLabel = typeof children === 'string' ? children : undefined;
  return (
    <Element aria-label={ariaLabel} className={styles.Heading}>
      {children}
    </Element>
  );
};
export default Heading;
