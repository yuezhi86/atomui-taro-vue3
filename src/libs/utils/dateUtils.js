// 如果 value 是字符串类型，则格式必须是 YYYY/MM/DD 或 YYYY-MM-DD
export function formatDate(value, fmt = 'YYYY-MM-DD') {
  if (!value) return value;

  let date = value;

  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  }

  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }

  const obj = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };

  for (const key in obj) {
    if (new RegExp(`(${key})`).test(fmt)) {
      const str = obj[key] + '';

      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : prefixZero(str)
      );
    }
  }

  return fmt;
}
export function getDaysInMonth(year, month) {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month > 12) {
    ++year;
    month = month - 12;
  } else if (month < 1) {
    --year;
    month = month + 12;
  }

  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }

  return daysInMonth[month - 1];
}
export function prefixZero(str, length = 2) {
  str = str.toString();

  if (length > str.length) {
    const zeroLen = length - str.length;

    return new Array(zeroLen).fill('0').join('') + str;
  }

  return str;
}
