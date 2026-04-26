#!/usr/bin/env python3
"""
SUPERSEDED. The capability statement at
public/downloads/ktronics-capability-statement-2026.pdf is now Karl's
designed PDF (uploaded April 2026), not the ReportLab version this script
generates. Do NOT run this script unsupervised — it will overwrite the
real PDF with the placeholder version.

Kept around as a fallback in case we ever need to regenerate a programmatic
capability statement, but the canonical artefact is the uploaded PDF.

If you DO need to run it, the script aborts unless you set:
    REGENERATE_CAPABILITY_PDF=1 python3 scripts/build-capability-statement.py

Output (when run with override): public/downloads/ktronics-capability-statement-2026.pdf
"""
from __future__ import annotations
import os
import sys

if os.environ.get('REGENERATE_CAPABILITY_PDF') != '1':
    sys.exit(
        "Refusing to run: this would overwrite the canonical Capability "
        "Statement PDF. Set REGENERATE_CAPABILITY_PDF=1 to override."
    )

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ---------------------------------------------------------------------------
# Brand constants (mirror src/styles/global.css design tokens)
# ---------------------------------------------------------------------------
KTX_RED       = HexColor('#E51838')
KTX_CHARCOAL  = HexColor('#1B1D20')
KTX_INK       = HexColor('#1E1A1B')
KTX_INK_SOFT  = HexColor('#3A3537')
KTX_PAPER     = HexColor('#D7D3CB')
KTX_PAPER_2   = HexColor('#CDC8BE')
KTX_MUTE      = HexColor('#6A6660')
KTX_ON_DARK   = HexColor('#ECEDEF')
KTX_MUTE_DARK = HexColor('#9A9C9F')

PAGE_W, PAGE_H = A4
MARGIN_X = 22 * mm
MARGIN_Y = 22 * mm

PROJECT_ROOT  = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LOGO_PATH     = os.path.join(PROJECT_ROOT, 'public', 'images', 'ktronics-logo.png')
ASIAL_PATH    = os.path.join(PROJECT_ROOT, 'public', 'images', 'asial-gold-member.png')
OUTPUT_DIR    = os.path.join(PROJECT_ROOT, 'public', 'downloads')
OUTPUT_PATH   = os.path.join(OUTPUT_DIR, 'ktronics-capability-statement-2026.pdf')

# Use Helvetica for cross-platform fidelity. Embedding IBM Plex would inflate
# the PDF beyond reason for marginal aesthetic gain.
FONT_REGULAR = 'Helvetica'
FONT_BOLD    = 'Helvetica-Bold'
FONT_OBLIQUE = 'Helvetica-Oblique'


# ---------------------------------------------------------------------------
# Page-level helpers
# ---------------------------------------------------------------------------
def page_dark(c: canvas.Canvas):
    """Fill a charcoal background and draw the red 2px top rule."""
    c.setFillColor(KTX_CHARCOAL); c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(KTX_RED);      c.rect(0, PAGE_H - 4, PAGE_W, 4, stroke=0, fill=1)

def page_light(c: canvas.Canvas):
    """Fill a greige (paper) background and draw the red 2px top rule."""
    c.setFillColor(KTX_PAPER);    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(KTX_RED);      c.rect(0, PAGE_H - 4, PAGE_W, 4, stroke=0, fill=1)


def draw_running_header(c: canvas.Canvas, on_dark: bool, page_label: str | None = None):
    """Top-of-page running header: small Ktronics wordmark + page label."""
    text_col = KTX_ON_DARK if on_dark else KTX_INK
    mute_col = KTX_MUTE_DARK if on_dark else KTX_MUTE
    y = PAGE_H - 18 * mm
    c.setFillColor(text_col)
    c.setFont(FONT_BOLD, 9)
    c.drawString(MARGIN_X, y, 'KTRONICS')
    c.setFillColor(KTX_RED)
    c.setFont(FONT_BOLD, 9)
    c.drawString(MARGIN_X + 22 * mm, y, '/  CAPABILITY STATEMENT 2026')
    if page_label:
        c.setFillColor(mute_col)
        c.setFont(FONT_REGULAR, 8)
        c.drawRightString(PAGE_W - MARGIN_X, y, page_label.upper())


