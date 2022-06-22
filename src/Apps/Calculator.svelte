<script context="module">
  export const metadata = {
    name: "ms_calc",
    props: {
      buttons: ["min", "!max", "close"],
      title: "Calculator",
      noPadding: true,
      resizable: false,
    },
  };
</script>

<script>
  /**
   *
   * STOLEN FROM HERE: https://codepen.io/dahis39/pen/jaJQeq
   *
   */
  import { onMount } from "svelte";
  let main;

  let error_text = "";
  let lg_text = "0";
  let sm_text = "";
  let show_m_icon = false;
  /**
   *  I'm guessing Win Cal is doing a queue that stores each numbers group and operator as single entity.
   *  Here, it's char-by-char string manipulation + eval().
   */
  onMount(function () {
    var numKeyReset = false;
    var lgQueue = "0";
    var smQueue = "";
    var query = "";
    var memory = "";

    var numRegEx = /^[0-9|.]$/;
    var operRegEx = /[+|\-|*|/|%]/;

    main.addEventListener("click", function ({ target }) {
      const { key } = target.dataset;

      /**
       *  Numbers
       */
      if (numRegEx.test(key)) {
        if (numKeyReset) {
          // so previous result won't stack with new num
          clear();
          numKeyReset = false;
        }
        // TODO: zero handling at first digit is still different than win cal
        if (lgQueue[0] === "0" && lgQueue.length == 1) {
          if (query.length != 0) {
            lgQueue = key;
            query += key;
          } else {
            lgQueue = key;
            query = key;
          }
          sync();
        } else {
          lgQueue += key;
          query += key;
          sync();
        }
      }
      numKeyReset = false;

      /**
       *  Usual Operators
       */
      if (operRegEx.test(key)) {
        // for repeated operator keys
        if (operRegEx.test(query[query.length - 1])) {
          smQueue = smQueue.slice(0, -1) + key;
          query = query.slice(0, -1) + key;
          lgQueue = lg_text; // get gone value(lgQueue = "" below) from DOM
        } else {
          smQueue += lgQueue;
          // eager calulation to avoid operator precedence intentionally.
          if (operRegEx.test(query)) {
            query = lgQueue = evalStr(smQueue);
          }
          smQueue += key;
          query += key;
        }
        sync();
        lgQueue = ""; // so previous result won't stack with new num
      }
      if (key === "=") {
        smQueue = "";
        lgQueue = evalStr(isNaN(query[query.length - 1]) ? query.slice(0, -1) : query);
        query = lgQueue;
        sync();
        numKeyReset = true;
      }

      /**
       *  Speical keys
       */
      if (key === "backspace") {
        if (lgQueue.length > 1) {
          lgQueue = lgQueue.slice(0, -1);
        } else if (lgQueue.length == 1) {
          lgQueue = "0";
        }
        query = query.slice(0, -1);
        sync();
      }
      if (key === "sign") {
        if (lgQueue.length != 0) {
          if (lgQueue[0] != "-") {
            var temp = query.slice(0, -lgQueue.length);
            lgQueue = "-" + lgQueue;
            query = temp + lgQueue;
          } else {
            var temp = query.slice(0, -lgQueue.length);
            lgQueue = lgQueue.substring(1, lgQueue.length);
            query = temp + lgQueue;
          }
          sync();
        }
      }
      if (key === "reciprocal") {
        var temp = query.slice(0, -lgQueue.length);
        lgQueue = evalStr("1/" + lgQueue);
        query = temp + lgQueue;
        sync();
      }
      if (key === "sqrt") {
        var temp = query.slice(0, -lgQueue.length);
        lgQueue = evalStr(Math.sqrt(lgQueue));
        query = temp + lgQueue;
        sync();
      }

      /**
       *  Memory keys
       */
      if (key === "ms") {
        memory = lgQueue;
        numKeyReset = true;
        show_m_icon = true;
      }
      if (key === "mc") {
        memory = "";
        show_m_icon = false;
      }
      if (key === "mr") {
        var temp = query.slice(0, -lgQueue.length);
        lgQueue = memory;
        query = temp + memory;
        sync();
        numKeyReset = true;
      }
      if (key === "mPlus") {
        if (memory.length == 0) {
          memory = lgQueue;
          show_m_icon = true;
        } else {
          memory = evalStr(memory + "+" + lgQueue);
        }
        numKeyReset = true;
      }
      if (key === "mMinus") {
        if (memory.length == 0) {
          memory = "-" + lgQueue;
          show_m_icon = true;
        } else {
          memory = evalStr(memory + "-" + lgQueue);
        }
        numKeyReset = true;
      }
      if (memory == "0") {
        memory = "";
        show_m_icon = false;
      }

      /**
       *  Clears
       */
      if (key === "c") {
        clear();
        sync();
      }
      if (key === "ce") {
        query = query.slice(0, -lgQueue.length);
        lgQueue = "0";
        sync();
      }
    });

    function evalStr(str) {
      try {
        str = str + "";
        // fix parser errors
        str = str.replace(/^\-/, "0-");
        str = str.replace(/\-\-/, "+");

        var result = eval(str) + "";

        // error handlings
        if (result.indexOf("Infinity") != -1) {
          error_text = "Cannot divide by zero";
          return "0";
        }
        if (result.indexOf("NaN") != -1) {
          error_text = "Invalid input";
          return "0";
        }

        if (result.length > 12) {
          // limited 12 digits output
          result = Number(result).toFixed(12);
        }
        return result;
      } catch (e) {
        return 0;
      }
    }

    function clear() {
      lgQueue = "0";
      smQueue = "";
      query = "";
      error_text = "";
    }
    function sync() {
      lg_text = lgQueue;
      sm_text = smQueue;
    }
  });
