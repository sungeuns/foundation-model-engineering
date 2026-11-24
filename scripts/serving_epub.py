"""Export the three serving lessons from a Pages build to two EPUB 3 books.

Requires Python 3 and lxml. After SITE_BASE=/foundation-model-engineering/ npm run build,
run: python scripts/serving_epub.py dist output-directory
Check each resulting file with EPUBCheck before making a release.
"""
import argparse
from datetime import timezone, datetime
from pathlib import Path
from subprocess import check_output
from urllib.parse import unquote, urljoin, urlsplit
from uuid import NAMESPACE_URL, uuid5
from zipfile import ZIP_DEFLATED, ZIP_STORED, ZipFile, ZipInfo

from lxml import etree, html

ROOT = Path(__file__).resolve().parents[1]
REPO = "https://github.com/sungeuns/foundation-model-engineering"
SITE = "https://sungeuns.github.io/foundation-model-engineering/"
SLUGS = ("kv-cache-management", "continuous-batching", "serving-policies-slos-and-fallbacks")
XHTML = "http://www.w3.org/1999/xhtml"
OPS = "http://www.idpf.org/2007/ops"
OPF = "http://www.idpf.org/2007/opf"
DC = "http://purl.org/dc/elements/1.1/"
XML = "http://www.w3.org/XML/1998/namespace"
CSS = """
body { font-family: serif; line-height: 1.55; margin: 4%; }
h1, h2, h3, th { line-height: 1.25; }
h1 { font-size: 1.7em; } h2 { margin-top: 1.6em; font-size: 1.35em; }
h3 { font-size: 1.1em; }
table { border-collapse: collapse; width: 100%; font-size: .84em; table-layout: fixed; }
table.by-metric th:first-child { width: 33%; }
th, td { padding: .3em; vertical-align: top; text-align: start; overflow-wrap: anywhere; border-bottom: 1px solid #888; }
pre { font: .84em/1.4 monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
p, li, code { overflow-wrap: break-word; }
figure, blockquote { margin: 1em 0; }
img { max-width: 100%; height: auto; }
math[display="block"] { max-width: 100%; overflow-x: auto; }
.quiz { margin: 1.2em 0; } .quiz p { margin: .45em 0; }
.web, figcaption, .edition { font-size: .9em; }
.cover { margin: 0; text-align: center; } .cover img { max-height: 97vh; }
"""
CONTAINER = b'''<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
<rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'''

COPY = {
    "en": {
        "title": "LLM Serving in Practice", "toc": "Contents", "original": "Read the web edition of this lesson",
        "intro": "Will nine requests fit in memory? When can the next request enter the batch? Can two streams with the same average speed feel different? These three lessons follow a request from admission to the last token.",
        "offline": "The examples, figures, code, quiz answers and references are included. The original section numbers are preserved. Online simulators and supplementary downloads open in a browser.",
        "credit": "An excerpt from Foundation Model Engineering by Seongeun So, developed with AI assistance.",
        "source": "Source edition on GitHub", "license": "License",
        "kv": "All nine prompts fit with 1.5 GiB to spare. Holding all nine full-length caches at once would put the pool 4.125 GiB over budget.",
        "kv_link": "Change the nine-request workload in the web calculator",
        "batch": "In the table, follow B at iteration 2 and D at iteration 3. At iteration 5, E has entered the continuous batch while the first static group still waits for C.",
        "batch_link": "Step through the two schedules online", "schedule_link": "Change the prefill schedule online",
        "schedule": ("Example schedule", "First existing decode finishes", "New prompt prefill finishes", "Unified", "Chunked"),
    },
    "ko": {
        "title": "LLM 서빙 실전", "toc": "차례", "original": "이 절의 웹 원문 읽기",
        "intro": "요청 아홉 개가 메모리에 들어갈까요? 대기 중인 요청은 언제 배치에 들어갈 수 있을까요? 평균 속도가 같아도 한쪽 응답만 느리게 느껴지는 이유는 무엇일까요? 세 절을 따라 요청을 받아들이는 순간부터 마지막 토큰까지 살펴봅니다.",
        "offline": "예제와 그림, 코드, 퀴즈 풀이, 참고문헌을 파일에 담았습니다. 절 번호는 원래 책을 따릅니다. 시뮬레이터와 추가 다운로드 링크를 누르면 웹 브라우저가 열립니다.",
        "credit": "Seongeun So가 AI의 도움을 받아 집필한 『파운데이션 모델 엔지니어링』에서 세 절을 발췌했습니다.",
        "source": "GitHub에서 이 판의 원고 보기", "license": "라이선스",
        "kv": "프롬프트 아홉 개를 넣고 나면 1.5 GiB가 남습니다. 최대 길이의 캐시 아홉 개를 동시에 담으려면 4.125 GiB가 더 필요합니다.",
        "kv_link": "웹 계산기에서 아홉 요청의 조건 바꾸기",
        "batch": "표에서 두 번째 반복의 B와 세 번째 반복의 D를 따라가 보세요. 다섯 번째 반복에서 연속 배치에는 E가 들어왔지만, 첫 번째 정적 배치는 아직 C가 끝나기를 기다립니다.",
        "batch_link": "웹에서 두 배치의 실행 순서를 한 단계씩 보기", "schedule_link": "웹에서 프리필 일정 바꾸기",
        "schedule": ("예시 일정", "기존 요청의 첫 디코딩 완료", "새 프롬프트 프리필 완료", "통합", "청크"),
    }
}