def draw_running_footer(c: canvas.Canvas, on_dark: bool, page_num: int, total: int):
    """Bottom-of-page footer: site URL + page number."""
    text_col = KTX_MUTE_DARK if on_dark else KTX_MUTE
    y = 14 * mm
    c.setFillColor(text_col)
    c.setFont(FONT_REGULAR, 8)
    c.drawString(MARGIN_X, y, 'ktronics.com.au   /   1300 621 060')
    c.drawRightString(PAGE_W - MARGIN_X, y, f'{page_num} / {total}')


def draw_section_heading(c, x, y, eyebrow, heading, on_dark=False, max_width=160 * mm):
    """Eyebrow + large heading combo. Returns the y after the heading."""
    eyebrow_col = KTX_RED
    heading_col = KTX_ON_DARK if on_dark else KTX_INK
    c.setFillColor(eyebrow_col)
    c.setFont(FONT_BOLD, 8)
    c.drawString(x, y, eyebrow.upper())
    y -= 8 * mm
    c.setFillColor(heading_col)
    c.setFont(FONT_BOLD, 22)
    # naive single-line render — section headings are short by design
    c.drawString(x, y, heading)
    return y - 6 * mm


def wrap_text(c, text: str, max_width: float, font_name: str, font_size: float):
    """Break a paragraph string into a list of lines that fit max_width."""
    c.setFont(font_name, font_size)
    words = text.split()
    lines, current = [], ''
    for word in words:
        candidate = (current + ' ' + word).strip()
        if c.stringWidth(candidate, font_name, font_size) <= max_width:
            current = candidate
        else:
            if current: lines.append(current)
            current = word
    if current: lines.append(current)
    return lines


def draw_paragraph(c, x, y, text, max_width, font=FONT_REGULAR, size=10.5, leading=15, color=None):
    """Draw a wrapped paragraph and return the y after it."""
    if color is None: color = KTX_INK_SOFT
    lines = wrap_text(c, text, max_width, font, size)
    c.setFillColor(color)
    c.setFont(font, size)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullet_list(c, x, y, items, max_width, font=FONT_REGULAR, size=10, leading=14, color=None, indent=4*mm):
    """Draw a bulleted list. Returns y after the list."""
    if color is None: color = KTX_INK_SOFT
    bullet_col = KTX_RED
    for item in items:
        c.setFillColor(bullet_col); c.setFont(FONT_BOLD, size)
        c.drawString(x, y, '/')
        lines = wrap_text(c, item, max_width - indent, font, size)
        c.setFillColor(color); c.setFont(font, size)
        for i, line in enumerate(lines):
            c.drawString(x + indent, y, line)
            if i < len(lines) - 1: y -= leading
        y -= leading + 2
    return y


# ---------------------------------------------------------------------------
# Page builders
# ---------------------------------------------------------------------------
def render_cover(c: canvas.Canvas):
    page_dark(c)
    # Centre the logo (white-tinted via PIL preprocessing would be ideal; for
    # now we draw on a small white card so the red+black logo reads cleanly)
    if os.path.exists(LOGO_PATH):
        card_w, card_h = 80 * mm, 28 * mm
        cx = (PAGE_W - card_w) / 2
        cy = PAGE_H - 100 * mm
        c.setFillColor(KTX_PAPER); c.rect(cx, cy, card_w, card_h, stroke=0, fill=1)
        # Logo aspect 1275x425 → 3:1
        logo_w = 60 * mm; logo_h = logo_w / 3
        c.drawImage(LOGO_PATH, cx + (card_w - logo_w)/2, cy + (card_h - logo_h)/2,
                    width=logo_w, height=logo_h, mask='auto', preserveAspectRatio=True)

    # Eyebrow
    c.setFillColor(KTX_RED); c.setFont(FONT_BOLD, 9)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 130 * mm, 'CAPABILITY STATEMENT  /  2026')

    # Big title (two lines)
    c.setFillColor(KTX_ON_DARK); c.setFont(FONT_BOLD, 32)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 155 * mm, 'Sydney commercial')
    c.drawCentredString(PAGE_W / 2, PAGE_H - 170 * mm, 'electronic security')

    c.setFillColor(KTX_RED); c.setFont(FONT_OBLIQUE, 28)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 188 * mm, 'since 2003.')

    # Subline
    c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_REGULAR, 11)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 210 * mm,
                        'Designed, installed, and maintained by the people you\u2019ll meet.')

    # Bottom strip — credentials
    strip_y = 38 * mm
    c.setFillColor(KTX_RED); c.rect(0, strip_y - 1, PAGE_W, 1, stroke=0, fill=1)
    c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_REGULAR, 8)
    c.drawString(MARGIN_X, strip_y - 8 * mm, 'NSW MASTER LICENCE  /  ASIAL GOLD MEMBER  /  ABN PENDING')
    c.setFillColor(KTX_ON_DARK); c.setFont(FONT_BOLD, 10)
    c.drawString(MARGIN_X, strip_y - 14 * mm, '102039  /  Australian Security Industry Association Ltd')

    # Contact strip — bottom
    c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_REGULAR, 8)
    c.drawRightString(PAGE_W - MARGIN_X, strip_y - 8 * mm, 'GET IN TOUCH')
    c.setFillColor(KTX_ON_DARK); c.setFont(FONT_BOLD, 10)
    c.drawRightString(PAGE_W - MARGIN_X, strip_y - 14 * mm, '1300 621 060  /  ktronics.com.au')


