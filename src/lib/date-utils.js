import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from 'date-fns';

export const DATE_GROUPS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  THIS_WEEK: 'This Week',
  THIS_MONTH: 'This Month',
  THIS_YEAR: 'This Year',
  EARLIER: 'Earlier',
};

export const getDateGroup = (dateString) => {
  const date = parseISO(dateString);

  if (isToday(date)) return DATE_GROUPS.TODAY;
  if (isYesterday(date)) return DATE_GROUPS.YESTERDAY;
  if (isThisWeek(date)) return DATE_GROUPS.THIS_WEEK;
  if (isThisMonth(date)) return DATE_GROUPS.THIS_MONTH;
  if (isThisYear(date)) return DATE_GROUPS.THIS_YEAR;
  return DATE_GROUPS.EARLIER;
};

export const groupImagesByDate = (images) => {
  const groups = {
    [DATE_GROUPS.TODAY]: [],
    [DATE_GROUPS.YESTERDAY]: [],
    [DATE_GROUPS.THIS_WEEK]: [],
    [DATE_GROUPS.THIS_MONTH]: [],
    [DATE_GROUPS.THIS_YEAR]: [],
    [DATE_GROUPS.EARLIER]: [],
  };

  images?.forEach((image) => {
    const group = getDateGroup(image.created_at);
    groups[group].push(image);
  });

  // Remove empty groups
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};

export const DATE_GROUP_ORDER = [
  DATE_GROUPS.TODAY,
  DATE_GROUPS.YESTERDAY,
  DATE_GROUPS.THIS_WEEK,
  DATE_GROUPS.THIS_MONTH,
  DATE_GROUPS.THIS_YEAR,
  DATE_GROUPS.EARLIER,
]; 