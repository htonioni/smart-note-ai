export interface DateSearchResult {
  isDateSearch: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function parseDateSearch(query: string): DateSearchResult {
  const normalizedQuery = query.toLowerCase().trim();
  const now = new Date();
  
  const getStartOfDay = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  };
  
  const getEndOfDay = (date: Date) => {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  if (normalizedQuery === 'today') {
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(now),
        end: getEndOfDay(now)
      }
    };
  }

  if (normalizedQuery === 'yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(yesterday),
        end: getEndOfDay(yesterday)
      }
    };
  }

  if (normalizedQuery === 'last week' || normalizedQuery === 'lastweek') {
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(weekAgo),
        end: getEndOfDay(now)
      }
    };
  }

  if (normalizedQuery === 'last month' || normalizedQuery === 'lastmonth') {
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(monthAgo),
        end: getEndOfDay(now)
      }
    };
  }

  if (normalizedQuery === 'this week' || normalizedQuery === 'thisweek') {
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(startOfWeek),
        end: getEndOfDay(now)
      }
    };
  }

  if (normalizedQuery === 'this month' || normalizedQuery === 'thismonth') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(startOfMonth),
        end: getEndOfDay(now)
      }
    };
  }

  const monthNames = [
    'january', 'jan',
    'february', 'feb',
    'march', 'mar',
    'april', 'apr',
    'may',
    'june', 'jun',
    'july', 'jul',
    'august', 'aug',
    'september', 'sep', 'sept',
    'october', 'oct',
    'november', 'nov',
    'december', 'dec'
  ];

  const monthIndex = monthNames.findIndex(month => normalizedQuery === month);
  if (monthIndex !== -1) {
    let actualMonth;
    if (monthIndex <= 1) actualMonth = 0;
    else if (monthIndex <= 3) actualMonth = 1;
    else if (monthIndex <= 5) actualMonth = 2;
    else if (monthIndex <= 7) actualMonth = 3;
    else if (monthIndex === 8) actualMonth = 4;
    else if (monthIndex <= 10) actualMonth = 5;
    else if (monthIndex <= 12) actualMonth = 6;
    else if (monthIndex <= 14) actualMonth = 7;
    else if (monthIndex <= 17) actualMonth = 8;
    else if (monthIndex <= 19) actualMonth = 9;
    else if (monthIndex <= 21) actualMonth = 10;
    else actualMonth = 11;

    let year = now.getFullYear();
    if (actualMonth > now.getMonth()) {
      year = now.getFullYear() - 1;
    }

    const startOfMonth = new Date(year, actualMonth, 1);
    const endOfMonth = new Date(year, actualMonth + 1, 0);

    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(startOfMonth),
        end: getEndOfDay(endOfMonth)
      }
    };
  }

  const datePatterns = [
    /^\d{4}-\d{1,2}-\d{1,2}$/,
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    /^\d{1,2}-\d{1,2}-\d{4}$/,
  ];

  for (const pattern of datePatterns) {
    if (pattern.test(normalizedQuery)) {
      const parsedDate = new Date(normalizedQuery);
      if (!isNaN(parsedDate.getTime())) {
        return {
          isDateSearch: true,
          dateRange: {
            start: getStartOfDay(parsedDate),
            end: getEndOfDay(parsedDate)
          }
        };
      }
    }
  }

  const naturalDate = new Date(normalizedQuery);
  if (!isNaN(naturalDate.getTime()) && normalizedQuery.length > 3) {
    return {
      isDateSearch: true,
      dateRange: {
        start: getStartOfDay(naturalDate),
        end: getEndOfDay(naturalDate)
      }
    };
  }

  return { isDateSearch: false };
}

export function isNoteInDateRange(noteDate: string, dateRange: { start: Date; end: Date }): boolean {
  const noteDateTime = new Date(noteDate);
  if (isNaN(noteDateTime.getTime())) {
    return false;
  }
  
  return noteDateTime >= dateRange.start && noteDateTime <= dateRange.end;
}