def render_who_we_are(c: canvas.Canvas):
    page_light(c)
    draw_running_header(c, on_dark=False, page_label='Who we are')
    y = PAGE_H - 38 * mm
    y = draw_section_heading(c, MARGIN_X, y, 'WHO WE ARE',
                             'Trade-led, not sales-led.', on_dark=False)
    y -= 4 * mm
    y = draw_paragraph(c, MARGIN_X, y,
        "Ktronics is a Sydney-based commercial electronic security specialist. Founded in 2003 by Karl Lamb, we design, install, and maintain integrated security systems for Australian businesses operating in critical infrastructure, pharmaceutical logistics, multi-site corporate networks, healthcare, education, and high-security commercial environments.",
        max_width=PAGE_W - 2 * MARGIN_X)
    y -= 4 * mm
    y = draw_paragraph(c, MARGIN_X, y,
        "We don\u2019t run a separate sales team. The technicians who quote a job design it, install it, commission it, and maintain it. Most of our team have been with Ktronics for years, not months. Most of our oldest clients have been with us since 2003.",
        max_width=PAGE_W - 2 * MARGIN_X)

    # Stats row
    y -= 14 * mm
    stats_x_step = (PAGE_W - 2 * MARGIN_X) / 4
    stats = [
        ('22+',        'YEARS PROTECTING\nSYDNEY BUSINESSES'),
        ('90+',        'YEARS COMBINED\nTECHNICAL EXPERIENCE'),
        ('20+',        'YEARS WITH OUR\nLONGEST CLIENTS'),
        ('24/7',       'MONITORING & EMERGENCY\nRESPONSE AVAILABLE'),
    ]
    for i, (val, label) in enumerate(stats):
        x = MARGIN_X + i * stats_x_step
        # Top rule (red on first, ink on rest)
        col = KTX_RED if i == 0 else KTX_INK
        c.setFillColor(col); c.rect(x, y + 4, 38 * mm, 1.2, stroke=0, fill=1)
        c.setFillColor(KTX_INK); c.setFont(FONT_BOLD, 28)
        c.drawString(x, y - 12, val)
        c.setFillColor(KTX_MUTE); c.setFont(FONT_REGULAR, 7.5)
        for j, line in enumerate(label.split('\n')):
            c.drawString(x, y - 22 - j * 9, line)

    # Credentials block
    y -= 56 * mm
    c.setFillColor(KTX_INK); c.setFont(FONT_BOLD, 11)
    c.drawString(MARGIN_X, y, 'Accreditations & licensing')
    y -= 6 * mm
    creds = [
        'NSW Master Licence: 102039',
        'ASIAL Gold Member, Australian Security Industry Association Limited',
        'Founded 2003 / Headquartered Brookvale, Sydney',
    ]
    for line in creds:
        c.setFillColor(KTX_RED); c.setFont(FONT_BOLD, 10); c.drawString(MARGIN_X, y, '/')
        c.setFillColor(KTX_INK_SOFT); c.setFont(FONT_REGULAR, 10); c.drawString(MARGIN_X + 5 * mm, y, line)
        y -= 6 * mm

    # ASIAL badge in lower-right
    if os.path.exists(ASIAL_PATH):
        bw, bh = 36 * mm, 28 * mm
        bx = PAGE_W - MARGIN_X - bw
        by = 38 * mm
        c.setFillColor(KTX_PAPER_2)
        c.rect(bx, by, bw, bh, stroke=0, fill=1)
        c.drawImage(ASIAL_PATH, bx + 4 * mm, by + 4 * mm,
                    width=bw - 8 * mm, height=bh - 8 * mm,
                    mask='auto', preserveAspectRatio=True)