def add(parent, tag, text=None, **attrs):
    node = etree.SubElement(parent, tag, attrs)
    node.text = text
    return node


def xml(node):
    return etree.tostring(node, encoding="utf-8", xml_declaration=True)


def document(lang, title):
    root = etree.Element("html", nsmap={None: XHTML, "epub": OPS}, lang=lang)
    root.set(f"{{{XML}}}lang", lang)
    head = add(root, "head")
    add(head, "title", title)
    add(head, "link", rel="stylesheet", href="book.css")
    return root, add(root, "body")


def web_link(parent, label, href):
    return add(add(parent, "p", **{"class": "web"}), "a", label, href=href)


def online_labs(main, page_url, c):
    for island in main.xpath(".//astro-island"):
        component = Path(island.get("component-url")).name.split(".")[0]
        box = etree.Element("div")
        heading = island.xpath("preceding::h3[1]")
        if component == "KVCacheCalculator":
            preset, = main.xpath('.//a[contains(@href, "?kv=")]')
            href = urljoin(page_url, preset.get("href"))
            preset.getparent().drop_tree()
            add(box, "p", c["kv"])
            web_link(box, c["kv_link"], href)
        elif component == "ContinuousBatchingVisualizer":
            # The step-by-step instructions immediately before the web control
            # refer to its buttons. The complete 11-iteration trace remains in print.
            instruction = island.getprevious()
            if instruction is None or instruction.tag != "p":
                raise ValueError("Cannot locate batching exercise instructions")
            instruction.drop_tree()
            add(box, "p", c["batch"])
            web_link(box, c["batch_link"], page_url + "#" + heading[0].get("id"))
        elif component == "SchedulingVisualizer":
            table = add(box, "table")
            head = add(add(table, "thead"), "tr")
            titles = c["schedule"]
            for label in titles[:3]:
                add(head, "th", label, scope="col")
            body = add(table, "tbody")
            for row in ((titles[3], "66", "60"), (titles[4], "20", "78")):
                tr = add(body, "tr")
                for value in row:
                    add(tr, "td", value)
            web_link(box, c["schedule_link"], page_url + "#" + heading[0].get("id"))
        else:
            raise ValueError(f"New interactive component needs a reading equivalent: {component}")
        island.getparent().replace(island, box)


def reflow_tables(main, lang):
    # When only a few cases have six measurements, use one column per case.
    for table in main.xpath(".//table"):
        rows = [list(row) for row in table.xpath(".//tr")]
        if not rows or len(rows[0]) < 6 or len(rows) > 4:
            continue
        if any(len(row) != len(rows[0]) for row in rows):
            raise ValueError("Cannot transpose a table with spanning cells")
        result = etree.Element("table", {"class": "by-metric"})
        heading = add(result, "thead")
        body = add(result, "tbody")
        for i, cells in enumerate(zip(*rows)):
            tr = add(heading if i == 0 else body, "tr")
            for j, cell in enumerate(cells):
                if i == 0 or j == 0:
                    cell.tag = "th"
                    cell.set("scope", "col" if i == 0 else "row")
                if i == j == 0:
                    cell.text = "Metric" if lang == "en" else "항목"
                tr.append(cell)
        result.tail = table.tail
        table.getparent().replace(table, result)


