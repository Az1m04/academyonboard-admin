import { hostname } from '@/utils/apiUtils';
import { Avatar, Button, message, Popconfirm, Upload } from 'antd';
import Axios from 'axios';
import { Fragment, useRef, useState } from 'react';
import { connect } from 'umi';
import { getInitials } from '@/utils/common';

const UploadAvatar = ({ currentUser, dispatch, loading, formDisabled }) => {
  const [state, setState] = useState({ avatar: null, loading: false });

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
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }

    if (info.file.status === 'done') {
      // validate the image size and resolution
      setState({ loading: true });
      const fileSize = info.file.size / 1024;
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
        await Axios.post(`${hostname()}/xapi/v1/party/${currentUser?.id}/profileImage`, data, {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
            'Content-Type': 'multipart/form-data',
          },
        }).then(() =>
          dispatch({
            type: 'user/fetchCurrent',
            payload: {},
          }),
        );

        setState({
          avatar: getBase64Image(dataUrl)
            ? getBase64Image(dataUrl)
            : currentUser?.personalDetails?.avatarUrl,
          loading: false,
        });
        message.success(`${info.file.name} file uploaded successfully!`);
      };

      const fileReader = new FileReader();
      fileReader.onload = () => {
        img.src = fileReader.result;
      };
      if (info.file.originFileObj) {
        fileReader.readAsDataURL(info.file.originFileObj);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const removeAvatar = () => {
    Axios.delete(`${hostname()}/xapi/v1/party/${currentUser?.id}/profileImage`, {
      headers: {
        accessToken: localStorage.getItem('accessToken'),
        'Content-Type': 'multipart/form-data',
      },
    }).then(() => {
      message.success('Profile photo deleted successfully!');
      dispatch({
        type: 'user/fetchCurrent',
        payload: {},
      });
    });
  };

  return (
    <Fragment>
      <div className=" ">
        <div className="p-4 flex flex-col items-left">
          <div className="">
            <div className="flex items-left">
              <div className="mr-4">
                <Avatar
                  size={100}
                  style={{ backgroundColor: 'rgb(49 98 165)' }}
                  src={currentUser?.personalDetails?.avatarUrl}
                >
                  {getInitials(currentUser?.personalDetails?.displayName)}
                </Avatar>
              </div>
              <div className="mt-0 lg:flex sm:flex-row lg:space-x-4 sm:space-x-0 items-center">
                <div>
                  <Upload
                    onChange={onFileChangeHandler}
                    multiple={false}
                    showUploadList={false}
                    accept=".png,.jpg,.jpeg"
                  >
                    <Button
                      type="default"
                      className="w-full font-medium px-2 cursor-pointer rounded-lg text-center"
                      loading={loading}
                      shape={loading ? 'loading' : 'plus'}
                      style={{ lineHeight: '2px' }}
                      size="large"
                      disabled={formDisabled}
                    >
                      {state.avatar || currentUser?.personalDetails?.avatarUrl ? (
                        <span>{loading ? 'Changing...' : 'Change photo'}</span>
                      ) : (
                        <span>{loading ? 'Adding...' : 'Add photo'}</span>
                      )}
                    </Button>
                  </Upload>
                </div>
                <div>
                  {currentUser?.personalDetails?.avatarUrl && (
                    <Popconfirm
                      title="Are you sure you want to remove the photo?"
                      onConfirm={() => removeAvatar()}
                      okText="Yes"
                      cancelText="No"
                      okType="danger"
                    >
                      <Button
                        type="default"
                        className="w-full font-medium px-2 py-4 cursor-pointer rounded-lg text-center"
                        shape={loading ? 'loading' : 'plus'}
                        style={{ lineHeight: '2px' }}
                        size="large"
                      >
                        Remove photo
                      </Button>
                    </Popconfirm>
                  )}
                </div>
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
      </div>
    </Fragment>
  );
};

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  updateProfileLoading: loading.effects['user/updateCurrent'],
}))(UploadAvatar);
