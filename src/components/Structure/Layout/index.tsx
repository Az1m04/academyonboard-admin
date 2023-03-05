import React from 'react';
import AnnotatedSection from './components/AnnotatedSection';
import Section from './components/Section';
import styles from './styles.less';
// 
export interface LayoutProps {
  /** Automatically adds sections to layout. */
  sectioned?: boolean;
  /** The content to display inside the layout. */
  children?: React.ReactNode;
}

/**
 * The layout component is used to create the main layout on a page. Layouts sections come in three main configurations: one-column, two-column, and annotated. One and two column layouts can be combined in the same page. Annotated layouts should be used on their own and only on settings pages.
 *
 * Inspired from https://polaris.shopify.com/components/structure/layout#navigation
 * @returns
 */
const Layout = ({ sectioned, children }: LayoutProps) => {
  const content = sectioned ? <Section>{children}</Section> : children;
  return <div className={styles.Layout}>{content}</div>;
};

Layout.AnnotatedSection = AnnotatedSection;
Layout.Section = Section;

export default Layout;
