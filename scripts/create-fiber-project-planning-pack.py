from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "fibertools-project-planning-pack.pdf"
PAGE_W, PAGE_H = letter

BARK = HexColor("#3F342E")
PLUM = HexColor("#7C5A6D")
AMBER = HexColor("#C68A45")
CREAM = HexColor("#FAF6F1")
SAGE = HexColor("#6F8370")
LINE = HexColor("#D8CEC4")
MUTED = HexColor("#6F655F")
FIELD_BG = HexColor("#FFFDFC")


def text(c, value, x, y, size=10, color=BARK, font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, value)


def centered(c, value, x, y, size=10, color=BARK, font="Helvetica"):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawCentredString(x, y, value)


def paragraph(c, value, x, y, width, size=9, leading=13, color=MUTED, font="Helvetica"):
    words = value.split()
    lines = []
    current = ""
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
        text(c, line, x, y - index * leading, size=size, color=color, font=font)
    return y - len(lines) * leading


def footer(c, page_number, title):
    c.setStrokeColor(LINE)
    c.line(44, 34, PAGE_W - 44, 34)
    text(c, "FiberTools Project Planning Pack", 44, 20, 7.5, MUTED)
    centered(c, str(page_number), PAGE_W / 2, 20, 7.5, MUTED)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.5)
    c.drawRightString(PAGE_W - 44, 20, title)


def page_header(c, page_number, title, subtitle):
    c.setFillColor(CREAM)
    c.rect(0, PAGE_H - 112, PAGE_W, 112, stroke=0, fill=1)
    text(c, "FIBERTOOLS", 44, PAGE_H - 42, 8, PLUM, "Helvetica-Bold")
    text(c, title, 44, PAGE_H - 73, 24, BARK, "Helvetica-Bold")
    text(c, subtitle, 44, PAGE_H - 94, 9, MUTED)
    footer(c, page_number, title)


def field(c, name, label, x, y, width, height=22, multiline=False, font_size=9):
    text(c, label.upper(), x, y + height + 5, 7.3, MUTED, "Helvetica-Bold")
    flags = "multiline" if multiline else ""
    c.acroForm.textfield(
        name=name,
        x=x,
        y=y,
        width=width,
        height=height,
        borderWidth=1,
        borderColor=LINE,
        fillColor=FIELD_BG,
        textColor=BARK,
        forceBorder=True,
        fontName="Helvetica",
        fontSize=font_size,
        fieldFlags=flags,
    )


def checkbox(c, name, label, x, y, size=13):
    c.acroForm.checkbox(
        name=name,
        x=x,
        y=y,
        size=size,
        buttonStyle="check",
        borderWidth=1,
        borderColor=LINE,
        fillColor=FIELD_BG,
        textColor=PLUM,
        forceBorder=True,
    )
    text(c, label, x + size + 7, y + 2, 9, BARK)


def table(c, x, top, widths, headers, rows, row_height, prefix, field_font=7.5):
    total = sum(widths)
    c.setFillColor(PLUM)
    c.roundRect(x, top - row_height, total, row_height, 4, stroke=0, fill=1)
    cursor = x
    for index, header in enumerate(headers):
        text(c, header.upper(), cursor + 4, top - row_height + 7, 6.5, white, "Helvetica-Bold")
        cursor += widths[index]
    y = top - row_height
    for row in range(rows):
        y -= row_height
        cursor = x
        for col, width in enumerate(widths):
            c.acroForm.textfield(
                name=f"{prefix}_{row + 1}_{col + 1}",
                x=cursor,
                y=y,
                width=width,
                height=row_height,
                borderWidth=0.7,
                borderColor=LINE,
                fillColor=FIELD_BG if row % 2 == 0 else CREAM,
                textColor=BARK,
                forceBorder=True,
                fontName="Helvetica",
                fontSize=field_font,
            )
            cursor += width
    return y


