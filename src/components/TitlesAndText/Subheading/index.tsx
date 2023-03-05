import React from 'react';
import type, { HeadingTagName } from '../../../types';
import styles from './styles.less';

export interface SubheadingProps {
  /**
   * The element name to use for the subheading
   * @default 'h3'
   */
  element?: HeadingTagName;
  /** Text to display in subheading */
  children?: React.ReactNode;
}

/**
 * Subheadings are used for the title of any sub-sections in top-level page sections.
 *
 * Inspired from https://polaris.shopify.com/components/titles-and-text/subheading#navigation
 * @returns
 */
const Subheading = ({ element: Element = 'h3', children }: SubheadingProps) => {
  const ariaLabel = typeof children === 'string' ? children : undefined;
  return (
    <Element aria-label={ariaLabel} className={styles.Subheading}>
      {children}
    </Element>
  );
};
export default Subheading;
