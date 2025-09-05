export const ok = (body: unknown, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(body),
});
export const bad = (message: string, statusCode = 400) => ({
  statusCode,
  body: JSON.stringify({ error: message }),
});