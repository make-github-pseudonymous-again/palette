export default function decodeState ( hash ) {
  return JSON.parse(decodeURIComponent(hash.slice(1)));
}
