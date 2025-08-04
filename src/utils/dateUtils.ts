import { format, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  }
  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy \'at\' h:mm a');
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};