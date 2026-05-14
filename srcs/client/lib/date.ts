// 日付を見やすく変換する関数 (2026-05-20T... -> 5/20 19:00)
export const formatDate = (date: Date | null) => {
  if (!date) return '日時未定';
  return new Date(date).toLocaleString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
