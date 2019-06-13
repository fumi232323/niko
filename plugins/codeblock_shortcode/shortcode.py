# -*- coding: utf-8 -*-
import pathlib

import pygments.lexers
import pygments.formatters
from nikola.plugin_categories import ShortcodePlugin

CODEBLOCK_HTML = '<div class="code-block {cls}">{label_html}{code}</div>'
CODEBLOCK_LABEL_HTML = '<div class="code-block-label">{label}</div>'


class CodeBlockPlugin(ShortcodePlugin):
    """ code block shortcode. """
    name = "codeblock_shortcode"

    def set_site(self, site):
        super(CodeBlockPlugin, self).set_site(site)
        self.site.register_shortcode('codeblock', self.handler)

    def handler(self, filename, post=None, **options):
        path = pathlib.Path(post.source_path).parent / filename
        with path.open() as f:
            code = f.read()
        
        lexer = pygments.lexers.get_lexer_by_name(
            options.get('lexer', 'text'))
        formatter = pygments.formatters.get_formatter_by_name(
            'html', **build_formatter_options(options))

        label_html = ''
        if options.get('label'):
            label_html = CODEBLOCK_LABEL_HTML.format(
                label=options['label']
            )
        html = CODEBLOCK_HTML.format(
            cls=options.get('wrapper_classes') or '',
            code=pygments.highlight(code, lexer, formatter),
            label_html=label_html
        )
        return html, [str(path)]


def build_formatter_options(options):
    _options = {}
    if options.get('linenos'):
        _options['linenos'] = 'linenos'
    return _options
