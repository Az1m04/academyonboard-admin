import Heading from '@/components/TitlesAndText/Heading';
import { Col, Row } from 'antd';
import React from 'react';
import styles from './styles.less';

export interface AnnotatedSectionProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const AnnotatedSection = ({ children, title, description }: AnnotatedSectionProps) => {
  const descriptionMarkup = typeof description === 'string' ? <p>{description}</p> : description;

  return (
    <div className={styles.AnnotatedSection}>
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <div className="p-8 pl-0">
            <Heading>{title}</Heading>
            {descriptionMarkup && (
              <div className={styles.AnnotationDescription}>{descriptionMarkup}</div>
            )}
          </div>
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          {children}
        </Col>
      </Row>
    </div>
  );
};

export default AnnotatedSection;
