import React, { useEffect, useState } from 'react';
import { Button, Avatar, Tooltip } from 'antd';
import { connect } from 'dva';
import { Plus } from 'react-bootstrap-icons';
import { debounce } from 'lodash';
import { NotificationActiveIcon, NotificationOffIcon } from '@/utils/AppIcons';
import CheckValidation from '@/components/CheckValidation';
import AwesomeEditor from '../AwesomeEditor';
import AvatarHoverView from '../AvatarHoverView';
import BadgeAvatar from '../BadgeAvatar';
import AvatarHoverViewRest from '../AvatarHoverViewRest';
import AddAssigneePopover from '../AddAssigneePopover';

const AddNotes = ({
  onAddNoteChange,
  loading,
  onAddNote,
  notificationProps: { getNotificationReceiversList },
  defaultRecipients,
  currentUser,
}) => {
  const [noteText, setNoteText] = useState({});
  const notifyEnabled = true;
  const [listAssignees, setListAssignees] = useState([]);
  const [notifyPeopleOnNote, setNotifyPeopleOnNote] = useState(true);

  const handleNotify = () => {
    if (notifyPeopleOnNote) {
      setListAssignees([]);
    }
    setNotifyPeopleOnNote(!notifyPeopleOnNote);
  };

  const addAssignees = (party) => {
    const data = {
      id: party.id,
      name: party.displayName,
      email: party.email,
      publicResourceUrl: party.photoUrl,
    };
    setListAssignees(listAssignees.concat(data));
  };
  const addAllAssignees = (recipients) => {
    const recipientList = [];
    if (recipients.length > 0) {
      recipients.forEach((recipient) => {
        const data = {
          id: recipient.partyId,
          name: recipient.displayName,
          email: recipient.email,
          publicResourceUrl: recipient.publicResourceUrl,
        };
        recipientList.push(data);
      });
      setListAssignees(listAssignees.concat(recipientList));
    }
  };
  const [notificationReceiversList, setNotificationReceiversList] = useState([]);
  const searchNotifiersService = ({ keyword }) =>
    getNotificationReceiversList({
      searchCriteria: { keyword, startIndex: '0', fetchSize: '1000', sortBy: 'displayName' },
    }).then(({ records }) => {
      setNotificationReceiversList(records);
    });

  const searchNotifiers = debounce(searchNotifiersService, 400);
  useEffect(() => {
    if (onAddNoteChange) onAddNoteChange({ noteText, listAssignees });
    return () => {};
  }, [noteText, listAssignees]);

  useEffect(() => {
    searchNotifiers({ keyword: '' });
    if (defaultRecipients) {
      const recipientList = [];
      if (defaultRecipients.length > 0) {
        defaultRecipients.forEach((recipient) => {
          if (currentUser.id === recipient.id) {
            // do nothing
          } else {
            const data = {
              id: recipient.id,
              name: recipient.displayName,
              email: recipient.email,
              publicResourceUrl: recipient.photoUrl,
            };

            recipientList.push(data);
          }
        });
        setListAssignees(listAssignees.concat(recipientList));
      }
    }
  }, []);

  return (
    <div>
      <div className="flex p-3">
        <div className="ml-4 w-full bg-white text-gray-800 font-semibold">
          <AwesomeEditor
            initialValue={[
              {
                type: 'paragraph',
                children: [{ text: 'I have completed this task.' }],
              },
            ]}
            onChange={({ JSONText, HTMLText }) => {
              setNoteText({
                JSONText,
                HTMLText,
              });
            }}
            onAddMention={({ id, dispalyName, email, photoUrl }) => {
              setListAssignees([
                ...listAssignees,
                { id, name: dispalyName, email, publicResourceUrl: photoUrl },
              ]);
            }}
          />
        </div>
      </div>

      <div className="text-center flex mt-2 justify-between pl-2 mr-3">
        {notifyEnabled && (
          <div className="flex items-center mr-3">
            {listAssignees &&
              listAssignees.slice(0, 5).map((list) => (
                <AvatarHoverView profile={list} key={list.id + Math.random()}>
                  <div>
                    {/* Badge Avatar with delete button */}
                    <BadgeAvatar
                      name={list.name}
                      imgUrl={list.publicResourceUrl}
                      onDelete={() => {
                        const newlist = listAssignees.filter((l) => l.id !== list.id);
                        setListAssignees([...newlist]);
                      }}
                      showBadge
                    />
                  </div>
                </AvatarHoverView>
              ))}

            {listAssignees && listAssignees.length > 5 && (
              <AvatarHoverViewRest
                newFilter
                title={`Assignees (${listAssignees.length - 5})`}
                assignees={listAssignees && listAssignees.slice(5, listAssignees.length)}
                onDelete={(id) => {
                  const newlist = listAssignees.filter((l) => l.id !== id);
                  setListAssignees([...newlist]);
                }}
              >
                <Avatar>+{listAssignees.length - 5}</Avatar>
              </AvatarHoverViewRest>
            )}

            <AddAssigneePopover
              assignees={notificationReceiversList?.filter(
                (rec) => !listAssignees.map(({ id }) => id).includes(rec.id),
              )}
              searchAssignees={(val) => searchNotifiers({ keyword: val })}
              addAssignees={addAssignees}
              addAllAssignees={addAllAssignees}
            >
              <Tooltip title="Notify additional people" className="cursor-pointer">
                <Button
                  type="dashed"
                  shape="circle"
                  icon={<Plus className="align-top text-2xl font-bold" />}
                />
              </Tooltip>
            </AddAssigneePopover>
          </div>
        )}
        <div className="flex-auto">
          {/* bell Icon */}
          <div className="flex items-center">
            <Tooltip
              title={
                notifyPeopleOnNote
                  ? 'Notifications enabled, task assignees will be notified, click to disable.'
                  : 'Notifications disabled, task assignees will not be notified, click to enable notifications.'
              }
            >
              <button
                type="button"
                onClick={handleNotify}
                style={{ marginRight: '0px' }}
                className={`w-9 h-9 rounded-full border grid place-items-center ${
                  notifyPeopleOnNote
                    ? 'bg-yellow-300 text-yellow-900'
                    : ' bg-gray-100 text-gray-800'
                }`}
              >
                {notifyPeopleOnNote ? NotificationActiveIcon() : NotificationOffIcon()}
              </button>
            </Tooltip>
          </div>
        </div>
        <CheckValidation show={onAddNote}>
          <div className="text-red-600 text-xs text-center">
            <Button
              id="AddNote"
              loading={loading}
              type="primary"
              onClick={() => {
                if (noteText.JSONText) {
                  onAddNote({
                    jsonText: noteText.JSONText,
                    htmlText: noteText.HTMLText,
                    selectedAssignees: listAssignees,
                  });
                }
              }}
            >
              Add Note
            </Button>
          </div>
        </CheckValidation>
      </div>
    </div>
  );
};

export default connect(({ user: { currentUser } }) => ({
  currentUser,
}))(AddNotes);
