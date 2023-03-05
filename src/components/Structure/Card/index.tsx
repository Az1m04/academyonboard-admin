import React from 'react';
import classNames from 'classnames';
import { Space } from 'antd';
import Header from './components/Header';
import Section from './components/Section';
import Subsection from './components/Subsection';
import styles from './styles.less';

export interface CardProps {
  /** Title content for the card */
  title?: React.ReactNode;
  /** Inner content of the card */
  children?: React.ReactNode;
  /** A less prominent card */
  subdued?: boolean;
  /** Auto wrap content in section */
  sectioned?: boolean;
  /** Card header actions */
  actions?: React.ReactNode;
  /** Primary action in the card footer */
  primaryFooterAction?: React.ReactNode;
  /** Alignment of the footer actions on the card, defaults to right */
  footerActionAlignment?: 'right' | 'left';
  /** Allow the card to be hidden when printing */
  hideOnPrint?: boolean;
}

/**
 * Cards are used to group similar concepts and tasks together to make MMO easier for
 * clients to scan,read and get things done.
 *
 * Inspired from https://polaris.shopify.com/components/structure/card#navigation
 *
 * Code
 * https://github.com/Shopify/polaris-react/blob/main/src/components/Card/Card.tsx
 *
 */
const Card = ({
  children,
  hideOnPrint,
  title,
  subdued,
  sectioned,
  actions,
  primaryFooterAction,
  footerActionAlignment = 'right',
}: CardProps) => {
  const className = classNames(
    styles.Card,
    subdued && 'bg-gray-100',
    hideOnPrint && 'hide-on-print',
  );

  const headerMarkup = title || actions ? <Header actions={actions} title={title} /> : null;

  const content = sectioned ? <Section>{children}</Section> : children;

  const primaryFooterActionMarkup = primaryFooterAction ? (
    <div className="p-5 pt-0">{primaryFooterAction}</div>
  ) : null;

  const footerMarkup = primaryFooterActionMarkup ? (
    <div
      className={classNames(
        'flex items-center',
        footerActionAlignment === 'left' && 'justify-start',
      )}
    >
      {footerActionAlignment === 'right' ? (
        <div className="justify-end">{primaryFooterActionMarkup}</div>
      ) : (
        <div className="justify-start">{primaryFooterActionMarkup}</div>
      )}
    </div>
  ) : null;

  return (
    <div className={className}>
      {headerMarkup}
      {content}
      {footerMarkup}
    </div>
  );
};

Card.Header = Header;
Card.Section = Section;
Card.Subsection = Subsection;

export default Card;
