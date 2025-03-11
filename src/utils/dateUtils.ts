/**
 * Formats a date string to DD/MM/YYYY format
 * @param dateString - Date string in any valid format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if there's an error
  }
};

/**
 * Gets today's date in YYYY-MM-DD format (for HTML date inputs)
 * @returns Today's date in YYYY-MM-DD format
 */
export const getTodayForDateInput = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Converts a date from DD/MM/YYYY format to YYYY-MM-DD format (for HTML date inputs)
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date string in YYYY-MM-DD format
 */
export const convertDDMMYYYYToDateInput = (dateString: string): string => {
  try {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error converting date:', error);
    return dateString; // Return original string if there's an error
  }
}; 