import { subDays } from 'date-fns';

export const yesterdayDate = (): Date => {
  const yesterday = subDays(new Date(), 1);
  yesterday.setUTCHours(0, 0, 0, 0);

  return yesterday;
};
