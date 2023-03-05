import React, { useEffect, useCallback } from 'react';
import { connect } from 'dva';
import PaymentMethods from './PaymentMethods';

const PaymentModal = ({ showModal, setShowModal, dispatch, storeId }) => {
  const getPaymentMethods = useCallback(() => {
    dispatch({
      type: 'common/getPaymentMethods',
      payload: {
        pathParams: {
          storeId,
        },
        query: {
          role_type_id: 'STUDENT',
        },
      },
    });
  }, [dispatch, storeId]);

  useEffect(() => {
    if (showModal) {
      getPaymentMethods();
    }
  }, [getPaymentMethods, showModal]);

  return <PaymentMethods showModal={showModal} setShowModal={setShowModal} />;
};

export default connect(({ student, user }) => ({
  studentRecord: student.studentRecord,
  storeId: user.currentUser.store.id,
}))(PaymentModal);
