// ==UserScript==
// @name        highlight bitbucket pr
// @namespace   rooter@kyberian.net
// @include     https://bitbucket.org/*
// @version     0.2
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @resource    syntaxHighlightCSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// ==/UserScript==
var syntax_highlighter_CSS = GM_getResourceText('syntaxHighlightCSS');
GM_addStyle(syntax_highlighter_CSS);
GM_addStyle('.hljs { padding: 0; }');

this.$ = this.jQuery = jQuery.noConflict(true);

function hlDiff(diffContainer) {
  const brk = '<span class="brkMarker"></span>';

  const $diffContainer = $(diffContainer);
  const sourceLinesElements = $.makeArray($diffContainer.find('pre.source'));

  const taggedSource = sourceLinesElements.map(e => e.innerHTML.substring(1) + '\n').join(brk);

  const taggedSourceElement = document.createElement('taggedSource');
  taggedSourceElement.innerHTML = taggedSource;
  hljs.highlightBlock(taggedSourceElement);
  const hlSnippets = taggedSourceElement.innerHTML.split(brk);
  sourceLinesElements.forEach(function (e, i) {
      e.innerHTML = e.innerHTML.substring(0, 1) + hlSnippets[i];
  });
}

$('#pullrequest').arrive('#changeset-diff section', function() {
  hlDiff(this);
});