def reflow_equation(math, tex):
    # Keep the original operators, operands and TeX annotation. Only rearrange
    # the presentation rows of long display equations on small readers.
    product = tex.startswith(r"2\cdot32\cdot8192")
    cost = tex.startswith(r"\text{CostScore}")
    grouped = r"\qquad" in tex and math.get("display") == "block"
    if not (product or cost or grouped):
        return
    expression = math.find("semantics/mrow")
    if expression is None:
        raise ValueError("Expected a single math expression to lay out")
    items = list(expression)
    layout = etree.Element("mtable", columnalign="left")
    row = None
    for i, term in enumerate(items):
        op = term.text if term.tag == "mo" else None
        group_start = grouped and term.tag == "mspace" and term.get("width") == "2em"
        if i == 0 or group_start or ((product or cost) and op == "=") or (cost and op == "+") or (product and i == 5):
            row = add(add(add(layout, "mtr"), "mtd"), "mrow")
        row.append(term)
    expression.getparent().replace(expression, layout)


def chapter(dist, slug, lang, c, assets):
    route = ("" if lang == "en" else "ko/") + f"chapter-12/{slug}/"
    page_url = urljoin(SITE, route)
    parser = html.HTMLParser(encoding="utf-8", remove_comments=True)
    main, = html.parse(dist / route / "index.html", parser).xpath("//main")
    title = main.find("h1").text_content().strip()
    online_labs(main, page_url, c)
    reflow_tables(main, lang)
    for node in main.xpath(".//script | .//style | .//noscript | .//*[@class='section-permalink']"):
        node.drop_tree()
    for node in main.xpath('.//span[contains(concat(" ", @class, " "), " katex ")]'):
        math, = node.xpath(".//math")
        wrapper = node.getparent() if node.getparent().get("class") == "katex-display" else node
        if wrapper is not node:
            math.set("display", "block")
        annotation, = math.xpath(".//annotation")
        math.set("alttext", annotation.text or "")
        reflow_equation(math, annotation.text or "")
        math.tail = wrapper.tail
        wrapper.getparent().replace(wrapper, math)
    for pre in main.iter("pre"):
        text = pre.text_content()
        pre.clear(keep_tail=True)
        add(pre, "code", text)
    for item in main.iter("details"):
        item.tag = "div"
        item.set("class", "quiz")
        summary = item.find(".//summary")
        summary.tag = "strong"
        question = etree.Element("p")
        item.insert(0, question)
        question.append(summary)
    for img in main.iter("img"):
        path = unquote(urlsplit(urljoin(page_url, img.get("src"))).path)
        prefix = urlsplit(SITE).path
        if not path.startswith(prefix + "_astro/"):
            raise ValueError(f"Unexpected figure path {path}")
        file = dist / path.removeprefix(prefix)
        name = file.name.split(".")[0] + file.suffix
        assets["images/" + name] = file.read_bytes()
        img.set("src", "images/" + name)
        for dimension in ("width", "height"):
            img.attrib.pop(dimension, None)
        if img.getparent().tag == "a":
            img.getparent().drop_tag()
    for anchor in main.xpath(".//a[@href]"):
        href = anchor.get("href")
        if href.startswith("#"):
            continue
        anchor.set("href", urljoin(page_url, href))
    for node in main.iter():
        for key in list(node.attrib):
            if key.startswith("data-") or key in ("style", "loading", "decoding", "fetchpriority", "tabindex", "download", "target", "srcset", "sizes"):
                del node.attrib[key]
    root, body = document(lang, title)
    body.append(main)
    web_link(main, c["original"], page_url)
    return root, title


