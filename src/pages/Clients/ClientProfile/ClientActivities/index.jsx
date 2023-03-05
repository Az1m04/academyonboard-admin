
import React from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import { Tabs, Badge } from 'antd';
import { useParams } from 'react-router';
import { ChatFillIcon, EnvelopeFillIcon, TelephoneFillIcon, ThunderIcon } from '@/utils/AppIcons';

const { TabPane } = Tabs;
const ClientActivities = props => {
    const {
        partyCallLogs,
        activities,
        partyNotes,
        partyEmails,
        children,
        match,
    } = props;
    const pathParams = useParams();
    // stores the basic details of the lead, id, name to be passed on to downstream components
    // const viewSize = 10;
    // calculate and return back start index

    const activeTab = match.params.tabname;
    return (
        <div className="rounded shadow bg-white ">
            <div className="mt-2 px-6 py-4 flex justify-between border-b">
                <div className="text-xl font-semibold">Activity</div>
            </div>
            <div className="flex justify-between">
                <Tabs
                    activeKey={activeTab}
                    className="w-full"
                    onChange={e => router.push(`/clients/${pathParams.id}/${e}`)}
                >
                    <TabPane
                        tab={
                            <div className="flex">
                                <span className="justify-center mx-2" style={{ top: 5 }}>
                                    {' '}
                                    {ThunderIcon()}{' '}
                                </span>{' '}
                                Activity{' '}
                                <Badge
                                    count={activities?.contactActivities?.length}
                                    className="ml-2"
                                    style={{ backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#000000' }}
                                />
                            </div>
                        }
                        key="activities"
                    >
                        {match.params.tabname === 'activities' && children}
                    </TabPane>
                    <TabPane
                        tab={
                            <div className="flex">
                                <span className="mr-2">
                                    {ChatFillIcon()}
                                </span> Notes{' '}
                                <Badge
                                    count={partyNotes && partyNotes.length}
                                    className="ml-2"
                                    style={{ backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#000000' }}
                                />
                            </div>
                        }
                        key="notes"
                    >
                        {match.params.tabname === 'notes' && children}
                    </TabPane>
                    <TabPane
                        tab={
                            <div className="flex">
                                <span className="mr-2">
                                    {EnvelopeFillIcon()}
                                </span> Email{' '}
                                <Badge
                                    count={partyEmails?.emailLogs?.length}
                                    className="ml-2"
                                    style={{ backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#000000' }}
                                />
                            </div>
                        }
                        key="email"
                    >
                        {match.params.tabname === 'email' && children}
                    </TabPane>
                    <TabPane
                        tab={
                            <div className="flex">
                                <span className="mr-2">
                                    {TelephoneFillIcon()}
                                </span> Call Logs{' '}
                                <Badge
                                    count=
                                    {partyCallLogs && partyCallLogs.callLogs &&
                                        partyCallLogs.callLogs.length}
                                    className="ml-2"
                                    style={{ backgroundColor: '#FFFFFF', color: '#000000', borderColor: '#000000' }}
                                />
                            </div>
                        }
                        key="calls"
                    >
                        {match.params.tabname === 'calls' && children}
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default ClientActivities;