def render_solutions(c: canvas.Canvas):
    page_light(c)
    draw_running_header(c, on_dark=False, page_label='Solutions')
    y = PAGE_H - 38 * mm
    y = draw_section_heading(c, MARGIN_X, y, 'WHAT WE DO',
                             'Four pillars of commercial security.', on_dark=False)
    y -= 6 * mm

    solutions = [
        ('01  /  Access Control',
         'Card, mobile, biometric, and cloud-managed access systems for single-door upgrades through to multi-site enterprise rollouts. Lenel OnGuard, Tecom Challenger with Forcefield, Inner Range Integriti.'),
        ('02  /  Video Surveillance / CCTV',
         'HD, 4K, thermal, and AI-enabled CCTV with evidence-grade footage, mobile alerts, and integrated analytics. Avigilon, Genetec, Axis, Hanwha. Configurable retention to match insurance and compliance requirements.'),
        ('03  /  Visitor Management',
         'Touchscreen reception kiosks, photo badges, host notifications, and emergency evacuation rolls. Integrated with access control for time-window day passes. Compliant with NQS, APP, and WHS visitor-register requirements.'),
        ('04  /  Maintenance & Monitoring',
         'Scheduled service plans, 24/7 alarm monitoring from our control room, verified human alarm response, remote diagnostics, and compliance reporting. Most of our oldest clients have been on a continuous service contract since the install.'),
    ]
    for title, body in solutions:
        c.setFillColor(KTX_INK); c.setFont(FONT_BOLD, 11)
        c.drawString(MARGIN_X, y, title)
        y -= 5 * mm
        y = draw_paragraph(c, MARGIN_X, y, body,
                           max_width=PAGE_W - 2 * MARGIN_X,
                           size=9.5, leading=13, color=KTX_INK_SOFT)
        y -= 6 * mm


def render_industries(c: canvas.Canvas):
    page_light(c)
    draw_running_header(c, on_dark=False, page_label='Industries')
    y = PAGE_H - 38 * mm
    y = draw_section_heading(c, MARGIN_X, y, 'WHO WE WORK WITH',
                             'Industry-specific systems.', on_dark=False)
    y -= 4 * mm
    y = draw_paragraph(c, MARGIN_X, y,
        "Every install is custom-designed to the regulations, risks, and real-world workflows of your sector. We service commercial sites Sydney-wide; major projects also extend to Victoria and Western Australia.",
        max_width=PAGE_W - 2 * MARGIN_X, size=10.5)
    y -= 8 * mm

    industries = [
        ('Warehouse & logistics',  'High-traffic access zones, perimeter CCTV, dock management, insurance-grade retention.'),
        ('Strata & multi-tenant',  'Multi-resident access, common-area surveillance, intercom, audit trails for owners corp.'),
        ('Childcare & schools',    'NQS-compliant entry control, visitor management, child-protection CCTV, lockdown response.'),
        ('Medical & allied health','Restricted-area zoning, after-hours access, APP-compliant CCTV, duress and panic.'),
        ('Corporate offices',      'Tenancy access, executive zones, HR-integrated credential provisioning, multi-site rollouts.'),
        ('Retail & hospitality',   'Storefront protection, POS-tied CCTV, OLGR-compliant retention, multi-venue rollouts.'),
    ]
    # 2-column grid
    col_w = (PAGE_W - 2 * MARGIN_X - 8 * mm) / 2
    row_h = 26 * mm
    for i, (title, body) in enumerate(industries):
        col = i % 2
        row = i // 2
        x = MARGIN_X + col * (col_w + 8 * mm)
        yy = y - row * row_h
        # Top rule
        c.setFillColor(KTX_INK); c.rect(x, yy + 4, col_w, 0.7, stroke=0, fill=1)
        c.setFillColor(KTX_INK); c.setFont(FONT_BOLD, 11)
        c.drawString(x, yy - 6, title)
        lines = wrap_text(c, body, col_w, FONT_REGULAR, 9)
        c.setFillColor(KTX_INK_SOFT); c.setFont(FONT_REGULAR, 9)
        for j, line in enumerate(lines):
            c.drawString(x, yy - 16 - j * 12, line)


