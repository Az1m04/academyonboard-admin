import { Divider, Table, Modal, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import { EyeOutlined } from '@ant-design/icons';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';

const DownloadCertificate = ({ getStudentCertificate, dispatch }) => {
  const [documentView, setDocumentView] = useState();
  const [documentViewModal, setDocumentViewModal] = useState(false);
  const [loadingToDownload, setLoadingToDownload] = useState(false);
  const { studentId } = useParams();
  useEffect(() => {
    dispatch({
      type: 'student/getStudentCertificate',
      payload: {
        pathParams: { studentId },
      },
    });
  }, [dispatch, studentId]);
  console.log('documentView', documentView, getStudentCertificate);
  const downloadAttchmentFile = (attachment) => {
    setLoadingToDownload(true);

    const urll = attachment.download_url;
    fetch(`${urll}`).then((response) => {
      response.blob().then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${attachment.name}`;

        setLoadingToDownload(false);
        a.click();
      });
    });
  };

  const columns = [
    {
      title: 'Sr No.',
      dataIndex: 'srNo',
      key: 'srNo',
      render: (_, __, index) => index + 1,
      width: 100,
      align: 'center',
    },
    {
      title: 'Name',
      dataIndex: 'typeId',
      key: 'typeId',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'address',
      render: (__, record) => (
        <div className="flex gap-4">
          <a
            onClick={() => {
              setDocumentView(record?.thumbnailUrl);
              setDocumentViewModal(true);
            }}
          >
            <EyeOutlined style={{ fontSize: '20px' }} />
          </a>
          <a
            className=" mt-1 text-amber-500"
            onClick={() => {
              setDocumentView(record?.thumbnailUrl);
              downloadAttchmentFile(record);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              className="text-red-500"
              viewBox="0 0 512 512"
              fill="#ffa940"
            >
              <path d="M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z" />
            </svg>
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Spin spinning={Boolean(loadingToDownload)}>
        <div>
          <div className="mt-4">
            <div className="text-blue-600 font-semibold text-lg"> DownloadS</div>
            <Divider />
          </div>
          <div>
            <Table
              columns={columns}
              bordered
              dataSource={getStudentCertificate?.contents}
              locale={{
                emptyText: (
                  <>
                    {' '}
                    <EmptyState
                      emptyState={emptyStateSvg}
                      emptyHeaderText={<span>No Document found yet!</span>}
                    />
                  </>
                ),
              }}
            />
          </div>
        </div>
        <div>
          <Modal
            onCancel={() => setDocumentViewModal(false)}
            visible={documentViewModal}
            width="80%"
            title="Document Preview"
            footer={null}
            bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
          >
            <iframe
              title="Document Preview"
              src={documentView}
              className="h-full text-center w-full"
              frameBorder="0"
            />
          </Modal>
        </div>
      </Spin>
    </div>
  );
};

export default connect(({ student, loading }) => ({
  getStudentCertificate: student.getStudentCertificate,
  loadingForGetCertificate: loading?.effects['student/getStudentCertificate'],
}))(DownloadCertificate);