def cover(c):
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(PLUM)
    c.circle(PAGE_W - 82, PAGE_H - 88, 31, stroke=0, fill=1)
    c.setStrokeColor(white)
    c.setLineWidth(2)
    c.circle(PAGE_W - 82, PAGE_H - 88, 18, stroke=1, fill=0)
    c.line(PAGE_W - 99, PAGE_H - 91, PAGE_W - 67, PAGE_H - 80)
    text(c, "FIBERTOOLS", 48, PAGE_H - 64, 10, PLUM, "Helvetica-Bold")
    text(c, "Project", 48, PAGE_H - 150, 42, BARK, "Helvetica-Bold")
    text(c, "Planning Pack", 48, PAGE_H - 198, 42, BARK, "Helvetica-Bold")
    paragraph(
        c,
        "A fillable and printable workspace for knitting, crochet, weaving, spinning, cross stitch, and other fiber projects.",
        48,
        PAGE_H - 238,
        420,
        size=12,
        leading=18,
        color=MUTED,
    )
    c.setFillColor(white)
    c.roundRect(48, 238, PAGE_W - 96, 210, 14, stroke=0, fill=1)
    text(c, "WHAT IS INSIDE", 70, 418, 8, AMBER, "Helvetica-Bold")
    items = [
        "Project brief and fit planning",
        "Swatch and gauge record",
        "Yarn, dye lot, and materials inventory",
        "Budget and milestone trackers",
        "Pattern modifications and troubleshooting log",
        "Finishing checklist and project reflection",
    ]
    for index, item in enumerate(items):
        y = 386 - index * 27
        c.setFillColor(SAGE)
        c.circle(74, y + 2, 4, stroke=0, fill=1)
        text(c, item, 88, y - 2, 10, BARK)
    text(c, "Use digitally or print as often as you need for your own projects.", 48, 118, 9, MUTED)
    text(c, "Original planning templates by FiberTools", 48, 94, 9, PLUM, "Helvetica-Bold")
    text(c, "fibertools.app", 48, 72, 9, MUTED)
    footer(c, 1, "Cover")
    c.showPage()


def instructions(c):
    page_header(c, 2, "Start here", "One pack, one project - duplicate the file or print a fresh copy for each project.")
    y = 638
    steps = [
        ("1", "Define the finish line", "Write the project, recipient, target size, deadline, and what success looks like before buying materials."),
        ("2", "Make and treat a swatch", "Use the same yarn, stitch pattern, tool, washing, blocking, and finishing method planned for the final piece."),
        ("3", "Record evidence", "Keep the yarn label, dye lot, gauge, measurements, changes, and actual costs together so the project can be repeated."),
        ("4", "Recheck before irreversible steps", "Confirm fit and counts before cutting yarn, seaming, steeking, trimming fabric, or beginning final finishing."),
    ]
    for number, title, body in steps:
        c.setFillColor(PLUM)
        c.circle(68, y + 3, 17, stroke=0, fill=1)
        centered(c, number, 68, y - 2, 11, white, "Helvetica-Bold")
        text(c, title, 98, y + 6, 12, BARK, "Helvetica-Bold")
        paragraph(c, body, 98, y - 12, 430, size=9, leading=13, color=MUTED)
        y -= 92
    c.setFillColor(CREAM)
    c.roundRect(48, 120, PAGE_W - 96, 115, 12, stroke=0, fill=1)
    text(c, "PLANNING NOTE", 68, 208, 8, AMBER, "Helvetica-Bold")
    paragraph(c, "Calculator results are planning estimates. Yarn construction, fiber, stitch pattern, tension, blocking, and finishing can change the final result. Your treated swatch is the strongest project-specific evidence.", 68, 184, 430, size=10, leading=15, color=BARK)
    c.showPage()


def project_brief(c):
    page_header(c, 3, "Project brief", "Define the project and the result you want before materials or momentum lock in the plan.")
    field(c, "brief_project", "Project name", 48, 615, 330)
    field(c, "brief_project_id", "Project ID or binder tab", 396, 615, 168)
    field(c, "brief_recipient", "Recipient", 48, 556, 240)
    field(c, "brief_craft", "Craft or technique", 306, 556, 258)
    field(c, "brief_pattern", "Pattern or design source", 48, 497, 516)
    field(c, "brief_start", "Planned start", 48, 438, 160)
    field(c, "brief_due", "Target finish", 226, 438, 160)
    field(c, "brief_priority", "Priority", 404, 438, 160)
    field(c, "brief_success", "What will make this project successful?", 48, 330, 516, 66, True)
    field(c, "brief_risks", "Known risks, unknowns, or skills to practice", 48, 222, 516, 66, True)
    field(c, "brief_notes", "First decisions and notes", 48, 86, 516, 94, True)
    c.showPage()


