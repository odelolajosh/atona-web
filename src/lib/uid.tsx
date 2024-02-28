const uuid = () =>
  Array.from({ length: 36 }, (_v, i) =>
    [8, 13, 18, 23].includes(i)
      ? '-'
      : Math.floor(Math.random() * 16).toString(16)
  ).join('');

const luid = (size?: number) =>
  Array.from({ length: size || 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');

export { luid, uuid };