import { eachDayOfInterval, format } from 'date-fns';

export const generateDailyCounts = (
  date: Date,
  days: number,
  records: { date: Date }[]
): { date: string; count: number }[] => {
  const dateFormat = 'dd/MM/yyyy';

  const startDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  startDate.setUTCDate(startDate.getUTCDate() - (days - 1));
  startDate.setUTCHours(0, 0, 0, 0);

  const recordsMap = new Map<string, number>();

  records.forEach((record) => {
    const normalizedRecordDate = new Date(
      Date.UTC(
        record.date.getUTCFullYear(),
        record.date.getUTCMonth(),
        record.date.getUTCDate()
      )
    );

    const formattedRecordDate = format(normalizedRecordDate, dateFormat);

    recordsMap.set(
      formattedRecordDate,
      (recordsMap.get(formattedRecordDate) || 0) + 1
    );
  });

  return eachDayOfInterval({
    start: startDate,
    end: new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    ),
  }).map((currentDate) => ({
    date: format(currentDate, dateFormat),
    count: recordsMap.get(format(currentDate, dateFormat)) || 0,
  }));
};
