import React from 'react';
import Step1BasicDetails from './Step1BasicDetails';
import Step2CourseDetails from './Step2CourseDetails';
import Step3FeesDetails from './Step3FeesDetails';
import Step3StudentReferences from './Step3StudentReferences';
import Step4ParentDetails from './Step4ParentDetails';
import Step5UploadDocuments from './Step5UploadDocuments';
import Card from '@/components/Structure/Card';

const StepsWrapper = (props) => {
  const {
    leadId,
    phoneType,
    onNextClick,
    onBackClick,
    formDisabled,
    onOptionChange,
    addStudentOption,
    setLeadId,
    setLeadPartyId,
    setFormDisabled,
    studentLeadList,
    checkUnmarried,
    setCheckUnmarried,
    gender,
    setGender,
    currentStepForStudent,
    purpose,
    firstForm,
    courseDetailsForm,
    feesDetailsForm,
    studentReferencesForm,
    parentDetailsForm,
    uploadDocumentForm,
    setPurposeChange,
    purposeChange,
    setCourseList,
    setVisaCategory,
    setVisaOption,
    setSelectedService,
    setDisplayServicesDropBox,
    // Student course details
    courseList,
    getCoursesCategory,
    setCoursesSubCategory,
    coursesSubCategory,
    setCoursesFromSubCategory,
    coursesFromSubCategory,
    feePaymentLangSet,
    setFeePaymentLangSet,
    resizePurposeDetails,
    setResizePurposeDetails,
    installmentsLevel,
    setInstallmentsLevel,
    paymentMode,
    setPaymentMode,
    // Student visa details
    getValues,
    visaCategory,
    displayOtherVisaDropBox,
    setDisplayOtherVisaDropBox,
    visaOption,
    // Student other services
    displayServicesDropBox,
    otherServicesChange,
    setOtherServicesChange,
    selectedService,
    referenceBy,
    // Upload documents
    contents,
    setContents,
    // Address details states
    onCountryChange,
    setOnCountryChange,
  } = props;

  return (
    <>
      <Step1BasicDetails
        className={currentStepForStudent === 0 ? 'visible' : 'hidden'}
        currentStepForStudent={currentStepForStudent}
        formDisabled={formDisabled}
        firstForm={firstForm}
        purpose={purpose}
        leadId={leadId}
        setLeadId={setLeadId}
        setLeadPartyId={setLeadPartyId}
        setFormDisabled={setFormDisabled}
        studentLeadList={studentLeadList}
        addStudentOption={addStudentOption}
        onOptionChange={onOptionChange}
        phoneType={phoneType}
        checkUnmarried={checkUnmarried}
        setCheckUnmarried={setCheckUnmarried}
        gender={gender}
        setGender={setGender}
        setResizePurposeDetails={setResizePurposeDetails}
        // Address details states
        onCountryChange={onCountryChange}
        setOnCountryChange={setOnCountryChange}
        onBackClick={() => onBackClick()}
        onNextClick={() => {
          onNextClick();
        }}
      />
      <Step2CourseDetails
        className={currentStepForStudent === 1 ? 'visible' : 'hidden'}
        currentStepForStudent={currentStepForStudent}
        courseDetailsForm={courseDetailsForm}
        feesDetailsForm={feesDetailsForm}
        purpose={purpose}
        purposeChange={purposeChange}
        setPurposeChange={setPurposeChange}
        setCourseList={setCourseList}
        setVisaCategory={setVisaCategory}
        setVisaOption={setVisaOption}
        setSelectedService={setSelectedService}
        courseList={courseList}
        getCoursesCategory={getCoursesCategory}
        setCoursesSubCategory={setCoursesSubCategory}
        coursesSubCategory={coursesSubCategory}
        setCoursesFromSubCategory={setCoursesFromSubCategory}
        coursesFromSubCategory={coursesFromSubCategory}
        setInstallmentsLevel={setInstallmentsLevel}
        setPaymentMode={setPaymentMode}
        feePaymentLangSet={feePaymentLangSet}
        setFeePaymentLangSet={setFeePaymentLangSet}
        resizePurposeDetails={resizePurposeDetails}
        setResizePurposeDetails={setResizePurposeDetails}
        // Student visa details
        getValues={getValues}
        visaCategory={visaCategory}
        displayOtherVisaDropBox={displayOtherVisaDropBox}
        setDisplayOtherVisaDropBox={setDisplayOtherVisaDropBox}
        visaOption={visaOption}
        // Student other services
        displayServicesDropBox={displayServicesDropBox}
        setDisplayServicesDropBox={setDisplayServicesDropBox}
        otherServicesChange={otherServicesChange}
        setOtherServicesChange={setOtherServicesChange}
        selectedService={selectedService}
        referenceBy={referenceBy}
        onBackClick={() => onBackClick()}
        onNextClick={() => {
          onNextClick();
        }}
      />

      <Step3FeesDetails
        className={currentStepForStudent === 2 ? 'visible' : 'hidden'}
        feesDetailsForm={feesDetailsForm}
        courseDetailsForm={courseDetailsForm}
        onBackClick={() => onBackClick()}
        onNextClick={() => {
          onNextClick();
        }}
        currentStepForStudent={currentStepForStudent}
        courseList={courseList}
        installmentsLevel={installmentsLevel}
        setInstallmentsLevel={setInstallmentsLevel}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
      />
      <Card>
        <Step3StudentReferences
          className={currentStepForStudent === 3 ? 'visible' : 'hidden'}
          currentStepForStudent={currentStepForStudent}
          studentReferencesForm={studentReferencesForm}
          onBackClick={() => onBackClick()}
          onNextClick={() => {
            onNextClick();
          }}
        />
      </Card>
      <Step4ParentDetails
        className={currentStepForStudent === 4 ? 'visible' : 'hidden'}
        currentStepForStudent={currentStepForStudent}
        parentDetailsForm={parentDetailsForm}
        onBackClick={() => onBackClick()}
        onNextClick={() => {
          onNextClick();
        }}
      />
      <Step5UploadDocuments
        className={currentStepForStudent === 5 ? 'visible' : 'hidden'}
        currentStepForStudent={currentStepForStudent}
        uploadDocumentForm={uploadDocumentForm}
        contents={contents}
        setContents={setContents}
        onBackClick={() => onBackClick()}
        onNextClick={() => {
          onNextClick();
        }}
      />
    </>
  );
};
export default StepsWrapper;
