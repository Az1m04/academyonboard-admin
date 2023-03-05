import { Tag, Typography } from 'antd';
import React from 'react';
import { connect } from 'dva';

import ImageUpload from '@/components/ImageUpload';
import styles from './index.less';

const { Paragraph } = Typography;

function PartyBasicDetails({ typeText, partyId, type, partyDetails }) {
  return (
    <div className={`${styles.NameWrapper} flex items-center px-6 py-4 border-b`}>
      <div>
        <ImageUpload type={type} partyId={partyId} partyImage={null} />
      </div>
      <div className="pl-4 w-full">
        <span className="flex justify-between">
          <div className={styles.LeadName}>
            <Paragraph
              className="w-48 text-lg font-semibold truncate"
              ellipsis
              title={partyDetails?.displayName.slice(3)}
              style={{ margin: '0' }}
            >
              {partyDetails?.displayName.slice(3)}
            </Paragraph>
          </div>
        </span>
        <div className="py-1">
          <Tag
            style={{
              borderRadius: '999px',
            }}
            color="orange"
          >
            {typeText}
          </Tag>
        </div>
        <div title="Designation">
          <Paragraph
            className="w-full"
            ellipsis
            title={`${typeText} since ${partyDetails?.createdAtPretty}`}
          >
            {typeText} since {partyDetails?.createdAtPretty}
          </Paragraph>
        </div>

        <div className="text-base font-semibold text-blue-800">{partyDetails?.id}</div>
      </div>
    </div>
  );
}

export default connect()(PartyBasicDetails);