def measurements(c):
    page_header(c, 4, "Measurements and fit", "Record the body, object, room, loom, frame, or finished dimensions that control the project.")
    table(c, 48, 635, [170, 105, 105, 136], ["Measurement", "Measured", "Ease or allowance", "Target finished"], 8, 32, "measure")
    field(c, "measure_units", "Units used throughout this project", 48, 302, 180)
    field(c, "measure_method", "How and when measurements were taken", 246, 302, 318)
    field(c, "measure_final_width", "Target finished width", 48, 243, 160)
    field(c, "measure_final_length", "Target finished length", 226, 243, 160)
    field(c, "measure_other", "Other controlling dimension", 404, 243, 160)
    field(c, "measure_fit_notes", "Fit, drape, ease, border, seam, or finishing notes", 48, 88, 516, 112, True)
    c.showPage()


def swatch(c):
    page_header(c, 5, "Swatch and gauge record", "Treat the swatch the same way you plan to treat the project, then record both before and after.")
    field(c, "swatch_yarn", "Yarn, fiber, or thread", 48, 615, 330)
    field(c, "swatch_color", "Color and dye lot", 396, 615, 168)
    field(c, "swatch_tool", "Hook, needle, loom, sett, or tool", 48, 556, 250)
    field(c, "swatch_stitch", "Stitch pattern or structure", 316, 556, 248)
    field(c, "swatch_width_before", "Width before treatment", 48, 485, 160)
    field(c, "swatch_height_before", "Height before treatment", 226, 485, 160)
    field(c, "swatch_weight", "Swatch weight", 404, 485, 160)
    field(c, "swatch_stitches_before", "Stitches or ends counted", 48, 426, 160)
    field(c, "swatch_rows_before", "Rows or picks counted", 226, 426, 160)
    field(c, "swatch_count_span", "Measured span", 404, 426, 160)
    text(c, "AFTER WASHING, BLOCKING, OR OTHER PLANNED TREATMENT", 48, 377, 8, AMBER, "Helvetica-Bold")
    field(c, "swatch_width_after", "Width after treatment", 48, 330, 160)
    field(c, "swatch_height_after", "Height after treatment", 226, 330, 160)
    field(c, "swatch_change", "Percent or observed change", 404, 330, 160)
    field(c, "swatch_stitch_gauge", "Final stitch gauge", 48, 271, 160)
    field(c, "swatch_row_gauge", "Final row gauge", 226, 271, 160)
    field(c, "swatch_repeat", "Pattern repeat or multiple", 404, 271, 160)
    field(c, "swatch_notes", "Fabric, drape, hand, color, recovery, and decision notes", 48, 88, 516, 140, True)
    c.showPage()


def yarn_inventory(c):
    page_header(c, 6, "Yarn and dye lot inventory", "Record exact labels and lots. Keep one label with the finished project notes.")
    table(c, 38, 635, [110, 90, 78, 50, 55, 65, 86], ["Brand / line", "Color", "Dye lot", "Weight", "Qty", "Yards each", "Purchased from"], 10, 37, "yarn", 6.7)
    field(c, "yarn_total_yards", "Total yards or meters on hand", 48, 145, 230)
    field(c, "yarn_buffer", "Planning buffer", 296, 145, 120)
    field(c, "yarn_more_needed", "More needed", 434, 145, 130)
    field(c, "yarn_notes", "Substitution, lot matching, reserve, and label notes", 48, 68, 516, 42, True)
    c.showPage()


def budget(c):
    page_header(c, 7, "Materials and budget", "Plan the full cost, including notions, finishing, shipping, and replacement risk.")
    table(c, 48, 635, [210, 95, 95, 116], ["Item", "Planned cost", "Actual cost", "Source or note"], 9, 38, "budget", 7.3)
    field(c, "budget_subtotal", "Actual subtotal", 48, 203, 155)
    field(c, "budget_shipping", "Shipping and tax", 221, 203, 155)
    field(c, "budget_total", "Actual total", 394, 203, 170)
    field(c, "budget_limit", "Budget limit", 48, 144, 155)
    field(c, "budget_variance", "Over or under", 221, 144, 155)
    field(c, "budget_currency", "Currency", 394, 144, 170)
    field(c, "budget_notes", "Returns, leftovers, replacements, and cost lessons", 48, 68, 516, 34, True)
    c.showPage()


