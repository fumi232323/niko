# -*- coding: utf-8 -*-
import pathlib
import shutil

from nikola.plugin_categories import ShortcodePlugin


FIGURE_HTML = '''<div class="figure">
<img alt="/images/{folder}/{filename}" src="../../images/{folder}/{filename}">
</div>'''

IMAGES_BASE = 'files/images'


class FigureShortcodePlugin(ShortcodePlugin):
    """
    * 指定した figure ファイルを files/images 配下へ post のディレクトリ構造を保持した状態で copy
    * figure の HTML を返す
    """
    name = "figure_shortcode"

    def set_site(self, site):
        super(FigureShortcodePlugin, self).set_site(site)
        self.site.register_shortcode('figure', self.handler)

    def handler(self, filename, post=None, **options):
        src = pathlib.Path(post.source_path).parent / filename
        dst = pathlib.Path(IMAGES_BASE) / post.folder / filename
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)

        html = FIGURE_HTML.format(
            folder=post.folder,
            filename=filename
        )
        return html, []