</script>

<main bind:this={main}>
  <div class="display">
    <div class="outer-div">
      <div class="inner-div sm-text">{sm_text}</div>
    </div>
    <div class="outer-div">
      <div class="inner-div lg-text">{lg_text}</div>
    </div>
    <div class="error">{error_text}</div>
    <div class="m-icon" style:display={show_m_icon ? "block" : "none"}>M</div>
  </div>
  <div class="keyboard">
    <button data-key="mc">MC</button>
    <button data-key="mr">MR</button>
    <button data-key="ms">MS</button>
    <button data-key="mPlus">M+</button>
    <button data-key="mMinus">M-</button>

    <button data-key="backspace">&#9664;--</button>
    <button data-key="ce">CE</button>
    <button data-key="c">C</button>
    <button data-key="sign">+-</button>
    <button data-key="sqrt">&radic;</button>

    <button class="btn-white" data-key="7">7</button>
    <button class="btn-white" data-key="8">8</button>
    <button class="btn-white" data-key="9">9</button>
    <button data-key="/">/</button>
    <button data-key="%">%</button>

    <button class="btn-white" data-key="4">4</button>
    <button class="btn-white" data-key="5">5</button>
    <button class="btn-white" data-key="6">6</button>
    <button data-key="*">*</button>
    <button data-key="reciprocal">1/x</button>
  </div>
  <div class="keyboard-bot">
    <div class="bot-left">
      <button class="btn-white" data-key="1">1</button>
      <button class="btn-white" data-key="2">2</button>
      <button class="btn-white" data-key="3">3</button>
      <button data-key="-">-</button>

      <button class="btn-wide btn-white" data-key="0">0</button>
      <button class="btn-white" data-key=".">.</button>
      <button data-key="+">+</button>
    </div>
    <div class="bot-right">
      <button class="btn-tall" data-key="=">=</button>
    </div>
  </div>
</main>

<style>
  *:not(.inner-div) {
    user-select: none;
  }

  main {
    padding-top: 15px;
    width: 226px;
    padding-bottom: 12px;
    background-color: #d9e4f1;
  }

  .display {
    position: relative;
    width: 197.5px;
    margin: 0 0 3px 14px;
    border: solid 1px gray;
    border-radius: 3px;
    background: linear-gradient(#e5effb 0%, #e2eaf3 60%, #f5f8fd 80%, white 100%);
    box-shadow: 0px -1px 14px white inset;
  }

  .display div {
    color: black;
    text-align: right;
  }

  .outer-div {
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    text-align: right;
    overflow: hidden;
    white-space: nowrap;
  }
  .inner-div {
    float: right;
  }

  .sm-text {
    font-size: 11px;
    letter-spacing: 2px;
    min-height: 16px;
    padding-top: 3px;
    margin: 0;
  }
  .lg-text {
    font-size: 20px;
    padding-left: 10px;
    margin: 0;
  }
  .m-icon {
    position: absolute;
    left: 4px;
    bottom: 8px;
    display: none;
  }
  .error {
    min-height: 12px;
    font-size: 10px;
    line-height: 8px;
    padding-right: 8px;
  }

  .keyboard {
    width: 100%;
    margin: 0 0 0 14px;
  }
  .keyboard-bot {
    margin-left: 3px;
  }

  button {
    all: revert;
    width: 37px;
    height: 29px;
    margin: 2px 0;
    border: 1px solid rgba(0, 0, 0, 0.4);
    border-radius: 2px;

    background: linear-gradient(#f0f6fb 0%, #e2eaf3 49%, #d5e0ed 50%, #d7e2ef 100%);
    box-shadow: 0px -1px 6px white inset;
  }
  button:hover {
    background: linear-gradient(#ffe3b5 50%, #fcbf5d 50%);
    box-shadow: 1px 1px 2px #ffb76b, 0px -1px 5px white inset;
    border-color: #fcbf5d;
  }
  .btn-white {
    font-size: 14px;
    background: linear-gradient(#f2f5f9 0%, #f2f5f9 49%, #eef2f7 50%, #eef2f7 100%);
    box-shadow: 1.6px 1.6px 0px white inset, -1.6px -1.6px 0px white inset;
  }

  .btn-wide {
    width: 77px;
  }
  .btn-tall {
    position: absolute;
    left: -1px;
    height: 63px;
  }

  .bot-left {
    display: inline-block;
    width: 71%;
    margin-left: 11px;
  }
  .bot-right {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 20%;
  }
</style>
