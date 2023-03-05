import GenerateEmail from '@/components/GenerateEmail';
import GeneratePhone from '@/components/GeneratePhone';
import GenerateWhatsAppMessage from '@/components/GenerateWhatsAppMessage';
import { Button, Form } from 'antd';
import React, { useState } from 'react';

const SendMessage = ({ getTeacherDetails }) => {
  const [visible, setVisible] = useState(false);
  const [isNoteVisible, setIsNoteVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [recordDetails, setRecordDetails] = useState([getTeacherDetails]);
  return (
    <div>
      <div>
        <Form>
          <div className="flex gap-5">
            <Button
              onClick={() => {
                setRecordDetails([getTeacherDetails]);
                setIsNoteVisible(true);
              }}
              type="primary"
            >
              Send SMS
            </Button>
            <Button
              onClick={() => {
                setRecordDetails([getTeacherDetails]);
                setVisible(true);
              }}
              type="primary"
            >
              Send Email
            </Button>
            <Button
              onClick={() => {
                setRecordDetails([getTeacherDetails]);
                setIsVisible(true);
              }}
              type="primary"
            >
              Send Whatsapp message
            </Button>
          </div>
        </Form>
      </div>
      <GenerateEmail
        setVisible={setVisible}
        visible={visible}
        recordDetails={recordDetails}
        setRecordDetails={setRecordDetails}
      />
      <GenerateWhatsAppMessage
        setVisible={setIsVisible}
        visible={isVisible}
        recordDetails={recordDetails}
        setRecordDetails={setRecordDetails}
        type={'staff'}
      />
      <GeneratePhone
        setIsPhoneVisible={setIsNoteVisible}
        isPhoneVisible={isNoteVisible}
        recordDetails={recordDetails}
        setRecordDetails={setRecordDetails}
        type={'staff'}
      />
    </div>
  );
};

export default SendMessage;
