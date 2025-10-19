export const getEndOfDayTTL = () => {
  const now = new Date();

  const endOfDayUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  const ttlInSeconds = Math.floor(
    (endOfDayUTC.getTime() - now.getTime()) / 1000
  );

  return ttlInSeconds;
};
