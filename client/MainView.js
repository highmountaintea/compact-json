const m = require('mithril');
const parseJson = require('loose-json');
const stringify = require("json-stringify-pretty-compact");

// const model = require('./model');

let sample = {
  params: { id: 'A203', format: 'xml', values: [2, 3], description: null },
  entries: [
    { source: 'news outlet', date: '2019-01-01', title: 'Happy New Year', rss: 'acme/2019-01-01-happy-new-year.html' },
    { source: 'online', date: '2019-01-02', title: 'Holidays continue', rss: 'acme/2019-01-02-holidays-continue.html' },
  ],
  options: null
};

let removeUndefined = true;
let removeNulls = true;
let maxLength = '200';
let input = JSON.stringify(sample, null, '  ');
let output = '';

function removeNullsFn(obj, remUndef, remNull) {
  let keys = Object.keys(obj);
  for (let key of keys) {
    let val = obj[key];
    switch (val) {
      case undefined:
        if (remUndef) delete obj[key];
        break;
      case null:
        if (remNull) delete obj[key];
        break;
      default:
        if (typeof val === 'object') removeNullsFn(val, remUndef, remNull);
    }
  }
}

function toOutput(inp, remUndef, remNull) {
  // console.log(inp);
  let out = parseJson(inp);
  if (out != null && typeof out === 'object') removeNullsFn(out, remUndef, remNull);
  let maxlen;
  try {
    maxlen = parseInt(maxLength);
  } catch(e) {
    maxlen = 80;
  }
  let outstr = stringify(out, { maxLength: maxlen, indent: 2 });
  // console.log(outstr);
  return outstr;
}

function generateClicked() {
  try {
    output = '';
    output = toOutput(input, removeUndefined, removeNulls);
  } catch (e) {
    console.log(e);
    output = 'Error happened parsing the input JSON';
  }
}

function render() {
  return m('div', [
    m('h1', 'Compact JSON converter'),
    m('div', 'Pretty prints JS/JSON into a compact format for ease of reading'),
    m('h3', 'Input:'),
    m('textarea', { spellcheck: false, rows: 20, style: 'width: 80%;', value: input, onchange: (ev) => { input = ev.currentTarget.value; } }),
    m('div',
      m('input', { type: 'checkbox', checked: removeUndefined, onclick: () => {removeUndefined = !removeUndefined;} }),
      'Remove undefined',
    ),
    m('div',
      m('input', { type: 'checkbox', checked: removeNulls, onclick: () => {removeNulls = !removeNulls;} }),
      'Remove nulls',
    ),
    m('div',
      'Max length: ',
      m('input', { type: 'textbox', value: maxLength, onchange: (ev) => { maxLength = ev.currentTarget.value; } }),
    ),
    m('div',
      m('button', { onclick: () => { generateClicked(); } }, 'Generate Output'),
    ),
    m('h3', 'Output:'),
    m('textarea', { spellcheck: false, rows: 20, style: 'width: 80%;', value: output, onchange: (ev) => { output = ev.currentTarget.value; } }),
    // m('h3', 'Result: ' + JSON.stringify(model.getResult())),
  ]);
}

module.exports = render;
