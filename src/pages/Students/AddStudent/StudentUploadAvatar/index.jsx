import { hostname } from '@/utils/apiUtils';
import { Avatar, Button, message, Popconfirm, Upload } from 'antd';
import Axios from 'axios';
import { Fragment, useRef, useState, useEffect } from 'react';
import { connect } from 'umi';
import { getInitials } from '@/utils/common';
import { UserOutlined } from '@ant-design/icons';

const StudentUploadAvatar = ({
  currentStudentPic,
  dispatch,
  formDisabled,
  leadId,
  addStudentOption,
  updateProfileLoading,
}) => {
  const [state, setState] = useState({ avatar: null, loading: false });
  const [addUpdatePicState, setAddUpdatePicState] = useState();
  useEffect(() => {
    if (leadId !== '') {
      dispatch({
        type: 'student/getParticularStudentProfilePic',
        payload: {
          pathParams: {
            leadId,
          },
        },
      });
    }
  }, [leadId, dispatch, addStudentOption]);

  const canvasRef = useRef(null);
  function getBase64Image() {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    // eslint-disable-next-line func-names
    // eslint-disable-next-line no-param-reassign
    // eslint-disable-next-line func-names
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
    };
  }

  const onFileChangeHandler = (info) => {
    if (info?.file?.status === 'uploading') {
      setState({ loading: true });
      return;
    }

    if (info?.file?.status === 'done') {
      // validate the image size and resolution
      setState({ loading: true });
      const fileSize = info?.file?.size / 1024;
      if (fileSize > 1024) {
        message.error('File is larger than 1 MB');
        setState({ loading: false });
        return;
      }

      const canvas = canvasRef.current;
      const img = new Image();
      // const ctx = canvas?.getContext('2d');
      img.onload = async () => {
        // convert the canvas data to base64 string
        const dataUrl = canvas?.toDataURL('image/png');
        const data = new FormData();
        data.append('file', info.file.originFileObj);
        if (addUpdatePicState === 'Add photo') {
          await Axios.post(`${hostname()}/xapi/v1/party/${leadId}/profileImage`, data, {
            headers: {
              accessToken: localStorage.getItem('accessToken'),
              'Content-Type': 'multipart/form-data',
            },
          }).then(() => {
            dispatch({
              type: 'student/getParticularStudentProfilePic',
              payload: {
                pathParams: {
                  leadId,
                },
              },
            });
          });
        }
        if (addUpdatePicState === 'Change photo') {
          await Axios.put(`${hostname()}/xapi/v1/party/${leadId}/profileImage`, data, {
            headers: {
              accessToken: localStorage.getItem('accessToken'),
              'Content-Type': 'multipart/form-data',
            },
          }).then(() => {
            dispatch({
              type: 'student/getParticularStudentProfilePic',
              payload: {
                pathParams: {
                  leadId,
                },
              },
            });
          });
        }

        setState({
          avatar: getBase64Image(dataUrl)
            ? getBase64Image(dataUrl)
            : currentStudentPic?.publicResourceUrl,
          loading: false,
        });
        if (addUpdatePicState === 'Add photo') {
          message.success(`${info.file.name} file uploaded successfully!`);
        }
        if (addUpdatePicState === 'Change photo') {
          message.success(`${info.file.name} file updated successfully!`);
        }
      };

      const fileReader = new FileReader();
      fileReader.onload = () => {
        img.src = fileReader.result;
      };
      if (info?.file?.originFileObj) {
        fileReader?.readAsDataURL(info?.file?.originFileObj);
      }
    } else if (info?.file?.status === 'error') {
      message.error(`${info?.file?.name} file upload failed.`);
    }
  };
  const removeAvatar = () => {
    if (currentStudentPic?.contentId) {
      Axios.delete(
        `${hostname()}/xapi/v1/party/${leadId}/profileImage/${currentStudentPic?.contentId}`,
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'Content-Type': 'multipart/form-data',
          },
        },
      ).then((res) => {
        if (res?.data?.message === 'Deleted Successfully') {
          message.success('Profile photo deleted successfully!');
        }
        dispatch({
          type: 'student/getParticularStudentProfilePic',
          payload: {
            pathParams: {
              leadId,
            },
          },
        });
      });
    }
    setAddUpdatePicState('');
    setState({ avatar: null, loading: false });
  };

  const togglingButtons = () => {
    if (state.avatar || currentStudentPic?.publicResourceUrl) {
      setAddUpdatePicState('Change photo');
    } else {
      setAddUpdatePicState('Add photo');
    }
  };

  return (
    <Fragment>
      <div className="p-4 flex flex-col md:flex-none sm:flex-none items-left">
        <div className="flex md:flex-none sm:flex-none items-left">
          <div className="mr-4">
            <Avatar
              size={100}
              style={{ backgroundColor: 'rgb(49 98 165)', margin: 'auto', padding: 'auto' }}
              src={leadId && currentStudentPic?.publicResourceUrl}
              className="shadow-lg"
              icon={!leadId && <UserOutlined style={{ color: 'lightsteelblue' }} />}
            >
              {leadId && getInitials(currentStudentPic?.partyName)}
            </Avatar>
          </div>
          <div className="mt-0 lg:flex sm:flex-row lg:space-x-4 sm:space-x-0 items-center">
            <Upload
              onChange={(val) => {
                onFileChangeHandler(val);
              }}
              multiple={false}
              showUploadList={false}
              accept=".png,.jpg,.jpeg"
            >
              <Button
                type="default"
                className="w-full font-medium px-2 cursor-pointer rounded-lg text-center"
                loading={addStudentOption === true && updateProfileLoading}
                shape={updateProfileLoading ? 'loading' : 'plus'}
                // style={{ lineHeight: '2px' }}
                size="large"
                disabled={formDisabled}
                onClick={togglingButtons}
              >
                {state.avatar || (leadId && currentStudentPic?.publicResourceUrl) ? (
                  <span>{leadId && updateProfileLoading ? 'Changing...' : 'Change photo'}</span>
                ) : (
                  <span>{leadId && updateProfileLoading ? 'Adding...' : 'Add photo'}</span>
                )}
              </Button>
            </Upload>

            <div>
              {currentStudentPic?.publicResourceUrl && (
                <Popconfirm
                  title="Are you sure you want to remove the photo?"
                  onConfirm={() => removeAvatar()}
                  okText="Yes"
                  cancelText="No"
                  okType="danger"
                  disabled={formDisabled}
                >
                  <Button
                    type="default"
                    className="w-full font-medium px-2 py-4 cursor-pointer rounded-lg text-center"
                    shape={updateProfileLoading ? 'loading' : 'plus'}
                    style={{ lineHeight: '2px' }}
                    size="large"
                    disabled={formDisabled}
                  >
                    Remove photo
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        </div>
        {/* use the canvas to resize the image but keep it hidden from the dom */}
        <div className="hidden">
          <canvas
            id="canvas"
            height="200"
            width="200"
            style={{ display: 'none' }}
            className="hidden"
            ref={canvasRef}
          ></canvas>
        </div>
        <Upload
          onChange={onFileChangeHandler}
          multiple={false}
          showUploadList={false}
          accept=".png,.jpg,.jpeg"
        ></Upload>
      </div>
    </Fragment>
  );
};

export default connect(({ student, loading }) => ({
  currentStudentPic: student.studentProfilePic,
  updateProfileLoading: loading.effects['student/getParticularStudentProfilePic'],
}))(StudentUploadAvatar);
