function parseUserAgent(userAgent) {
  if(!userAgent) return null;

  const osMap = [
    { regex: /Android/i,              name: 'Android' },
    { regex: /iPhone|iPad|iPod/i,     name: 'iPhone' },
    { regex: /Windows/i,              name: 'Windows' },
    { regex: /Macintosh|Mac OS X/i,   name: 'Mac' },
    { regex: /Linux/i,                name: 'Linux' }
  ];

  const browserMap = [
    { regex: /Edge/i,                 name: 'Edge' },
    { regex: /Opera|OPR/i,            name: 'Opera' },
    { regex: /Chrome/i,               name: 'Chrome' },
    { regex: /Firefox/i,              name: 'Firefox' },
    { regex: /Safari/i,               name: 'Safari' }
  ];

  const os = osMap.find(({ regex }) => regex.test(userAgent))?.name || 'Неизвестно';
  const browser = browserMap.find(({ regex }) => regex.test(userAgent))?.name || 'Неизвестно';

  return `${browser}, ${os}`;
}

module.exports = { parseUserAgent }