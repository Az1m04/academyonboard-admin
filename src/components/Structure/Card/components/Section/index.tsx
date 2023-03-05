import React from 'react';
import classNames from 'classnames';
import Subheading from '@/components/TitlesAndText/Subheading';

import styles from '../../styles.less';

export interface SectionProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  subdued?: boolean;
  flush?: boolean;
  fullWidth?: boolean;
  /** Allow the card to be hidden when printing */
  hideOnPrint?: boolean;
  actions?: React.ReactNode;
}

const Section = ({
  children,
  title,
  subdued,
  flush,
  fullWidth,
  actions,
  hideOnPrint,
}: SectionProps) => {
  const className = classNames(
    styles.Section,
    flush && 'p-0',
    subdued && 'bg-gray-100',
    fullWidth && 'w-full',
    hideOnPrint && 'hide-on-print',
  );

  const actionMarkup = actions ? actions : null;

  const titleMarkup = typeof title === 'string' ? <Subheading>{title}</Subheading> : title;

  const titleAreaMarkup =
    titleMarkup || actionMarkup ? (
      <div className="pb-3">
        {actionMarkup ? (
          <div className="flex items-baseline">
            <div className="flex-auto">{titleMarkup}</div>
            {actionMarkup}
          </div>
        ) : (
          titleMarkup
        )}
      </div>
    ) : null;
  return (
    <div className={className}>
      {titleAreaMarkup}
      {children}
    </div>
  );
};

export default Section;