def package(lang, dist, revision, timestamp):
    c = COPY[lang]
    assets = {"book.css": CSS.encode(), "images/cover.png": (ROOT / f"public/social/serving-field-guide-{lang}.png").read_bytes()}
    cover_doc, cover_body = document(lang, c["title"])
    cover_body.set("class", "cover")
    add(cover_body, "img", src="images/cover.png", alt=c["title"] + " — Seongeun So")
    assets["cover.xhtml"] = xml(cover_doc)
    guide, body = document(lang, c["toc"])
    add(body, "h1", c["title"])
    add(body, "p", c["intro"])
    nav = add(body, "nav")
    nav.set(f"{{{OPS}}}type", "toc")
    add(nav, "h2", c["toc"])
    choices = add(nav, "ol")
    for n, slug in enumerate(SLUGS, start=1):
        name = f"lesson-{n}.xhtml"
        page, title = chapter(dist, slug, lang, c, assets)
        assets[name] = xml(page)
        entry = add(choices, "li")
        add(entry, "a", title, href=name)
        sub = add(entry, "ol")
        for heading in page.xpath(".//main/h2"):
            add(add(sub, "li"), "a", "".join(heading.itertext()), href=name + "#" + heading.get("id"))
    add(body, "p", c["offline"])
    add(body, "p", c["credit"])
    web_link(body, c["source"], REPO + "/tree/" + revision)
    add(add(body, "p"), "a", c["license"], href="license.xhtml")
    assets["contents.xhtml"] = xml(guide)
    license_doc, license_body = document(lang, c["license"])
    add(license_body, "h1", c["license"])
    for paragraph in (ROOT / "LICENSE").read_text().strip().split("\n\n"):
        add(license_body, "p", " ".join(paragraph.splitlines()), lang="en")
    assets["license.xhtml"] = xml(license_doc)

    opf = etree.Element("package", nsmap={None: OPF, "dc": DC}, version="3.0")
    opf.set("unique-identifier", "book-id")
    meta = add(opf, "metadata")
    add(meta, f"{{{DC}}}identifier", uuid5(NAMESPACE_URL, f"{REPO}/tree/{revision}/serving-guide/{lang}").urn, id="book-id")
    add(meta, f"{{{DC}}}title", c["title"])
    add(meta, f"{{{DC}}}creator", "Seongeun So")
    add(meta, f"{{{DC}}}language", lang)
    add(meta, f"{{{DC}}}source", REPO + "/tree/" + revision)
    add(meta, "meta", timestamp, property="dcterms:modified")
    manifest = add(opf, "manifest")
    mime = {".css":"text/css", ".xhtml":"application/xhtml+xml", ".svg":"image/svg+xml", ".png":"image/png"}
    for filename, data in assets.items():
        item = add(manifest, "item", id=Path(filename).stem, href=filename, **{"media-type": mime[Path(filename).suffix]})
        if filename == "images/cover.png":
            item.set("id", "cover-image")
            item.set("properties", "cover-image")
        elif filename == "contents.xhtml":
            item.set("properties", "nav")
        elif filename.endswith(".xhtml") and b"<math " in data:
            item.set("properties", "mathml")
    spine = add(opf, "spine")
    for entry in ("cover", "contents", "lesson-1", "lesson-2", "lesson-3", "license"):
        add(spine, "itemref", idref=entry)
    assets["package.opf"] = xml(opf)
    return assets


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("dist", type=Path)
    cli.add_argument("out", type=Path)
    args = cli.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    revision = check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    seconds = int(check_output(["git", "show", "-s", "--format=%ct", revision], cwd=ROOT, text=True))
    dt = datetime.fromtimestamp(seconds, timezone.utc)
    for lang in COPY:
        assets = package(lang, args.dist, revision, dt.strftime("%Y-%m-%dT%H:%M:%SZ"))
        entries = {"mimetype": b"application/epub+zip", "META-INF/container.xml": CONTAINER}
        entries.update({"EPUB/" + name: data for name, data in assets.items()})
        with ZipFile(args.out / f"llm-serving-{lang}.epub", "w") as book:
            for name, data in entries.items():
                info = ZipInfo(name, dt.timetuple()[:6])
                book.writestr(info, data, compress_type=ZIP_STORED if name == "mimetype" else ZIP_DEFLATED)


if __name__ == "__main__":
    main()
