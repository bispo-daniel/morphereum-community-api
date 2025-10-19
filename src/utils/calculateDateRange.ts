interface DateRange {
  startDate: Date;
  endDate: Date;
}

export const calculateDateRange = (date: Date, days: number): DateRange => {
  const parsedDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );

  const startDate = new Date(parsedDate);
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(parsedDate);
  endDate.setUTCHours(23, 59, 59, 999);

  return { startDate, endDate };
};
