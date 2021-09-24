/**
  shave - Shave is a javascript plugin that truncates multi-line text within a html element based on set max height
  @version v3.0.0
  @link https://github.com/yowainwright/shave#readme
  @author Jeff Wainwright <yowainwright@gmail.com> (jeffry.in)
  @license MIT
**/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function shave(target, maxHeight, opts) {
    if (typeof maxHeight === 'undefined' || isNaN(maxHeight))
        throw Error('maxHeight is required');
    var els = typeof target === 'string' ? __spreadArray([], __read(document.querySelectorAll(target)), false) : 'length' in target ? __spreadArray([], __read(target), false) : [target];
    if (!els)
        return;
    var character = (opts === null || opts === void 0 ? void 0 : opts.character) || '&mldr;';
    var classname = (opts === null || opts === void 0 ? void 0 : opts.classname) || 'js-shave';
    var spaces = typeof (opts === null || opts === void 0 ? void 0 : opts.spaces) === 'boolean' ? opts.spaces : true;
    var charclassname = (opts === null || opts === void 0 ? void 0 : opts.charclassname) || 'js-shave-char';
    var charHtml = "<span class=\"" + charclassname + "\">" + character + "</span>";
    for (var i = 0; i < els.length; i += 1) {
        var el = els[i];
        var styles = el.style;
        var span = el.querySelector("." + classname);
        var textProp = el.textContent === undefined ? 'innerText' : 'textContent';
        // If element text has already been shaved
        if (span) {
            // Remove the ellipsis to recapture the original text
            el.removeChild(el.querySelector("." + charclassname));
            el[textProp] = el[textProp]; // eslint-disable-line
            // nuke span, recombine text
        }
        var fullText = el[textProp];
        var words = spaces ? fullText.split(' ') : fullText;
        // If 0 or 1 words, we're done
        if (words.length < 2)
            continue;
        // Temporarily remove any CSS height for text height calculation
        var heightStyle = styles.height;
        styles.height = 'auto';
        var maxHeightStyle = styles.maxHeight;
        styles.maxHeight = 'none';
        // If already short enough, we're done
        if (el.offsetHeight <= maxHeight) {
            styles.height = heightStyle;
            styles.maxHeight = maxHeightStyle;
            continue;
        }
        // Binary search for number of words which can fit in allotted height
        var max = words.length - 1;
        var min = 0;
        var pivot = void 0;
        while (min < max) {
            pivot = (min + max + 1) >> 1; // eslint-disable-line no-bitwise
            el[textProp] = spaces ? words.slice(0, pivot).join(' ') : words.slice(0, pivot);
            el.insertAdjacentHTML('beforeend', charHtml);
            if (el.offsetHeight > maxHeight)
                max = pivot - 1;
            else
                min = pivot;
        }
        el[textProp] = spaces ? words.slice(0, max).join(' ') : words.slice(0, max);
        el.insertAdjacentHTML('beforeend', charHtml);
        var diff = spaces ? " " + words.slice(max).join(' ') : words.slice(max);
        var shavedText = document.createTextNode(diff);
        var elWithShavedText = document.createElement('span');
        elWithShavedText.classList.add(classname);
        elWithShavedText.style.display = 'none';
        elWithShavedText.appendChild(shavedText);
        el.insertAdjacentElement('beforeend', elWithShavedText);
        styles.height = heightStyle;
        styles.maxHeight = maxHeightStyle;
    }
}

export { shave as default };
