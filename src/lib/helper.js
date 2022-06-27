// prettier-ignore
/**
 * @returns {string}
 */
export function hashCode(r){var n,t=String(r),o=0;if(0===t.length)return "";for(n=0;n<t.length;n++)o=(o<<5)-o+t.charCodeAt(n),o|=0;return Array.from(o.toString()).map(r=>"ledoshcyan"[r]).join("")}

export function repeatEvery(func, interval, ...args) {
  return new (class {
    cancelled = false;
    started = false;
    constructor() {
      // Check current time and calculate the delay until next interval
      var now = new Date(),
        delay = interval - (now % interval);
      const start = () => {
        if (this.cancelled) return;
        // Execute function now...
        func(...args);
        // ... and every interval
        this.interval = setInterval(func, interval); // if you need to destroy the interval
        this.started = true;
      };
      // Delay execution until it's an even interval
      setTimeout(start, delay);
    }
    stop() {
      if (this.started) {
        clearInterval(this.interval);
      } else {
        this.cancelled = true;
      }
    }
  })();
}

export class Calendar {
  static getLastDay(month, year) {
    if (month === 1) {
      // only do the calculation if it's a february
      return new Date(year || new Date().getFullYear(), 1, 29).getMonth() === 1 ? 29 : 28;
    }
    if ([3, 5, 8, 10].includes(month)) return 30;
    return 31;
  }
  static getDays(month, year) {
    return [...Array(this.getLastDay(month, year)).keys()].map((a) => a + 1);
  }
  static getLocaleWeekdays(locale = []) {
    const final = [];
    for (let i = 0; i < 7; i++) {
      final.push(new Date(0, 0, i).toLocaleDateString(locale, { weekday: "long" }));
    }
    return final;
  }
  static getLocaleMonths(locale = []) {
    const final = [];
    for (let i = 0; i < 12; i++) {
      final.push(new Date(0, i).toLocaleDateString(locale, { month: "long" }));
    }
    return final;
  }
}

export function chunk(array, chunkSize) {
  const final = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    final.push(chunk);
  }
  return final;
}

export function closest(array, goal) {
  return array.reduce((prev, curr) => (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev));
}

export function toFixedNumber(num, digits = 0, base) {
  var pow = Math.pow(base || 10, digits);
  return Math.round(num * pow) / pow;
}