export function today() {
  const now = new Date();
  const day = now
    .getDate()
    .toString()
    .padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}/${now.getFullYear()}`;
}

function randomText(length, source) {
  let text = "";
  for (var i = 0; i < length; i++) {
    text += source.charAt(Math.floor(Math.random() * source.length));
  }
  return text;
}

export function randomAlphaText(length) {
  return randomText(
    length,
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  );
}

export function randomNumericText(length) {
  return randomText(length, "0123456789");
}
