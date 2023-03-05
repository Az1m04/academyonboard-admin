import dayjs from 'dayjs';

const GetShortTimeString = ({ time }) => {
  const timeString = (stringTime) => {
    if (stringTime?.includes('years')) {
      return `${stringTime?.split(' ')[0]} Y`;
    }
    if (stringTime?.includes('months')) {
      return `${stringTime?.split(' ')[0]} M`;
    }
    if (stringTime?.includes('weeks')) {
      return `${stringTime?.split(' ')[0]} W`;
    }
    if (stringTime?.includes('days')) {
      return `${stringTime?.split(' ')[0]} D`;
    }
    if (stringTime?.includes('hours')) {
      return `${stringTime?.split(' ')[0]} H`;
    }
    if (stringTime?.includes('minutes')) {
      return `${stringTime?.split(' ')[0]} min.`;
    }
    if (stringTime?.includes('seconds')) {
      return `${stringTime?.split(' ')[0]} sec.`;
    }

    return stringTime;
  };
  switch (dayjs(time)?.fromNow()) {
    case 'hours ago':
      return `h`;
    case 'an hour ago':
      return `1h`;
    case 'a few seconds ago':
      return `few sec.`;
    case 'minutes ago':
      return `min`;
    case 'a minute ago':
      return `1min`;
    case 'days ago':
      return `d`;
    case 'a day ago':
      return `1 D`;
    case 'a week ago':
      return `1w`;
    case 'weeks ago':
      return `w`;
    case 'months ago':
      return `mo`;
    case 'a month ago':
      return `1mo`;
    case 'years ago':
      return `y`;
    case 'a year ago':
      return `1y`;
    default:
      return timeString(dayjs(time)?.fromNow());
  }
};

export default GetShortTimeString;
