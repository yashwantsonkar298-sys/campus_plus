export const getReadingTime = (content = '') => {
  const words = String(content)
    .replace(/```[\s\S]*?```/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

export const formatPostDate = (date, options = {}) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return 'Recently';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(value);
};

export const slugify = (value = '') => String(value)
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-');
