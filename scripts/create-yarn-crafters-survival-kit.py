"""Build the sourced, fillable FiberTools newsletter lead magnet."""

from pathlib import Path
from shutil import copyfile

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "yarn-crafters-survival-kit.pdf"
PUBLIC = ROOT / "public" / "survival-kit.pdf"
PAGE_W, PAGE_H = letter

INK = HexColor("#302A2D")
GREEN = HexColor("#61775B")
PALE_GREEN = HexColor("#EEF2E9")
PLUM = HexColor("#7D5A70")
GOLD = HexColor("#C18B3C")
CREAM = HexColor("#F8F3EC")
LINE = HexColor("#D8CEC4")
MUTED = HexColor("#6B6266")
FIELD = HexColor("#FFFDFC")

CYC_WEIGHTS = "craftyarncouncil.com/standards/yarn-weight-system"
CYC_SIZES = "craftyarncouncil.com/standards/hooks-and-needles"
CYC_TERMS = "craftyarncouncil.com/standards/crochet-abbreviations"


def text(c, value, x, y, size=10, color=INK, font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def paragraph(c, value, x, y, width, size=9, leading=13, color=MUTED, font="Helvetica"):
    words = value.split()
    lines, current = [], ""
    for word in words:
        trial = f"{current} {word}".strip()
        if c.stringWidth(trial, font, size) <= width:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    for index, line in enumerate(lines):
        text(c, line, x, y - index * leading, size, color, font)
    return y - len(lines) * leading


def footer(c, number, source=None):
    c.setStrokeColor(LINE)
    c.line(42, 34, PAGE_W - 42, 34)
    text(c, "FiberTools Yarn Crafter's Survival Kit", 42, 20, 7.5, MUTED)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawRightString(PAGE_W - 42, 20, f"Page {number}")
    if source:
        c.setFont("Helvetica", 6.7)
        c.drawCentredString(PAGE_W / 2, 20, source)


def header(c, number, title, subtitle, source=None):
    text(c, "FIBERTOOLS", 42, PAGE_H - 34, 8.5, GREEN, "Helvetica-Bold")
    c.setStrokeColor(GREEN)
    c.setLineWidth(2)
    c.line(42, PAGE_H - 42, PAGE_W - 42, PAGE_H - 42)
    text(c, title, 48, PAGE_H - 88, 23, GREEN, "Helvetica-Bold")
    paragraph(c, subtitle, 48, PAGE_H - 110, PAGE_W - 96, 9.5, 13, INK)
    footer(c, number, source)


def table(c, x, top, widths, headers, rows, row_height=30, font_size=7.5):
    total = sum(widths)
    c.setFillColor(GREEN)
    c.rect(x, top - row_height, total, row_height, stroke=0, fill=1)
    cursor = x
    for index, label in enumerate(headers):
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(cursor + widths[index] / 2, top - row_height + 10, label)
        cursor += widths[index]
    y = top - row_height
    for row_index, row in enumerate(rows):
        y -= row_height
        c.setFillColor(white if row_index % 2 == 0 else CREAM)
        c.rect(x, y, total, row_height, stroke=0, fill=1)
        cursor = x
        for col_index, value in enumerate(row):
            c.setStrokeColor(LINE)
            c.rect(cursor, y, widths[col_index], row_height, stroke=1, fill=0)
            c.setFillColor(INK)
            c.setFont("Helvetica", font_size)
            c.drawCentredString(cursor + widths[col_index] / 2, y + 10, str(value))
            cursor += widths[col_index]
    return y


def field(c, name, label, x, y, width, height=22, multiline=False):
    text(c, label.upper(), x, y + height + 4, 6.8, MUTED, "Helvetica-Bold")
    c.acroForm.textfield(
        name=name,
        x=x,
        y=y,
        width=width,
        height=height,
        borderWidth=1,
        borderColor=LINE,
        fillColor=FIELD,
        textColor=INK,
        forceBorder=True,
        fontName="Helvetica",
        fontSize=8.5,
        fieldFlags="multiline" if multiline else "",
    )


def checkbox(c, name, label, x, y):
    c.acroForm.checkbox(
        name=name,
        x=x,
        y=y,
        size=12,
        buttonStyle="check",
        borderWidth=1,
        borderColor=LINE,
        fillColor=FIELD,
        textColor=PLUM,
        forceBorder=True,
    )
    text(c, label, x + 19, y + 1, 8.5, INK)


def cover(c):
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.rect(0, PAGE_H - 150, PAGE_W, 150, stroke=0, fill=1)
    text(c, "FIBERTOOLS", 48, PAGE_H - 63, 11, white, "Helvetica-Bold")
    text(c, "fibertools.app", 48, PAGE_H - 84, 9, white)
    text(c, "The Yarn Crafter's", 48, PAGE_H - 235, 36, INK, "Helvetica-Bold")
    text(c, "Survival Kit", 48, PAGE_H - 279, 36, GREEN, "Helvetica-Bold")
    paragraph(c, "Seven practical references for swatching, gauge, tools, yarn planning, and rescuing a project before an expensive mistake.", 48, PAGE_H - 316, 500, 12, 17, MUTED)
    c.setFillColor(PALE_GREEN)
    c.roundRect(48, 230, PAGE_W - 96, 210, 12, stroke=0, fill=1)
    text(c, "WHAT IS INSIDE", 68, 412, 9, GREEN, "Helvetica-Bold")
    items = [
        "Current yarn-weight starting ranges",
        "Common hook and needle conversions",
        "US and UK crochet terms",
        "Treated-swatch size prediction",
        "Yarn planning from your own swatch",
        "A fillable project-rescue record",
    ]
    for index, item in enumerate(items):
        y = 380 - index * 29
        c.setFillColor(GREEN)
        c.circle(72, y + 3, 4, stroke=0, fill=1)
        text(c, item, 88, y, 10, INK)
    paragraph(c, "These are planning aids, not promises. Yarn construction, stitch pattern, tension, treatment, finishing, and measurement technique can change the result.", 48, 195, 500, 9, 13, MUTED)
    text(c, "Free for personal project planning", 48, 112, 10, PLUM, "Helvetica-Bold")
    text(c, "Get Swatch Signal and free tools at fibertools.app/newsletter", 48, 88, 9, MUTED)
    footer(c, 1)
    c.showPage()


def weights(c):
    header(c, 2, "Yarn weight starting ranges", "Use these industry ranges to orient a project, then follow the pattern and make a treated swatch.", CYC_WEIGHTS)
    rows = [
        ("0 Lace", "33-40*", "1.5-2.25", "32-42 dc*", "steel 1.4-1.6 / regular 2.25"),
        ("1 Super Fine", "27-32", "2.25-3.25", "21-32", "2.25-3.5"),
        ("2 Fine", "23-26", "3.25-3.75", "16-20", "3.5-4.5"),
        ("3 Light", "21-24", "3.75-4.5", "12-17", "4.5-5.5"),
        ("4 Medium", "16-20", "4.5-5.5", "11-14", "5.5-6.5"),
        ("5 Bulky", "12-15", "5.5-8", "8-11", "6.5-9"),
        ("6 Super Bulky", "7-11", "8-12.75", "7-9", "9-15"),
        ("7 Jumbo", "6 or fewer", "12.75+", "6 or fewer", "15+"),
    ]
    table(c, 42, 630, [105, 82, 88, 82, 171], ["WEIGHT", "KNIT STS/4 IN", "NEEDLE MM", "CROCHET/4 IN", "HOOK MM"], rows, 37, 6.9)
    text(c, "* Lace gauges vary widely. The CYC lists lace crochet in double crochet rather than single crochet.", 48, 270, 7.8, MUTED)
    c.setFillColor(PALE_GREEN)
    c.roundRect(48, 106, 516, 125, 10, stroke=0, fill=1)
    text(c, "THREE RULES THAT PREVENT EXPENSIVE GUESSES", 66, 204, 10, GREEN, "Helvetica-Bold")
    paragraph(c, "1. Treat the swatch the way the finished item will be washed, blocked, dried, and handled. 2. Buy the planned yarn together when dye-lot consistency matters. 3. Use the millimeter tool size and your measured gauge when labels, brands, and patterns disagree.", 66, 180, 475, 9.5, 15, INK)
    c.showPage()


def sizes(c):
    header(c, 3, "Hook and needle conversions", "Letter and number labels vary. Treat the millimeter measurement as the reliable reference and recheck gauge.", CYC_SIZES)
    text(c, "CROCHET HOOKS", 48, 635, 11, GREEN, "Helvetica-Bold")
    crochet = [("2.25", "B-1"), ("2.75", "C-2"), ("3.25", "D-3"), ("3.5", "E-4"), ("3.75", "F-5"), ("4", "G-6"), ("4.5", "7"), ("5", "H-8"), ("5.5", "I-9"), ("6", "J-10"), ("6.5", "K-10 1/2"), ("8", "L-11"), ("9", "M/N-13"), ("10", "N/P-15"), ("11.5", "P-16"), ("15", "P/Q"), ("16", "Q"), ("19", "S")]
    table(c, 48, 615, [82, 82], ["MM", "US"], crochet, 20, 7.4)
    text(c, "KNITTING NEEDLES", 330, 635, 11, GREEN, "Helvetica-Bold")
    needles = [("1.5", "000"), ("1.75", "00"), ("2", "0"), ("2.25", "1"), ("2.75", "2"), ("3.25", "3"), ("3.5", "4"), ("3.75", "5"), ("4", "6"), ("4.5", "7"), ("5", "8"), ("5.5", "9"), ("6", "10"), ("6.5", "10 1/2"), ("8", "11"), ("9", "13"), ("10", "15"), ("12.75", "17")]
    table(c, 330, 615, [82, 82], ["MM", "US"], needles, 20, 7.4)
    c.setFillColor(CREAM)
    c.roundRect(235, 80, 285, 120, 10, stroke=0, fill=1)
    text(c, "DO NOT FORCE THE CONVERSION", 253, 174, 9, PLUM, "Helvetica-Bold")
    paragraph(c, "A conversion identifies the tool, not the resulting fabric. If the measured gauge is wrong, change the tool or material and make another swatch.", 253, 150, 245, 8.7, 13, INK)
    c.showPage()


def terms(c):
    header(c, 4, "US and UK crochet terms", "Confirm the terminology before starting. The same stitch name can describe a different stitch system.", CYC_TERMS)
    c.setFillColor(HexColor("#F6E7E2"))
    c.roundRect(48, 570, 516, 70, 8, stroke=0, fill=1)
    text(c, "THE COMMON TRAP", 66, 615, 10, PLUM, "Helvetica-Bold")
    paragraph(c, "US double crochet is not UK double crochet. US single crochet equals UK double crochet. Check the pattern origin or its terminology note.", 66, 592, 470, 9.5, 14, INK)
    rows = [
        ("Slip stitch (sl st)", "Slip stitch (ss)"),
        ("Single crochet (sc)", "Double crochet (dc)"),
        ("Half double crochet (hdc)", "Half treble (htr)"),
        ("Double crochet (dc)", "Treble (tr)"),
        ("Treble / triple crochet (tr)", "Double treble (dtr)"),
        ("Double treble (dtr)", "Triple treble (trtr)"),
        ("Triple treble (trtr)", "Quadruple treble (qtr)"),
        ("Gauge", "Tension"),
        ("Yarn over (yo)", "Yarn over hook (yoh)"),
        ("Skip (sk)", "Miss (m)"),
    ]
    table(c, 48, 545, [258, 258], ["UNITED STATES", "UNITED KINGDOM"], rows, 27, 8.1)
    c.setFillColor(PALE_GREEN)
    c.roundRect(48, 116, 516, 95, 8, stroke=0, fill=1)
    text(c, "READ THE SETUP NOTES", 66, 185, 10, GREEN, "Helvetica-Bold")
    paragraph(c, "Do not infer the system from one abbreviation alone. Designers may define custom terms. Preserve the pattern's definitions, stitch multiple, turning-chain rules, and whether joins count as stitches.", 66, 161, 470, 9, 13, INK)
    c.showPage()


def swatch_math(c):
    header(c, 5, "Swatch-to-finish calculation", "Measure the same swatch before and after the treatment planned for the finished item.")
    text(c, "1. RECORD THE CHANGE", 48, 628, 10, PLUM, "Helvetica-Bold")
    c.setFillColor(PALE_GREEN)
    c.roundRect(48, 530, 516, 75, 10, stroke=0, fill=1)
    text(c, "change rate = treated measurement / untreated measurement", 72, 574, 14, GREEN, "Helvetica-Bold")
    text(c, "Example: 4.25 in / 4.00 in = 1.0625, or about 6.25% growth", 72, 550, 10, INK)
    text(c, "2. PREDICT A FINISHED DIMENSION", 48, 490, 10, PLUM, "Helvetica-Bold")
    c.setFillColor(CREAM)
    c.roundRect(48, 402, 516, 66, 10, stroke=0, fill=1)
    text(c, "predicted treated dimension = planned untreated dimension x change rate", 66, 440, 12, GREEN, "Helvetica-Bold")
    text(c, "Example: 20 in x 1.0625 = about 21.25 in after the same treatment", 66, 417, 9.5, INK)
    text(c, "3. WORK BACKWARD FROM A TARGET", 48, 360, 10, PLUM, "Helvetica-Bold")
    c.setFillColor(PALE_GREEN)
    c.roundRect(48, 272, 516, 66, 10, stroke=0, fill=1)
    text(c, "needed untreated dimension = target treated dimension / change rate", 66, 310, 12, GREEN, "Helvetica-Bold")
    text(c, "Example: 20 in / 1.0625 = about 18.82 in before treatment", 66, 287, 9.5, INK)
    c.setFillColor(HexColor("#F6E7E2"))
    c.roundRect(48, 106, 516, 125, 10, stroke=0, fill=1)
    text(c, "LIMITATIONS", 66, 203, 10, PLUM, "Helvetica-Bold")
    paragraph(c, "A swatch is evidence, not a guarantee. Large pieces can hang differently; stitch patterns, seams, ribbing, colorwork, garment weight, wear, and treatment can change the result. Use the same yarn, tool, stitch, measurement method, and treatment, then allow a planning range.", 66, 178, 472, 9.2, 14, INK)
    c.showPage()


def yarn_math(c):
    header(c, 6, "Estimate yarn from your swatch", "Use measured consumption from the planned yarn and stitch rather than a generic yards-per-square-inch claim.")
    text(c, "STEP 1 - MEASURE", 48, 630, 10, PLUM, "Helvetica-Bold")
    paragraph(c, "Record the treated swatch width, height, and weight. Calculate its area only when the project can reasonably be estimated by area.", 48, 606, 500, 9.5, 14, INK)
    c.setFillColor(PALE_GREEN)
    c.roundRect(48, 505, 516, 68, 10, stroke=0, fill=1)
    text(c, "project grams = swatch grams x (project area / swatch area)", 72, 544, 14, GREEN, "Helvetica-Bold")
    text(c, "Example: 8 g x (2,000 sq in / 25 sq in) = 640 g before contingency", 72, 521, 9.5, INK)
    text(c, "STEP 2 - CONVERT TO SKEINS", 48, 468, 10, PLUM, "Helvetica-Bold")
    c.setFillColor(CREAM)
    c.roundRect(48, 373, 516, 70, 10, stroke=0, fill=1)
    text(c, "skeins by weight = planned grams / label grams per skein", 66, 416, 12, GREEN, "Helvetica-Bold")
    text(c, "Round up only after adding a project-specific contingency.", 66, 392, 9.5, INK)
    text(c, "STEP 3 - CROSS-CHECK", 48, 337, 10, PLUM, "Helvetica-Bold")
    paragraph(c, "If the swatch has separately measured yarn length and weight, calculate both and use the more conservative whole-skein result. Keep the label and dye lot with the project record.", 48, 313, 500, 9.5, 14, INK)
    c.setFillColor(HexColor("#F6E7E2"))
    c.roundRect(48, 106, 516, 145, 10, stroke=0, fill=1)
    text(c, "WHEN AREA SCALING IS WEAK", 66, 224, 10, PLUM, "Helvetica-Bold")
    paragraph(c, "Do not use simple area scaling when shaping, dense borders, fringe, cables, texture, color changes, motif joins, varying gauges, or garment construction materially change consumption. Use a larger representative sample, the pattern designer's yardage, and a suitable contingency.", 66, 199, 470, 9.2, 14, INK)
    c.showPage()


def project_record(c):
    header(c, 7, "Fillable project-rescue record", "Save a fresh copy for each project, or print this page and keep it with the yarn label.")
    field(c, "rescue_project", "Project", 48, 616, 252)
    field(c, "rescue_pattern", "Pattern or source", 318, 616, 246)
    field(c, "rescue_yarn", "Yarn, colorway, and dye lot", 48, 557, 340)
    field(c, "rescue_tool", "Hook or needle in mm", 406, 557, 158)
    field(c, "rescue_pattern_gauge", "Pattern gauge", 48, 498, 158)
    field(c, "rescue_before", "Swatch before treatment", 224, 498, 164)
    field(c, "rescue_after", "Swatch after treatment", 406, 498, 158)
    field(c, "rescue_target", "Target finished size", 48, 439, 158)
    field(c, "rescue_multiple", "Stitch or repeat multiple", 224, 439, 164)
    field(c, "rescue_yarn_plan", "Yarn planned plus contingency", 406, 439, 158)
    text(c, "BEFORE AN IRREVERSIBLE STEP", 48, 397, 9, PLUM, "Helvetica-Bold")
    checks = [
        ("rescue_check_gauge", "Treated gauge rechecked", 48, 364),
        ("rescue_check_size", "Counts rechecked against target", 306, 364),
        ("rescue_check_dye", "Dye lots and quantities recorded", 48, 334),
        ("rescue_check_repeat", "Repeat and edge stitches confirmed", 306, 334),
        ("rescue_check_care", "Care method tested on swatch", 48, 304),
        ("rescue_check_pattern", "Pattern notes and modifications saved", 306, 304),
    ]
    for name, label, x, y in checks:
        checkbox(c, name, label, x, y)
    field(c, "rescue_left_off", "Where I left off", 48, 225, 516, 34, True)
    field(c, "rescue_change", "What changed and why", 48, 142, 516, 42, True)
    field(c, "rescue_next", "Next decision", 48, 67, 516, 34, True)
    c.showPage()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=letter)
    c.setTitle("FiberTools Yarn Crafter's Survival Kit")
    c.setAuthor("FiberTools")
    c.setSubject("Sourced yarn, gauge, swatch, and project-rescue reference")
    cover(c)
    weights(c)
    sizes(c)
    terms(c)
    swatch_math(c)
    yarn_math(c)
    project_record(c)
    c.save()
    copyfile(OUTPUT, PUBLIC)


if __name__ == "__main__":
    build()
