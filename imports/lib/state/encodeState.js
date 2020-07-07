export default function encodeState ( state ) {
  return '#' + encodeURIComponent(JSON.stringify(state)) ;
}