def render_track_record(c: canvas.Canvas):
    page_dark(c)
    draw_running_header(c, on_dark=True, page_label='Track record')
    y = PAGE_H - 38 * mm
    y = draw_section_heading(c, MARGIN_X, y, 'TRACK RECORD',
                             'Two decades of compliance-grade work.', on_dark=True)
    y -= 4 * mm
    y = draw_paragraph(c, MARGIN_X, y,
        "Our clients are private by definition. Below: the kind of work, the scale, and the longevity. Names withheld as standard security industry practice.",
        max_width=PAGE_W - 2 * MARGIN_X, size=10.5, color=KTX_MUTE_DARK)
    y -= 10 * mm

    projects = [
        ('SINCE 2004',
         'Critical infrastructure',
         'Preferred contractor to a NSW high-voltage electricity infrastructure operator. Integrated alarm, CCTV, access control, intercom, and electric-fence systems across multiple substations and underground cable tunnels. Direct interface to operator SCADA network.'),
        ('SINCE 2003',
         'Pharmaceutical / life sciences',
         'National multi-site access control and alarm system for a multinational pharmaceutical group. Includes a large-scale 2012 migration from analogue to IP-based CCTV using Avigilon Control Centre, still in active service today.'),
        ('ONGOING',
         'High-security data centre',
         'Top-tier integrated security for a co-located data centre, designed to industry compliance and documentation standards. Lenel OnGuard access control + Axis CCTV + ongoing audit and maintenance.'),
        ('ONGOING',
         'Pharmaceutical distribution centre',
         'Full-site integrated platform across 40 access-controlled doors and 200+ cameras for a multinational pharmaceutical distributor\u2019s Western Sydney facility. Compliance-grade install with 24/7 monitoring from our control room.'),
        ('ONGOING',
         'Beverage manufacturing',
         'Genetec CCTV with integrated Tecom and Forcefield access control for a global beverage producer\u2019s Australian sites. Unified operator console across multiple sites.'),
    ]
    for since, sector, body in projects:
        # since + sector inline
        c.setFillColor(KTX_RED); c.setFont(FONT_BOLD, 8)
        c.drawString(MARGIN_X, y, since)
        c.setFillColor(KTX_ON_DARK); c.setFont(FONT_BOLD, 11)
        c.drawString(MARGIN_X + 28 * mm, y, sector)
        y -= 5 * mm
        y = draw_paragraph(c, MARGIN_X + 28 * mm, y, body,
                           max_width=PAGE_W - MARGIN_X - (MARGIN_X + 28 * mm),
                           size=9, leading=12, color=KTX_MUTE_DARK)
        y -= 5 * mm


def render_approach(c: canvas.Canvas):
    page_light(c)
    draw_running_header(c, on_dark=False, page_label='Approach')
    y = PAGE_H - 38 * mm
    y = draw_section_heading(c, MARGIN_X, y, 'WHAT WE STAND FOR',
                             'Four principles. Every job.', on_dark=False)
    y -= 6 * mm

    values = [
        ('01  /  Custom-engineered, every site.',
         'No catalogue packages. We walk your site, map your operations, and design to the way your people actually work.'),
        ('02  /  One team, whole lifecycle.',
         'Design, install, commission, monitor, maintain, upgrade. Same techs across all of it. No hand-offs to a stranger six months in.'),
        ('03  /  Best-in-class kit, not flashiest.',
         'We integrate Lenel, Genetec, Avigilon, Tecom, and Axis. We pick the platform that fits the job, not the one on the rep\u2019s commission ladder.'),
        ('04  /  Decades, not deals.',
         'Our oldest clients have been with us since 2003. We\u2019d rather have you for twenty years than win a one-off install.'),
    ]
    for title, body in values:
        c.setFillColor(KTX_INK); c.setFont(FONT_BOLD, 11)
        c.drawString(MARGIN_X, y, title)
        y -= 5 * mm
        y = draw_paragraph(c, MARGIN_X, y, body,
                           max_width=PAGE_W - 2 * MARGIN_X,
                           size=9.5, leading=13, color=KTX_INK_SOFT)
        y -= 6 * mm


