export const truncateText = (text: string, maxLength: number, ellipsis: boolean = false): string => {
  if (text.length <= maxLength) return text;

  if (ellipsis) return text.slice(0, maxLength - 3) + '...';

  return text.slice(0, maxLength);
};
