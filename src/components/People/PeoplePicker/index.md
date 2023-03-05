# People selector component

Use this to select people or person (turn allowMultipleSelection={false}) available under the organization members.

## Example usage

### Single person selector mode.

To allow only single person selection pass `allowMultipleSelection={false}` to the component

```jsx
import PeoplePicker from '@/components/People/PeoplePicker';

<PeoplePicker
  allowMultipleSelection={false}
  setVisible={showLeadOwnerSelector}
  visible={showLeadOwnerSelector}
  title="Choose lead followers"
  buttonName="Done"
  search={(searchValue) =>
    dispatch({
      type: 'orgMembers/listOrganizationMembers',
      payload: {
        accountId: currentUser?.organization?.id,
        searchCriteria: {
          keyword: searchValue,
          startIndex: '0',
          fetchSize: '5',
          sortBy: 'displayName',
        },
      },
    })
  }
  onChange={(selectedPersonRecord) => {
    // hide the popup and make api call to update the lead owner
    setShowLeadOwnerSelector(false);
    updateLeadOwner(selectedPersonRecord);
    // hide the popup
  }}
/>;
```
