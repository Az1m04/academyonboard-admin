import React from 'react';
import { Form } from 'antd';
import FeePaymentDetails from '@/pages/Students/AddLead/CourseModulesCard/FeePaymentDetails';
import Card from '@/components/Structure/Card';
import ModeOfPayment from '@/pages/Students/AddLead/CourseModulesCard/ModeOfPayment';

const Step3FeesDetails = ({
  className,
  onNextClick,
  feesDetailsForm,
  courseDetailsForm,
  currentStepForStudent,
  courseList,
  installmentsLevel,
  setInstallmentsLevel,
  paymentMode,
  setPaymentMode,
  isAddOtherAddAdjustmentPresent,
  setIsAddOtherAddAdjustmentPresent,
}) => {
  return (
    <div className={className} key={currentStepForStudent}>
      <Form
        hideRequiredMark
        size="large"
        form={feesDetailsForm}
        onFinish={() => {
          onNextClick();
        }}
        name="stdReferencesForm"
      >
        {courseList?.map((item, index) => (
          <FeePaymentDetails
            key={item?.productId}
            courseDetailsForm={courseDetailsForm}
            feesDetailsForm={feesDetailsForm}
            index={index}
            feeArray={item?.fees?.filter((fee) => fee?.feeAmount)}
            courseDisplayName={item?.displayName}
            courseList={courseList}
            setInstallmentsLevel={setInstallmentsLevel}
            setPaymentMode={setPaymentMode}
            isAddOtherAddAdjustmentPresent={isAddOtherAddAdjustmentPresent}
            setIsAddOtherAddAdjustmentPresent={setIsAddOtherAddAdjustmentPresent}
          />
        ))}
        {courseList?.length > 0 && (
          <div className="mt-5">
            <Card>
              <ModeOfPayment
                feesDetailsForm={feesDetailsForm}
                installmentsLevel={installmentsLevel}
                setInstallmentsLevel={setInstallmentsLevel}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
              />
            </Card>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Step3FeesDetails;
