export const formatDate = (date: Date | null) => {
  if (!date) return '日時未定';

  const jstDateString = new Date(date).toLocaleString('en-US', {
    timeZone: 'Asia/Tokyo',
  });

  const d = new Date(jstDateString);

  const yyyy = d.getFullYear();

  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};

// 🌟 追記: 開催中かどうかを判定する共通関数
export const isEventOngoing = (
  date: Date | string | null | undefined,
): boolean => {
  if (!date) return false;
  return new Date(date) <= new Date();
};

export const withTokyoTimezone = (datetimeStr: string) => {
  if (!datetimeStr) return '';
  return `${datetimeStr}+09:00`;
};

export const getLocalDatetimeString = (dateString?: string | Date | null) => {
  if (!dateString) return '';

  const d = new Date(dateString);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};
