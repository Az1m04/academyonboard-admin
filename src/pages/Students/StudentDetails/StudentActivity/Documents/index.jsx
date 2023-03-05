import React, { useState, useEffect } from 'react';
import { Collapse, Upload, message, Popconfirm } from 'antd';
import { documentRequirements } from '@/utils/numberOfDocuments';
import { UploadDocumentIcon } from '@/utils/AppIcons';
import { CaretRightOutlined, LoadingOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import { Trash } from 'react-bootstrap-icons';
import uploadedImg from '@/assets/uploadedImage.png';
import { connect } from 'umi';

const { Panel } = Collapse;

const Documents = ({ dispatch, attachments }) => {
  const [activeTab, setActiveTab] = useState(['STUD_DOC_1']);
  const [loading, setLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const params = useParams();

  const [documents, setDocuments] = useState({
    STUD_DOC: [],
    STUD_DOC_2: [],
    STUD_DOC_3: [],
    STUD_DOC_4: [],
    STUD_DOC_5: [],
    STUD_DOC_6: [],
  });

  const getStudentAttachment = () => {
    dispatch({
      type: 'student/getStudentAttachments',
      payload: {
        pathParams: {
          studentId: params?.studentId,
        },
      },
    });
  };
  useEffect(() => {
    getStudentAttachment();
  }, []);

  useEffect(() => {
    // for synching all the attachments from redux state to local state
    // so that it can be reflected on UI
    const localPreparedDocs = {
      STUD_DOC: [],
      STUD_DOC_2: [],
      STUD_DOC_3: [],
      STUD_DOC_4: [],
      STUD_DOC_5: [],
      STUD_DOC_6: [],
    };
    if (attachments && attachments.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const attachment of attachments) {
        // eslint-disable-next-line no-unused-expressions
        localPreparedDocs[attachment.typeId]?.push(attachment);
      }
    }
    setDocuments(localPreparedDocs);
  }, [attachments]);

  const uploadKYCdocuments = (info, type) => {
    setLoading({ [type]: true });
    // make network request
    const data = new FormData();
    info.fileList.forEach((file) => {
      data.append('file', file.originFileObj);
    });
    dispatch({
      type: 'student/uploadStudentAttachments',
      payload: {
        body: data,
        pathParams: {
          studentId: params?.studentId,
        },
        query: {
          document_type: type,
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setLoading({});
        getStudentAttachment();
        message.success('Attachment uploaded successfully!');
      } else {
        message.error('Something went wrong!');
      }
    });
  };

  const deleteAttachment = (attachmentId) => {
    setDeleteLoading({ [attachmentId]: true });
    dispatch({
      type: 'student/deleteStudentAttachments',
      payload: {
        pathParams: {
          studentId: params?.studentId,
          contentId: attachmentId,
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        setDeleteLoading({});
        message.success('Attachment deleted successfully!');
      }
    });
  };
  const restrictFileSize = (file) => !(parseInt(file.size / 1024 / 1024, 10) > 5);

  const fileSizeConvertor = (size) => {
    if (size && size / 1024 / 1024 > 0) {
      const newSize = (size / 1024 / 1024).toFixed(2);
      return `${newSize} MB`;
    }
    return null;
  };
  return (
    <>
      <Collapse
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        style={{ marginTop: '5rem' }}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      >
        {documentRequirements.map((document) => (
          <Panel header={document.shortText} key={document.id}>
            {documents[document.id]?.map((uploadedDoc) => (
              <>
                <div className="flex items-center justify-between" key={uploadedDoc?.id}>
                  <div className="p-2">
                    <img src={uploadedImg} width={40} alt="upload-image1" />
                  </div>
                  <div className="flex flex-auto p-2">
                    <div className="text-xs leading-none text-blue-800">
                      {uploadedDoc.name}
                      <div className="font-normal">
                        {uploadedDoc.name} document
                        {<div>{fileSizeConvertor(uploadedDoc?.size)}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center px-2">
                    <div className="text-xs font-semibold text-center text-blue-700 cursor-pointer">
                      Accept
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-semibold text-center text-red-700 cursor-pointer">
                        Reject
                      </div>
                    </div>
                    <div>
                      <Popconfirm
                        title="Are you sure you want to delete this attachment?"
                        onConfirm={() => {
                          // make the api call as the document is uploaded
                          // before removing it from the local state
                          if (uploadedDoc?.typeId) {
                            deleteAttachment(uploadedDoc?.id);
                          } else {
                            // no need to make api call, as the document is
                            // not uploaded yet, so simply remove from local state
                            setDocuments((prev) => ({
                              ...prev,
                              [document.id]: [],
                            }));
                          }
                        }}
                        onCancel={() => {}}
                        cancelText="Cancel"
                        okText="Delete"
                        okType="danger"
                        okButtonProps={{
                          id: 'Confirm-Remove',
                        }}
                      >
                        {!deleteLoading[uploadedDoc.id] ? (
                          <Trash className="w-3 h-3 text-red-700 " />
                        ) : (
                          <LoadingOutlined
                            style={{ fontSize: '1.5rem', color: 'rgb(30, 64, 175)' }}
                            spin
                          />
                        )}
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              </>
            ))}

            <div className="flex items-center justify-between mb-2 bg-gray-100 border-gray-600 border-dashed rounded">
              <div className="p-2">
                <img src={uploadedImg} width={40} alt="image1" />
              </div>
              <div className="flex flex-auto p-2">
                <div className="text-xs font-semibold leading-none text-blue-800">
                  {document.shortText}
                  <div className="font-normal">{document.text}</div>
                </div>
              </div>
              <Upload
                accept=".pdf"
                fileList={[]}
                beforeUpload={(file) => {
                  if (restrictFileSize(file)) {
                    return false;
                  }
                  message.warning('Please upload document with size less than 5 mb');
                  return false;
                }}
                onChange={(info) => uploadKYCdocuments(info, document.id)}
              >
                <div className="pr-2">
                  {!loading[document.id] ? (
                    <UploadDocumentIcon />
                  ) : (
                    <LoadingOutlined
                      style={{ fontSize: '1.5rem', color: 'rgb(30, 64, 175)' }}
                      spin
                    />
                  )}
                </div>
              </Upload>
            </div>
          </Panel>
        ))}
      </Collapse>
    </>
  );
};

const mapStateToProps = (state) => ({
  attachments: state?.student?.studentAttachments,
});

export default connect(mapStateToProps)(Documents);
