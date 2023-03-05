import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

/**
 * Empty states are used when a list, table, or chart has no
 *  items or data to show. This is an opportunity to provide
 *  explanation or guidance to help users progress. The empty
 *  state component is intended for use when a full page in
 *  the application is empty, and not for individual elements
 *  or areas in the interface.
 */
const EmptyState = ({ heading, action, secondaryAction, footerContent, image, children }) => (
  <div>
    <div className={styles.EmptyState}>
      <div className={styles.Section}>
        <div className={styles.DetailsContainer}>
          <div className={styles.Details}>
            <div className={styles.TextContainer}>
              <p className={styles.Text}>{heading}</p>
              <div className={styles.Content}>{children}</div>
            </div>
            <div className={styles.Actions}>
              <div className="flex items-center">
                <div className="pr-2">
                  <Button
                    id={action.id}
                    loading={action.loading}
                    type="primary"
                    size="large"
                    disabled={action.disabled}
                    onClick={action.onAction}
                  >
                    {action.content}
                  </Button>
                </div>
                {secondaryAction && (
                  <div>
                    <Button id={secondaryAction.id} type="link">
                      {secondaryAction.content}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.FooterContent}>{footerContent}</div>
          </div>
        </div>
        <div className={styles.ImageContainer}>
          <img src={image} role="presentation" alt="" className={styles.Image} />
        </div>
      </div>
    </div>
  </div>
);

export default EmptyState;
