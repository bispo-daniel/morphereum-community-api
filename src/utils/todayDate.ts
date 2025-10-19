export const todayDate = (): Date => {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);

  return now;
};
