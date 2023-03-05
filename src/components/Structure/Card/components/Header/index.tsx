import React, { isValidElement } from 'react';
import Heading from '@/components/TitlesAndText/Heading';

export interface HeaderProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

const Header = ({ children, title, actions }: HeaderProps) => {
  const actionMarkup = actions || null;

  const titleMarkup = isValidElement(title) ? title : <Heading>{title}</Heading>;

  const headingMarkup =
    actionMarkup || children ? (
      <div className="flex items-baseline">
        <div className="flex-auto">{titleMarkup}</div>
        {actionMarkup}
      </div>
    ) : (
      titleMarkup
    );

  return <div className="p-5 pb-0">{headingMarkup}</div>;
};

export default Header;
