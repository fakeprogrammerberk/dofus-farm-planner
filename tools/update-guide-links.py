"""Builds quest-guides.json: for each DofusDB quest, a link to its guide on
dofuspourlesnoobs.com (French). Only page titles and URLs are read from their
quest index pages, to link to them — no guide text or images are copied.

Run from the project folder:  python tools/update-guide-links.py
"""
import json, re, ssl, sys, time, unicodedata, urllib.request, html
from html.parser import HTMLParser

SITE = 'https://www.dofuspourlesnoobs.com'
API = 'https://api.dofusdb.fr'
OUT = 'quest-guides.json'
ctx = ssl.create_default_context()

# Index pages that are not quest lists.
SKIP = re.compile(r'^/(mise-a-jour|mise-agrave|mises-a-jour|news|contact|cgu|mentions|informations-sur|signaler|contributeurs|fan-art|tutoriels|outils|donjons|raids|saison|resolution|alignement|les-dofus|attitudes|avis-de|les-chemins|chemin-|les-compagnons|evenements|montures|guide-de|les-dragodindes|les-muldos|les-volkornes|sanctuaire|gouffre|sorts-communs|gestion|solveur|suivi|index|accueil)')


class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.cur = None; self.text = []
    def handle_starttag(self, tag, attrs):
        if tag == 'a': self.cur = dict(attrs).get('href') or ''; self.text = []
    def handle_data(self, d):
        if self.cur is not None: self.text.append(d)
    def handle_endtag(self, tag):
        if tag == 'a' and self.cur is not None:
            self.links.append((self.cur, re.sub(r'\s+', ' ', ''.join(self.text)).strip())); self.cur = None


def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Dofus Farm Planner guide link index)'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=60) as r: return r.read().decode('utf-8', 'replace')
    except ssl.SSLError:
        with urllib.request.urlopen(req, context=ssl._create_unverified_context(), timeout=60) as r: return r.read().decode('utf-8', 'replace')


def page_links(path):
    p = Links(); p.feed(get(SITE + path))
    for href, text in p.links:
        href = href.split('#')[0]
        if href.startswith(SITE): href = href[len(SITE):]
        if re.fullmatch(r'/[a-z0-9\-]+\.html', href): yield href, html.unescape(text)


def norm(s):
    s = unicodedata.normalize('NFD', (s or '').lower().replace('œ', 'oe').replace('æ', 'ae'))
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', re.sub(r"[’'`]", ' ', s)).strip()


def crawl(max_pages=400):
    titles, level, queue, seen = {}, {'/quecirctes.html': 0}, ['/quecirctes.html'], set()
    while queue and len(seen) < max_pages:
        path = queue.pop(0)
        if path in seen: continue
        seen.add(path)
        try: links = list(page_links(path))
        except Exception as e: print('skip', path, e, file=sys.stderr); continue
        for href, text in links:
            if text: titles.setdefault(norm(text), href)
            if href not in level and not SKIP.match(href) and level[path] < 2:
                level[href] = level[path] + 1; queue.append(href)
        time.sleep(0.4)   # be gentle with their server
    for path in list(level): titles.setdefault(norm(path[1:-5].replace('-', ' ')), path)
    print(f'read {len(seen)} index pages, {len(titles)} titles', file=sys.stderr)
    return titles


def quests():
    out, skip = [], 0
    while True:
        d = json.loads(get(f'{API}/quests?$limit=50&$skip={skip}&$select[]=id&$select[]=name'))
        out += d['data']; skip += 50
        if skip >= d['total']: return out


def main():
    titles = crawl()
    links, search = {}, {}
    for q in quests():
        fr = (q.get('name') or {}).get('fr') or ''
        if not fr: continue
        path = titles.get(norm(fr))
        if path: links[str(q['id'])] = path
        else: search[str(q['id'])] = fr
    json.dump({'site': SITE, 'updated': time.strftime('%Y-%m-%d'), 'links': links, 'search': search},
              open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    print(f'{len(links)} quests linked to a guide, {len(search)} get a search link -> {OUT}', file=sys.stderr)


if __name__ == '__main__':
    main()