def milestones(c):
    page_header(c, 8, "Milestones and schedule", "Break the project into visible steps and leave room for swatching, drying, and finishing.")
    table(c, 48, 635, [205, 95, 95, 121], ["Milestone or task", "Target date", "Actual date", "Status or note"], 10, 38, "milestone", 7.3)
    field(c, "milestone_weekly_time", "Time available each week", 48, 165, 200)
    field(c, "milestone_next_action", "Next physical action", 266, 165, 298)
    field(c, "milestone_notes", "Schedule risks, dependencies, and recovery plan", 48, 68, 516, 54, True)
    c.showPage()


def pattern_notes(c):
    page_header(c, 9, "Pattern and stitch notes", "Keep repeat logic, conventions, and counting decisions with the project.")
    field(c, "pattern_source", "Pattern source, edition, or file name", 48, 615, 330)
    field(c, "pattern_size", "Size or version", 396, 615, 168)
    field(c, "pattern_repeat", "Repeat or construction multiple", 48, 556, 250)
    field(c, "pattern_edge", "Edge, seam, or turning stitches", 316, 556, 248)
    field(c, "pattern_key", "Abbreviations, symbols, or personal notation", 48, 475, 516, 38, True)
    field(c, "pattern_notes", "Working notes", 48, 88, 516, 344, True, 9)
    c.showPage()


def troubleshooting(c):
    page_header(c, 10, "Modification and troubleshooting log", "Record what changed, why it changed, and whether the result worked.")
    table(c, 38, 635, [58, 160, 180, 136], ["Date", "Issue or change", "Decision and reason", "Result"], 7, 60, "change", 7.2)
    field(c, "change_reusable", "What should be reused on the next project?", 48, 60, 516, 50, True)
    c.showPage()


def finishing(c):
    page_header(c, 11, "Finishing checklist", "Complete the construction, care, documentation, and handoff steps that make the work last.")
    checks = [
        "Ends secured or woven in",
        "Seams, joins, and edges checked",
        "Final wash or treatment completed",
        "Blocked or shaped to final dimensions",
        "Buttons, zipper, lining, or notions secured",
        "Final measurements recorded",
        "Care instructions saved or included",
        "Yarn label and dye lot archived",
        "Pattern changes transferred to clean notes",
        "Photos taken with permission",
        "Remaining materials labeled and stored",
        "Gift, delivery, or storage plan complete",
    ]
    for index, label in enumerate(checks):
        col = 0 if index < 6 else 1
        row = index if index < 6 else index - 6
        checkbox(c, f"finish_{index + 1}", label, 52 + col * 260, 600 - row * 45)
    field(c, "finish_final_width", "Final width", 48, 274, 155)
    field(c, "finish_final_length", "Final length", 221, 274, 155)
    field(c, "finish_final_weight", "Final weight", 394, 274, 170)
    field(c, "finish_care", "Final care instructions", 48, 188, 516, 44, True)
    field(c, "finish_notes", "Finishing notes", 48, 78, 516, 66, True)
    c.showPage()


def reflection(c):
    page_header(c, 12, "Project reflection", "Capture the lessons while the project is still fresh.")
    field(c, "reflect_proud", "What are you most proud of?", 48, 545, 516, 82, True)
    field(c, "reflect_change", "What would you change next time?", 48, 420, 516, 82, True)
    field(c, "reflect_learned", "What did you learn about the craft, materials, or process?", 48, 295, 516, 82, True)
    field(c, "reflect_repeat", "Would you make this again, and what would you keep?", 48, 170, 516, 82, True)
    field(c, "reflect_completed", "Completed date", 48, 82, 160)
    field(c, "reflect_rating", "Personal rating", 226, 82, 160)
    field(c, "reflect_next", "Next related project", 404, 82, 160)
    c.showPage()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=letter, pageCompression=1)
    c.setTitle("FiberTools Project Planning Pack")
    c.setAuthor("Jason Ramirez - FiberTools")
    c.setSubject("Fillable and printable project planner for fiber arts")
    c.setCreator("FiberTools")
    cover(c)
    instructions(c)
    project_brief(c)
    measurements(c)
    swatch(c)
    yarn_inventory(c)
    budget(c)
    milestones(c)
    pattern_notes(c)
    troubleshooting(c)
    finishing(c)
    reflection(c)
    c.save()
    print(OUTPUT)


if __name__ == "__main__":
    build()
