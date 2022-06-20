// prettier-ignore
/**
 * @returns {string}
 */
export function hashCode(r){var n,t=String(r),o=0;if(0===t.length)return "";for(n=0;n<t.length;n++)o=(o<<5)-o+t.charCodeAt(n),o|=0;return Array.from(o.toString()).map(r=>"ledoshcyan"[r]).join("")}
