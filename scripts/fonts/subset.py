import urllib.request, urllib.parse, re, sys, os

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

ASCII_PRINTABLE = ''.join(chr(c) for c in range(0x20, 0x7F))
SMART_PUNCT = "’‘“”—–…·"
ARROWS = "→↓↗↳∞"

TEXT_FRAUNCES = ASCII_PRINTABLE + SMART_PUNCT
TEXT_MONO = ASCII_PRINTABLE + SMART_PUNCT + ARROWS

def fetch(family_query, text, out_path):
    text_enc = urllib.parse.quote(text, safe='')
    url = f"https://fonts.googleapis.com/css2?family={family_query}&text={text_enc}&display=swap"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req).read().decode()
    m = re.search(r'url\((https://fonts\.gstatic\.com/[^)]+)\)', css)
    if not m:
        print("NO MATCH for", out_path, css[:500])
        sys.exit(1)
    font_url = m.group(1)
    req2 = urllib.request.Request(font_url, headers={"User-Agent": UA})
    data = urllib.request.urlopen(req2).read()
    with open(out_path, 'wb') as f:
        f.write(data)
    print(out_path, len(data), "bytes <-", font_url)

outdir = sys.argv[1]
os.makedirs(outdir, exist_ok=True)

fetch("Fraunces:opsz,wght,SOFT,WONK@14,400,0,0", TEXT_FRAUNCES, f"{outdir}/fraunces-text.woff2")
fetch("Fraunces:opsz,wght,SOFT,WONK@144,600,0,1", TEXT_FRAUNCES, f"{outdir}/fraunces-display.woff2")
fetch("IBM+Plex+Mono:wght@400", TEXT_MONO, f"{outdir}/plex-mono-400.woff2")
fetch("IBM+Plex+Mono:wght@700", TEXT_MONO, f"{outdir}/plex-mono-700.woff2")
