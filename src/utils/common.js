import { convertToRaw, ContentState, EditorState } from 'draft-js';
import moment from 'moment';
import DraftJSToHTML from 'draftjs-to-html';
import HTMLToDraftJS from 'html-to-draftjs';
import { getPageQuery } from './utils';

export const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getInitials = (name) => {
  if (name) {
    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  }
  return '';
};
const words = [
  ['bat', 'bats'],
  ['cat', 'cats'],
  ['person', 'people'],
  ['Person', 'People'],
  ['member', 'members'],
  ['Member', 'Members'],
  ['assignee', 'assignees'],
  ['follower', 'followers'],
  ['collaborator', 'collaborators'],
  ['sub task', 'sub tasks'],
];

export const getSingularPlural = (keyword, qty) =>
  words.filter(([s, p]) => keyword === s || keyword === p)?.[0]?.[qty === 1 ? 0 : 1];

export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

// input - +919876543210 or 9876543210
export const formatPhoneFromString = (countryCode, phone) => {
  if (!phone) return null;
  if (phone.startsWith(countryCode)) {
    // eslint-disable-next-line no-param-reassign
    phone = phone.replace(countryCode, '');
  }
  return `${countryCode} ${phone.substring(0, 5)}-${phone.substring(5)}`;
};

// converts the wysiwyg editor state to html
export const convertStateToHTML = (editorState) => {
  if (editorState) {
    return DraftJSToHTML(convertToRaw(editorState.getCurrentContent()));
  }
  return '';
};

// converts the html back to draft js editor state
export const convertHTMLToState = (html) => {
  if (html) {
    const contentBlock = HTMLToDraftJS(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      return editorState;
    }
  }
  return '';
};

// call this function, passing-in your date
export const dateToFromNowDaily = (date) => {
  // get from-now for this date
  const fromNow = moment(date).fromNow();
  // ensure the date is displayed with today and yesterday
  return moment(date).calendar(null, {
    // when the date is closer, specify custom values
    lastWeek: '[Last] dddd',
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    sameElse: () => `[${fromNow}]`,
  });
};

export function getRedirectURL(cb) {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params;

  if (redirect) {
    const redirectUrlParams = new URL(redirect);

    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);

      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
      cb(redirect);
    } else {
      window.location.href = redirect;
    }
  }
}
