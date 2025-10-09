/**
 * Utility functions for date formatting
 */

/**
 * Converts a date string from yyyy-mm-dd to dd-mm-yyyy format
 * @param dateStr - Date string in yyyy-mm-dd format
 * @returns Formatted date string in dd-mm-yyyy format
 */
export function formatDateToDDMMYYYY(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Converts a Date object to dd-mm-yyyy format
 * @param date - Date object
 * @returns Formatted date string in dd-mm-yyyy format
 */
export function formatDateObjectToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
