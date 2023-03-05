import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, message, Skeleton, Spin, Upload } from 'antd';
import { connect } from 'umi';
import React, { useState, useRef } from 'react';

const AvatarView = (props) => {
  const [state, setState] = useState({ avatar: null });
  const canvasRef = useRef(null);

  function onFileChangeHandler(info) {
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      setState({ loading: true });
      const fileSize = info.file.size / 10000000;
      if (fileSize > 10000000) {
        message.error('File is larger than 1 MB');
        setState({ loading: false });
        return;
      }

      const canvas = canvasRef.current;
      const img = new Image();
      const ctx = canvas.getContext('2d');
      img.onload = async () => {
        const ix = img.width;
        const iy = img.height;
        let cix;
        let ciy;
        let sx = 0;
        let sy = 0;

        if (ix <= iy) {
          sx = (ix - iy) / 2;
          ciy = iy;
          cix = iy;
        } else {
          sy = (iy - ix) / 2;
          ciy = ix;
          cix = ix;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, sx, sy, cix, ciy, 0, 0, 512, 512);
        // convert the canvas data to base64 string
        const dataUrl = canvas.toDataURL('image/png');
        const bytes =
          dataUrl.split(',')[0].indexOf('base64') >= 0
            ? atob(dataUrl.split(',')[1])
            : window.unescape(dataUrl.split(',')[1]);

        const max = bytes.length;
        const ia = new Uint8Array(max);

        for (let i = 0; i < max; i += 1) {
          ia[i] = bytes.charCodeAt(i);
        }

        const newImageFileFromCanvas = new File([ia], `image_${Date.now()}.png`, {
          type: 'image/png',
        });

        const data = new FormData();
        data.append('file', newImageFileFromCanvas);
        if (props?.getTeacherDetails?.photoUrl) {
          props
            .dispatch({
              type: 'staff/upldateStaffProfile',
              payload: {
                body: data,
                pathParams: {
                  staffId: props.staffId,
                },
              },
            })
            .then(() => {
              message.success(`${info.file.name} file update successfully`);
              props.dispatch({
                type: 'staff/getTeacherDetails',
                payload: { pathParams: { TeacherId: props.staffId } },
              });
            });
        } else {
          props
            .dispatch({
              type: 'staff/uploadStaffProfile',
              payload: {
                body: data,
                pathParams: {
                  staffId: props.staffId,
                },
              },
            })
            .then(() => {
              message.success(`${info.file.name} file uploaded successfully`);
              props.dispatch({
                type: 'staff/getTeacherDetails',
                payload: { pathParams: { TeacherId: props.staffId } },
              });
            });
        }
        setState({
          avatar: dataUrl,
          loading: false,
        });
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
  }
  return (
    <>
      <div className="text-base font-semibold mb-2 justify-center">
        <div className="items-center flex justify-center">
          <span className="font-semibold text-xl px-4 pb-2 pt-1 text-blue-900 bg-gray-100 rounded-full ">
            Avatar
          </span>
        </div>

        <br />
      </div>

      <div className={['avatar', 'mb-6', 'text-center'].join(' ')}>
        {state?.avatar || props?.getTeacherDetails?.photoUrl ? (
          <>
            {state.loading ? (
              <Spin spinning={state.loading}>
                <Skeleton />
              </Spin>
            ) : (
              <div className="flex justify-center">
                <img
                  height="200px"
                  width="200px"
                  src={state?.avatar || props?.getTeacherDetails?.photoUrl}
                  alt="avatar"
                  className="rounded-full"
                />
              </div>
            )}
          </>
        ) : (
          <>
            <Avatar icon={<UserOutlined />} size={170}></Avatar>
          </>
        )}
        <div className="mt-4 text-gray-600 items-center flex justify-center">
          <span className="font-normal text-sm m-0 p-0"></span>
        </div>
      </div>
      <div className="mt-4 items-center flex justify-center">
        <canvas id="canvas" height="1" width="1" style={{ display: 'none' }} ref={canvasRef} />
        <Upload
          onChange={onFileChangeHandler}
          multiple={false}
          showUploadList={false}
          accept=".png,.jpg,.jpeg"
        >
          <div>
            <Button
              type="primary"
              className="Button"
              loading={state.loading || props.userAvatarLoading}
              shape={state.loading || props.userAvatarLoading ? 'loading' : 'plus'}
            >
              {state.avatar || props?.getTeacherDetails?.photoUrl ? (
                <span>Change Avatar</span>
              ) : (
                <span>Add Avatar</span>
              )}
            </Button>
          </div>
        </Upload>
      </div>
    </>
  );
};

const UploadPhoto = ({ dispatch, staffId, getTeacherDetails }) => {
  return (
    <div>
      <div>
        <AvatarView dispatch={dispatch} staffId={staffId} getTeacherDetails={getTeacherDetails} />
      </div>
    </div>
  );
};

export default connect(() => ({}))(UploadPhoto);
