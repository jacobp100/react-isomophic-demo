export const yupErrors = e => e.inner.reduce((accum, { path, message }) => {
  accum[path] = message; // eslint-disable-line
  return accum;
}, {});
