import React, { useState } from 'react';
import { Button, Icon, Popover, Steps } from 'antd';
import { TelephoneFill } from 'react-bootstrap-icons';

const { Step } = Steps;
const CallLogs = () => {
    const [showAllCalls, setShowAllCalls] = useState(false);
    console.log('object', showAllCalls, setShowAllCalls)

    return (
        <div className="h-screen overflow-y-scroll">
            <div className="py-4">
                <div>
                    <div className="flex text-xs justify-between px-6 pb-2">
                        <div>Associated Calls Logs (2)</div>
                        <Button
                            type="primary"
                        >
                            <Icon className="mr-1" type="plus-circle" />
                            Log a Call
                        </Button>
                    </div>
                    <Popover
                        title={null}
                        content={<div style={{ width: 400 }}>
                            Cold call with Jaskaran Singh
                        </div>}
                        placement="top"
                    >
                        <div
                            className="text-blue-600 font-semibold cursor-pointer w-full"
                            data-tip
                        // data-for={`title-${call.id}`}
                        >
                            <div className="border-b hover:bg-gray-200 cursor-pointer">
                                <div className="flex py-4 text-sm items-center px-6">
                                    <div className="flex-none bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                        <TelephoneFill />
                                    </div>
                                    <div className="w-full truncate ml-2">Cold call with Jaskaran Singh</div>
                                </div>
                                <div className="pb-2 mb-2 px-6">
                                    <Steps size="small" current={3}>
                                        <Step
                                            title="sandeep singh"
                                            icon={
                                                <img
                                                    // src={call?.caller?.photoUrl}
                                                    className="h-8 w-8 rounded-full"
                                                    alt=""
                                                />
                                            }
                                        />
                                        <Step
                                            title="Called"
                                            icon={
                                                <Icon
                                                    // component={ZcpIcons.TelephoneOutboundFill}
                                                    className="text-orange-600"
                                                />
                                            }
                                        />
                                        <Step
                                            title="Jaskaran Singh"
                                            description=""
                                            icon={
                                                <img
                                                    // src={call?.receiver?.photoUrl}
                                                    className="h-8 w-8 rounded-full"
                                                    alt=""
                                                />
                                            }
                                        />
                                    </Steps>
                                </div>
                            </div>
                        </div>
                    </Popover>
                </div>
            </div>
        </div>
    );
};


export default CallLogs;