def render_contact(c: canvas.Canvas):
    page_dark(c)
    draw_running_header(c, on_dark=True, page_label='Contact')
    y = PAGE_H - 38 * mm
    y = draw_section_heading(c, MARGIN_X, y, 'NEXT STEP',
                             'Walk the site with us.', on_dark=True)
    y -= 4 * mm
    y = draw_paragraph(c, MARGIN_X, y,
        "If you\u2019re scoping a commercial security project in the next 24 months, the fastest way to a useful conversation is a 30-minute site walk. We don\u2019t quote from photos.",
        max_width=PAGE_W - 2 * MARGIN_X, size=11, color=KTX_MUTE_DARK)
    y -= 10 * mm

    # Three contact channels
    channels = [
        ('NEW ENQUIRIES',                              '1300 621 060',  'sales@ktronics.com.au'),
        ('SERVICE REQUESTS  /  EXISTING CLIENTS',     '1300 621 060',  'service@ktronics.com.au'),
        ('EMERGENCY CONTROL ROOM  /  24/7',            '1300 621 006',  'Monitored clients only'),
    ]
    for label, phone, email in channels:
        # Label
        c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_BOLD, 8); c.drawString(MARGIN_X, y, label)
        # Phone
        c.setFillColor(KTX_ON_DARK); c.setFont(FONT_BOLD, 14); c.drawString(MARGIN_X, y - 7 * mm, phone)
        # Email / note
        c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_REGULAR, 10); c.drawString(MARGIN_X, y - 13 * mm, email)
        y -= 22 * mm

    # Address block
    y -= 4 * mm
    c.setFillColor(KTX_RED); c.rect(MARGIN_X, y, PAGE_W - 2 * MARGIN_X, 1, stroke=0, fill=1)
    y -= 8 * mm
    c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_BOLD, 8); c.drawString(MARGIN_X, y, 'OFFICE')
    c.setFillColor(KTX_ON_DARK); c.setFont(FONT_REGULAR, 10)
    c.drawString(MARGIN_X, y - 6 * mm, 'Ktronics Pty Ltd')
    c.drawString(MARGIN_X, y - 11 * mm, 'Unit 11, 84 Old Pittwater Road, Brookvale NSW 2100')
    c.drawString(MARGIN_X, y - 16 * mm, 'Office hours: Mon-Fri 8am - 3:00pm')

    # Web + license callout (right column)
    rx = MARGIN_X + 105 * mm
    c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_BOLD, 8); c.drawString(rx, y, 'WEB')
    c.setFillColor(KTX_ON_DARK); c.setFont(FONT_REGULAR, 10)
    c.drawString(rx, y - 6 * mm, 'ktronics.com.au')
    c.setFillColor(KTX_MUTE_DARK); c.setFont(FONT_BOLD, 8); c.drawString(rx, y - 14 * mm, 'NSW MASTER LICENCE')
    c.setFillColor(KTX_ON_DARK); c.setFont(FONT_REGULAR, 10)
    c.drawString(rx, y - 20 * mm, '102039')


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------
def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    c = canvas.Canvas(OUTPUT_PATH, pagesize=A4)
    c.setTitle('Ktronics Capability Statement 2026')
    c.setAuthor('Ktronics Pty Ltd')
    c.setSubject('Sydney commercial electronic security')
    c.setKeywords('commercial security, CCTV, access control, Sydney, ASIAL, NSW Master Licence 102039')

    pages = [
        ('cover',         render_cover,         True),
        ('who_we_are',    render_who_we_are,    False),
        ('solutions',     render_solutions,     False),
        ('industries',    render_industries,    False),
        ('track_record',  render_track_record,  True),
        ('approach',      render_approach,      False),
        ('contact',       render_contact,       True),
    ]
    total = len(pages)

    for i, (_name, fn, on_dark) in enumerate(pages, start=1):
        fn(c)
        # Cover page has its own contact strip — skip the running footer
        if i > 1:
            draw_running_footer(c, on_dark, i, total)
        c.showPage()

    c.save()
    print(f'Saved: {OUTPUT_PATH}')
    print(f'Size:  {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB')

if __name__ == '__main__':
    main()
