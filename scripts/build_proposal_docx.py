import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets internal padding for a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
        node = OxmlElement(m)
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_table_borders(table, color="CBD5E1"):
    """Sets subtle borders for the entire table."""
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
        f'  <w:insideV w:val="none"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def build_proposal_document():
    doc = Document()

    # 1. Page Setup: Standard Letter, 1-inch margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles Setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(51, 65, 85) # #334155

    # -------------------------------------------------------------
    # COVER PAGE
    # -------------------------------------------------------------
    # Dual Logo Header Table
    header_table = doc.add_table(rows=1, cols=2)
    header_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_table.autofit = False

    header_table.columns[0].width = Inches(3.25)
    header_table.columns[1].width = Inches(3.25)

    cell_left = header_table.cell(0, 0)
    cell_right = header_table.cell(0, 1)

    p_left = cell_left.paragraphs[0]
    p_left.alignment = WD_ALIGN_PARAGRAPH.LEFT
    if os.path.exists('assets/proposal/cybrcraft_logo.png'):
        r_left = p_left.add_run()
        r_left.add_picture('assets/proposal/cybrcraft_logo.png', width=Inches(2.2))

    p_right = cell_right.paragraphs[0]
    p_right.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    if os.path.exists('assets/proposal/amardesh_logo.jpg'):
        r_right = p_right.add_run()
        r_right.add_picture('assets/proposal/amardesh_logo.jpg', width=Inches(2.4))

    # Add spacing
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(36)

    # Accent decorative bar
    bar_table = doc.add_table(rows=1, cols=1)
    bar_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    bar_cell = bar_table.cell(0, 0)
    bar_cell.width = Inches(6.5)
    set_cell_background(bar_cell, 'DC2626') # Amar Desh Crimson
    set_cell_margins(bar_cell, top=20, bottom=20, left=0, right=0)
    p_bar = bar_cell.paragraphs[0]
    p_bar.paragraph_format.space_before = Pt(0)
    p_bar.paragraph_format.space_after = Pt(0)

    # Document Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(30)
    p_title.paragraph_format.space_after = Pt(8)
    run_title = p_title.add_run("PROJECT PROPOSAL:\nOFFICIAL MOBILE APP ECOSYSTEM")
    run_title.font.name = 'Calibri'
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(15, 23, 42)

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(28)
    run_sub = p_sub.add_run("Live Interactive Demo, One-Stop Automated Backend Integration & Official Store Launch for Daily Amar Desh (দৈনিক আমার দেশ)")
    run_sub.font.name = 'Calibri'
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(100, 116, 139)

    # Two-Phase Strategy Badge Box
    badge_table = doc.add_table(rows=1, cols=1)
    badge_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    badge_cell = badge_table.cell(0, 0)
    badge_cell.width = Inches(6.5)
    set_cell_background(badge_cell, 'FEF2F2')
    set_cell_margins(badge_cell, top=140, bottom=140, left=200, right=200)
    p_badge = badge_cell.paragraphs[0]
    p_badge.paragraph_format.space_before = Pt(0)
    p_badge.paragraph_format.space_after = Pt(0)
    r_badge_icon = p_badge.add_run("★ TWO-PHASE DELIVERY MODEL: ")
    r_badge_icon.font.bold = True
    r_badge_icon.font.size = Pt(10)
    r_badge_icon.font.color.rgb = RGBColor(185, 28, 28)
    r_badge_text = p_badge.add_run(
        "1) Phase 1 (Live Demo PoC): Fully functional Android APK available today for board review. "
        "2) Phase 2 (Production): Direct secure official backend/CMS integration with zero extra manual newsroom effort & stack modernization support."
    )
    r_badge_text.font.size = Pt(9.5)
    r_badge_text.font.color.rgb = RGBColor(127, 29, 29)

    # Metadata Block
    p_meta_space = doc.add_paragraph()
    p_meta_space.paragraph_format.space_before = Pt(35)

    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    meta_table.columns[0].width = Inches(2.2)
    meta_table.columns[1].width = Inches(4.3)

    meta_rows = [
        ("PREPARED FOR:", "Mr. Mahmudur Rahman (Editor & Publisher / সম্পাদক ও প্রকাশক)\nAmar Desh Publication Limited (আমার দেশ পাবলিকেশন লিমিটেড)\nDhaka Trade Centre (8th Floor), Karwan Bazar, Dhaka-1215"),
        ("PREPARED BY:", "CybrCraft (https://cybrcraft.com/)\nBashundhara Riverview, Dhaka, Bangladesh\nEmail: info@cybrcraft.com | WhatsApp: +880 1967-600402"),
        ("PROPOSAL REF:", "CC-PRP-2026-AMARDESH-01"),
        ("SUBMISSION DATE:", "October 2026 | Version 1.1.0 (Pitch Ready)")
    ]

    for idx, (label, val) in enumerate(meta_rows):
        c_lbl = meta_table.cell(idx, 0)
        c_val = meta_table.cell(idx, 1)
        set_cell_margins(c_lbl, top=70, bottom=70, left=50, right=50)
        set_cell_margins(c_val, top=70, bottom=70, left=50, right=50)

        p_lbl = c_lbl.paragraphs[0]
        p_lbl.paragraph_format.space_before = Pt(0)
        p_lbl.paragraph_format.space_after = Pt(0)
        r_l = p_lbl.add_run(label)
        r_l.font.bold = True
        r_l.font.size = Pt(9.5)
        r_l.font.color.rgb = RGBColor(71, 85, 105)

        p_val = c_val.paragraphs[0]
        p_val.paragraph_format.space_before = Pt(0)
        p_val.paragraph_format.space_after = Pt(0)
        r_v = p_val.add_run(val)
        r_v.font.size = Pt(9.5)
        r_v.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 1: EXECUTIVE SUMMARY
    # -------------------------------------------------------------
    h1 = doc.add_heading(level=1)
    r_h1 = h1.add_run("1. Executive Summary & Delivery Strategy")
    r_h1.font.name = 'Calibri'
    r_h1.font.size = Pt(18)
    r_h1.font.bold = True
    r_h1.font.color.rgb = RGBColor(15, 23, 42)

    p = doc.add_paragraph(
        "Daily Amar Desh (দৈনিক আমার দেশ), founded under the motto 'স্বাধীনতার কথা বলে' (Speaks of Independence) "
        "and guided by the uncompromising leadership of Editor and Publisher Mahmudur Rahman, is one of Bangladesh’s "
        "most courageous and widely followed national dailies. Following the historic July 2024 uprising and the paper’s "
        "triumphant return, reader loyalty has reached an all-time peak across Bangladesh and the international diaspora."
    )
    p.paragraph_format.space_after = Pt(8)

    p2 = doc.add_paragraph(
        "While Amar Desh has established an active web portal (dailyamardesh.com) and an e-paper portal (eamardesh.com), "
        "the publication currently has NO official native mobile application on the Google Play Store or Apple App Store. "
        "In a media market where over 92% of readers consume news exclusively on smartphones, this creates critical gaps "
        "in breaking news delivery, reader retention, and brand protection."
    )
    p2.paragraph_format.space_after = Pt(12)

    # KPI Grid
    kpi_table = doc.add_table(rows=2, cols=3)
    kpi_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    kpi_table.autofit = False
    set_table_borders(kpi_table, color="E2E8F0")

    kpi_data = [
        [("92%+", "Mobile Readership", "Primary consumption mode in BD"),
         ("< 1.2s", "Cold Launch Speed", "Instant news delivery without lag"),
         ("7 Days", "Offline SQLite Cache", "Full-text reading with zero internet")],
        [("0 Manual", "Newsroom Work", "100% automated CMS sync"),
         ("2-3 Wks", "Rapid Turnaround", "Working prototype ready today"),
         ("100%", "Source Ownership", "Full IP handover to Amar Desh")]
    ]

    for r_idx, row in enumerate(kpi_data):
        for c_idx, (big_num, title, desc) in enumerate(row):
            cell = kpi_table.cell(r_idx, c_idx)
            cell.width = Inches(2.15)
            set_cell_background(cell, "F8FAFC")
            set_cell_margins(cell, top=120, bottom=120, left=100, right=100)
            p_kpi = cell.paragraphs[0]
            p_kpi.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_kpi.paragraph_format.space_before = Pt(0)
            p_kpi.paragraph_format.space_after = Pt(2)

            r_num = p_kpi.add_run(big_num + "\n")
            r_num.font.bold = True
            r_num.font.size = Pt(18)
            r_num.font.color.rgb = RGBColor(220, 38, 38)

            r_title = p_kpi.add_run(title + "\n")
            r_title.font.bold = True
            r_title.font.size = Pt(9.5)
            r_title.font.color.rgb = RGBColor(15, 23, 42)

            r_desc = p_kpi.add_run(desc)
            r_desc.font.size = Pt(8)
            r_desc.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Callout Box: Two-Phase & One-Stop Automated Solution
    callout = doc.add_table(rows=1, cols=1)
    callout.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_cell = callout.cell(0, 0)
    c_cell.width = Inches(6.5)
    set_cell_background(c_cell, "EEF2FF")
    set_cell_margins(c_cell, top=140, bottom=140, left=180, right=180)
    p_call = c_cell.paragraphs[0]
    p_call.paragraph_format.space_before = Pt(0)
    p_call.paragraph_format.space_after = Pt(0)
    r_cp1 = p_call.add_run("ONE-STOP SOLUTION (ZERO MANUAL NEWSROOM OVERHEAD): ")
    r_cp1.font.bold = True
    r_cp1.font.color.rgb = RGBColor(67, 56, 202)
    r_cp2 = p_call.add_run(
        "Our current app is a live interactive Demo/PoC enabling immediate testing. Upon project confirmation, "
        "the production app will not rely on scraping; it will connect directly to Daily Amar Desh's official backend/CMS via secure APIs. "
        "Amar Desh journalists and editors will not perform any extra manual work—publishing in the web CMS will automatically, "
        "securely, and instantaneously sync to the mobile app. CybrCraft will handle any server-side API or stack modernization required."
    )
    r_cp2.font.color.rgb = RGBColor(30, 27, 75)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 2: DIGITAL BENCHMARK & BUSINESS OPPORTUNITY
    # -------------------------------------------------------------
    h2 = doc.add_heading(level=1)
    r_h2 = h2.add_run("2. The Business Opportunity & Market Benchmark")
    r_h2.font.name = 'Calibri'
    r_h2.font.size = Pt(18)
    r_h2.font.bold = True
    r_h2.font.color.rgb = RGBColor(15, 23, 42)

    p_gap = doc.add_paragraph(
        "Relying solely on a mobile web browser creates multiple points of friction that degrade reader engagement. "
        "The chart below illustrates the quantified performance advantages of deploying an official native mobile app:"
    )
    p_gap.paragraph_format.space_after = Pt(10)

    # Embed Chart 1: Comparison
    if os.path.exists('assets/proposal/engagement_comparison.png'):
        p_img1 = doc.add_paragraph()
        p_img1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_img1 = p_img1.add_run()
        r_img1.add_picture('assets/proposal/engagement_comparison.png', width=Inches(6.2))
        p_cap1 = doc.add_paragraph()
        p_cap1.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap1.paragraph_format.space_before = Pt(2)
        p_cap1.paragraph_format.space_after = Pt(14)
        r_cap1 = p_cap1.add_run("Figure 1: Digital Performance Benchmark — Mobile Web Browser vs. Official Mobile App")
        r_cap1.font.size = Pt(8.5)
        r_cap1.font.italic = True
        r_cap1.font.color.rgb = RGBColor(100, 116, 139)

    # Comparison Table
    comp_table = doc.add_table(rows=6, cols=3)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    comp_table.autofit = False
    set_table_borders(comp_table, color="CBD5E1")

    headers = ["Strategic Metric", "Current Mobile Web Portal", "CybrCraft Native Mobile App"]
    for i, h in enumerate(headers):
        c = comp_table.cell(0, i)
        set_cell_background(c, "1E293B")
        set_cell_margins(c, top=100, bottom=100, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    comp_rows = [
        ("Push Notifications", "None. Readers discover breaking news via social media algorithms.", "Real-time FCM push alerts reach 1,000,000+ devices in seconds."),
        ("Offline Accessibility", "Zero. Without 4G/WiFi, web browser displays 'No Internet'.", "SQLite relational database stores up to 500 articles for 7-day offline reading."),
        ("ePaper Experience", "Clunky PDF browser zooming with high memory overhead.", "Native page-flip viewer (১ম-৮ম পাতা) with smooth hardware-accelerated pinch-zoom."),
        ("Commuter Audio News", "Manual reading required on small mobile screens.", "Natural Bengali Text-to-Speech (TTS) with play, pause, and speed multiplier."),
        ("Brand Protection", "Unofficial aggregators on Google Play exploit the trademark.", "Official verified publisher profile certified under Amar Desh Publication Ltd.")
    ]

    for idx, (m, w, a) in enumerate(comp_rows):
        row_idx = idx + 1
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate([m, w, a]):
            c = comp_table.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)
            elif col_idx == 2:
                r.font.color.rgb = RGBColor(22, 101, 52)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 3: SYSTEM ARCHITECTURE & SECURE BACKEND INTEGRATION
    # -------------------------------------------------------------
    h3 = doc.add_heading(level=1)
    r_h3 = h3.add_run("3. System Architecture & Secure Official Backend Integration")
    r_h3.font.name = 'Calibri'
    r_h3.font.size = Pt(18)
    r_h3.font.bold = True
    r_h3.font.color.rgb = RGBColor(15, 23, 42)

    p_arch = doc.add_paragraph(
        "Upon project confirmation, the production mobile app will interface directly with Daily Amar Desh's official "
        "backend and CMS via token-authenticated REST/GraphQL APIs and webhooks. Journalists and editors will experience "
        "zero disruption: they will publish articles as usual, and the mobile app will automatically ingest content and "
        "trigger notifications in real-time. If backend stack modernization is needed, CybrCraft handles it end-to-end."
    )
    p_arch.paragraph_format.space_after = Pt(10)

    # Embed Chart 2: Architecture
    if os.path.exists('assets/proposal/architecture_diagram.png'):
        p_img2 = doc.add_paragraph()
        p_img2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_img2 = p_img2.add_run()
        r_img2.add_picture('assets/proposal/architecture_diagram.png', width=Inches(6.2))
        p_cap2 = doc.add_paragraph()
        p_cap2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap2.paragraph_format.space_before = Pt(2)
        p_cap2.paragraph_format.space_after = Pt(14)
        r_cap2 = p_cap2.add_run("Figure 2: Secure Official Backend Architecture & Two-Phase Ingestion Flow")
        r_cap2.font.size = Pt(8.5)
        r_cap2.font.italic = True
        r_cap2.font.color.rgb = RGBColor(100, 116, 139)

    # Feature Matrix Table
    p_feat = doc.add_paragraph()
    p_feat.paragraph_format.space_before = Pt(4)
    p_feat.paragraph_format.space_after = Pt(6)
    r_fth = p_feat.add_run("Core Application Modules & Navigation Hubs:")
    r_fth.font.bold = True
    r_fth.font.size = Pt(11)

    hub_table = doc.add_table(rows=6, cols=3)
    hub_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hub_table.autofit = False
    set_table_borders(hub_table, color="CBD5E1")

    hub_headers = ["Navigation Hub", "Key Features & Capabilities", "Editorial Value to Amar Desh"]
    for i, h in enumerate(hub_headers):
        c = hub_table.cell(0, i)
        set_cell_background(c, "DC2626")
        set_cell_margins(c, top=90, bottom=90, left=90, right=90)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    hub_data = [
        ("1. হোম (Home Feed)",
         "• Live Bengali & Hijri date header\n• Breaking News animated ticker\n• 8-Division prayer times widget\n• Hyperlocal division switcher\n• 14 category carousel chips",
         "Delivers instantaneous, comprehensive news overview matching dailyamardesh.com homepage."),
        ("2. ই-পেপার (ePaper Gallery)",
         "• Multi-page navigation (১ম-৮ম পাতা)\n• Crisp pinch-to-zoom & pan\n• Single-tap offline edition download\n• Direct sync with eamardesh.com",
         "Replicates the print newspaper experience digitally; high reader retention for print loyalists."),
        ("3. ভিডিও (Multimedia Hub)",
         "• In-app streaming of Amar Desh YouTube news\n• Category filters (National, Talkshow, Analysis)\n• Zero ads interruption",
         "Empowers younger, mobile-first audiences who prefer video and audio journalism."),
        ("4. সেভ (Saved & Offline)",
         "• Persistent bookmark library\n• SQLite 7-day automatic LRU cache\n• Full-text search across cached stories",
         "Ensures reading continuity during power cuts, transit, or rural connectivity drops."),
        ("5. মেনু (Catalog & Settings)",
         "• 14-vertical category directory\n• Dark Mode / Light Mode toggle\n• Bengali typography scaling (A- / A+)\n• HQ contact & social links",
         "Complete reader comfort, accessibility, and direct connectivity to Amar Desh publication office.")
    ]

    for idx, (hub, feat, val) in enumerate(hub_data):
        row_idx = idx + 1
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate([hub, feat, val]):
            c = hub_table.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=90, right=90)
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 4: HIGH-FIDELITY MOBILE UI/UX DESIGN SHOWCASE
    # -------------------------------------------------------------
    h_ui = doc.add_heading(level=1)
    r_hui = h_ui.add_run("4. UI/UX Design System Showcase & Broadsheet Aesthetics")
    r_hui.font.name = 'Calibri'
    r_hui.font.size = Pt(18)
    r_hui.font.bold = True
    r_hui.font.color.rgb = RGBColor(15, 23, 42)

    p_ui = doc.add_paragraph(
        "To honor Daily Amar Desh's legacy and broadsheet stature, CybrCraft engineered the 'Modern Editorial' "
        "design system via the Stitch UI framework. The visual interface replaces generic startup rounded shapes "
        "with authentic newspaper parchment (#FBF9F5), deep printer's ink (#121212), Editorial Crimson (#BA131A), "
        "and 1px hairline rules (#E5E0D8). The figures below present the actual high-fidelity mobile application screens "
        "generated for Daily Amar Desh:"
    )
    p_ui.paragraph_format.space_after = Pt(10)

    # 2x2 Grid Table of Screenshots
    ui_table = doc.add_table(rows=2, cols=2)
    ui_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    ui_table.autofit = False
    ui_table.columns[0].width = Inches(3.2)
    ui_table.columns[1].width = Inches(3.2)
    set_table_borders(ui_table, color="CBD5E1")

    screens_data = [
        ("assets/proposal/stitch_home_feed.jpg", "Figure 3: Broadsheet Home Feed", "Live masthead, breaking news ticker, lead hero splash, and 14-vertical category carousel chips."),
        ("assets/proposal/stitch_article_reader.jpg", "Figure 4: Narrative Article Reader", "Book-grade typography (Newsreader / Noto Serif), 3-point AI smart summary, and bracketed author bylines."),
        ("assets/proposal/stitch_epaper_saved.jpg", "Figure 5: Digital ePaper & Saved Edition", "High-resolution print replica canvas with 1px column hotspot crop reading and offline download."),
        ("assets/proposal/stitch_explore_categories.jpg", "Figure 6: Sections Directory & Topics Hub", "Complete 14-vertical newsroom directory, district picker, AI assistant settings, and multi-language controls.")
    ]

    for idx, (img_path, caption, desc) in enumerate(screens_data):
        row_idx = idx // 2
        col_idx = idx % 2
        cell = ui_table.cell(row_idx, col_idx)
        cell.width = Inches(3.2)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p_c = cell.paragraphs[0]
        p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if os.path.exists(img_path):
            r_img = p_c.add_run()
            r_img.add_picture(img_path, width=Inches(2.8))

        p_cap = cell.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(2)
        r_cp = p_cap.add_run(caption + "\n")
        r_cp.font.bold = True
        r_cp.font.size = Pt(8.5)
        r_cp.font.color.rgb = RGBColor(15, 23, 42)

        r_cd = p_cap.add_run(desc)
        r_cd.font.size = Pt(7.5)
        r_cd.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 5: 3-WEEK IMPLEMENTATION ROADMAP
    # -------------------------------------------------------------
    h5 = doc.add_heading(level=1)
    r_h5 = h5.add_run("5. Project Timeline & Rapid Delivery Roadmap")
    r_h5.font.name = 'Calibri'
    r_h5.font.size = Pt(18)
    r_h5.font.bold = True
    r_h5.font.color.rgb = RGBColor(15, 23, 42)

    p_road = doc.add_paragraph(
        "Because CybrCraft has already engineered and verified the frontend and mobile architecture in the Demo PoC, "
        "the standard development timeline of 3 to 4 months is compressed down to an express 3-week delivery window:"
    )
    p_road.paragraph_format.space_after = Pt(10)

    # Embed Chart 3: Roadmap
    if os.path.exists('assets/proposal/timeline_roadmap.png'):
        p_img3 = doc.add_paragraph()
        p_img3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_img3 = p_img3.add_run()
        r_img3.add_picture('assets/proposal/timeline_roadmap.png', width=Inches(6.2))
        p_cap3 = doc.add_paragraph()
        p_cap3.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap3.paragraph_format.space_before = Pt(2)
        p_cap3.paragraph_format.space_after = Pt(14)
        r_cap3 = p_cap3.add_run("Figure 7: 3-Week Express Delivery Schedule & Milestones")
        r_cap3.font.size = Pt(8.5)
        r_cap3.font.italic = True
        r_cap3.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_page_break()

    # -------------------------------------------------------------
    # SECTION 6: COMMERCIAL INVESTMENT OPTIONS
    # -------------------------------------------------------------
    h6 = doc.add_heading(level=1)
    r_h6 = h6.add_run("6. Commercial Engagement Options")
    r_h6.font.name = 'Calibri'
    r_h6.font.size = Pt(18)
    r_h6.font.bold = True
    r_h6.font.color.rgb = RGBColor(15, 23, 42)

    p_comm = doc.add_paragraph(
        "CybrCraft offers three flexible engagement models tailored to the administrative, "
        "operational, and strategic preferences of Amar Desh Publication Limited:"
    )
    p_comm.paragraph_format.space_after = Pt(10)

    comm_table = doc.add_table(rows=4, cols=3)
    comm_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    comm_table.autofit = False
    set_table_borders(comm_table, color="CBD5E1")

    comm_headers = ["Engagement Model", "Scope & Deliverables", "Commercial Terms"]
    for i, h in enumerate(comm_headers):
        c = comm_table.cell(0, i)
        set_cell_background(c, "1E293B")
        set_cell_margins(c, top=90, bottom=90, left=90, right=90)
        p = c.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    comm_data = [
        ("Option A: Turnkey Ownership & Handover (Recommended)",
         "• Full Android & iOS production builds\n• Official CMS/backend API integration\n• Automated push notification poller setup\n• 100% full source code & GitHub handover\n• 3 months complimentary warranty & bug fixes",
         "One-time investment:\nBDT 3,50,000\n(Three Lakh Fifty Thousand Taka)\n*Negotiable based on scope"),
        ("Option B: Turnkey + Annual Managed Partnership",
         "• Everything in Option A\n• Monthly OS updates (Android 15/16, iOS 18/19)\n• 24/7 backend API & push notification monitoring\n• Guaranteed 4-hour SLA for critical issues\n• Quarterly feature upgrades",
         "Initial Deployment: BDT 2,50,000\n+\nMonthly Retainer: BDT 25,000 / month"),
        ("Option C: Strategic Media & Revenue Share",
         "• Zero upfront development fee\n• CybrCraft integrates, develops and maintains app\n• Monetization via Amar Desh direct ad campaigns\n• Shared revenue distribution agreement",
         "BDT 0 Upfront\n(Revenue share agreement with Amar Desh Ad Desk: 01332-837514)")
    ]

    for idx, (m, s, t) in enumerate(comm_data):
        row_idx = idx + 1
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate([m, s, t]):
            c = comm_table.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=90, bottom=90, left=90, right=90)
            p = c.paragraphs[0]
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(9)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = RGBColor(15, 23, 42)
            elif col_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(185, 28, 28)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 7: BENGALI EXECUTIVE PITCH SUMMARY
    # -------------------------------------------------------------
    h7 = doc.add_heading(level=1)
    r_h7 = h7.add_run("7. সম্পাদকীয় বোর্ড ও জনাব মাহমুদুর রহমান-এর সমীপে নিবেদন")
    r_h7.font.name = 'Calibri'
    r_h7.font.size = Pt(16)
    r_h7.font.bold = True
    r_h7.font.color.rgb = RGBColor(220, 38, 38)

    p_bn1 = doc.add_paragraph(
        "শ্রদ্ধেয় সম্পাদক ও প্রকাশক মহোদয়,\n"
        "‘স্বাধীনতার কথা বলে’— আপসহীন সাংবাদিকতার প্রতীক ‘দৈনিক আমার দেশ’ দীর্ঘ সংগ্রাম ও জুলাই ২০২৪-এর ঐতিহাসিক "
        "গণঅভ্যুত্থানের পর কোটি পাঠকের হৃদয়ে পুনরুজ্জীবিত হয়েছে। স্বাধীন বাংলাদেশের মুক্ত চিন্তার অগ্রযাত্রায় আপনার বলিষ্ঠ নেতৃত্ব অনস্বীকার্য।"
    )
    p_bn1.paragraph_format.space_after = Pt(8)

    p_bn2 = doc.add_paragraph(
        "বর্তমানে গুগল প্লে-স্টোর কিংবা অ্যাপল অ্যাপ স্টোরে দৈনিক আমার দেশ-এর কোনো অফিসিয়াল মোবাইল অ্যাপ্লিকেশন না থাকায় "
        "পাঠকদের জন্য ব্রেকিং নিউজ পুশ অ্যালার্ট এবং অফলাইন রিডিং নিশ্চিত করা সম্ভব হচ্ছে না। সাইবারক্রাফট (CybrCraft) শুধুমাত্র "
        "কোনো তাত্ত্বিক পরিকল্পনা নয়, বরং সরাসরি ফোনে ব্যবহারযোগ্য একটি পূর্ণাঙ্গ পরীক্ষামূলক অ্যান্ড্রয়েড ডেমো এপিকে (Demo APK) তৈরি সম্পন্ন করেছে।"
    )
    p_bn2.paragraph_format.space_after = Pt(8)

    p_bn3 = doc.add_paragraph(
        "প্রকল্প চূড়ান্তকরণের পর অ্যাপটি কোনো স্ক্র্যাপিং করবে না; বরং ‘দৈনিক আমার দেশ’-এর অফিসিয়াল ব্যাকএন্ড/সিএমএস-এর সাথে সরাসরি ও "
        "সুরক্ষিত এপিআই-এর মাধ্যমে যুক্ত হবে। আপনার বার্তা দলের কোনো বাড়তি কাজ করতে হবে না—ওয়েবে সংবাদ প্রকাশিত হওয়ার সাথে সাথে তা "
        "স্বয়ংক্রিয়ভাবে অ্যাপে চলে আসবে। ব্যাকএন্ডে কোনো টেক স্ট্যাক আপগ্রেডেশন প্রয়োজন হলে তা-ও সাইবারক্রাফট বাস্তবায়ন করবে। "
        "আমরা কারওয়ান বাজারের ঢাকা ট্রেড সেন্টারে আপনার কার্যালয়ে সশরীরে উপস্থিত হয়ে মাত্র ১৫ মিনিটের একটি সংক্ষিপ্ত লাইভ ডেমো "
        "প্রদর্শনের সুযোগ প্রার্থনা করছি।"
    )
    p_bn3.paragraph_format.space_after = Pt(14)

    # -------------------------------------------------------------
    # SECTION 8: ABOUT CYBRCRAFT & CONTACT DETAILS
    # -------------------------------------------------------------
    h8 = doc.add_heading(level=1)
    r_h8 = h8.add_run("8. About CybrCraft & Next Steps")
    r_h8.font.name = 'Calibri'
    r_h8.font.size = Pt(18)
    r_h8.font.bold = True
    r_h8.font.color.rgb = RGBColor(15, 23, 42)

    p_about = doc.add_paragraph(
        "CybrCraft (https://cybrcraft.com/) is a leading digital engineering and application development agency headquartered "
        "in Dhaka, Bangladesh. With over 50+ completed software projects and a proven track record across scalable web and mobile "
        "ecosystems, CybrCraft combines deep technical rigor with dedicated 24/7 post-launch support."
    )
    p_about.paragraph_format.space_after = Pt(10)

    # Contact Box
    contact_table = doc.add_table(rows=1, cols=2)
    contact_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    contact_table.autofit = False
    contact_table.columns[0].width = Inches(3.25)
    contact_table.columns[1].width = Inches(3.25)

    c_box1 = contact_table.cell(0, 0)
    c_box2 = contact_table.cell(0, 1)

    set_cell_background(c_box1, "F8FAFC")
    set_cell_background(c_box2, "FEF2F2")
    set_cell_margins(c_box1, top=120, bottom=120, left=120, right=120)
    set_cell_margins(c_box2, top=120, bottom=120, left=120, right=120)

    p_cb1 = c_box1.paragraphs[0]
    p_cb1.paragraph_format.space_before = Pt(0)
    p_cb1.paragraph_format.space_after = Pt(0)
    r_b1 = p_cb1.add_run("CYBRCRAFT LEADERSHIP:\n")
    r_b1.font.bold = True
    r_b1.font.size = Pt(10)
    r_b1.font.color.rgb = RGBColor(15, 23, 42)
    p_cb1.add_run(
        "Agency: CybrCraft\n"
        "Website: https://cybrcraft.com/\n"
        "Email: info@cybrcraft.com\n"
        "Mobile / WhatsApp: +880 1967-600402\n"
        "Office: Bashundhara Riverview, Dhaka"
    ).font.size = Pt(9)

    p_cb2 = c_box2.paragraphs[0]
    p_cb2.paragraph_format.space_before = Pt(0)
    p_cb2.paragraph_format.space_after = Pt(0)
    r_b2 = p_cb2.add_run("TARGET CLIENT OFFICE:\n")
    r_b2.font.bold = True
    r_b2.font.size = Pt(10)
    r_b2.font.color.rgb = RGBColor(185, 28, 28)
    p_cb2.add_run(
        "Client: Amar Desh Publication Limited\n"
        "Editor & Publisher: Mahmudur Rahman\n"
        "Office: Dhaka Trade Centre (8th Floor), Karwan Bazar\n"
        "IT Dept: +880-1332-837513\n"
        "Email: info@dailyamardesh.com"
    ).font.size = Pt(9)

    doc.add_paragraph().paragraph_format.space_after = Pt(20)

    # Sign-off
    p_sign = doc.add_paragraph()
    r_s1 = p_sign.add_run("SUBMITTED BY:\n\n")
    r_s1.font.bold = True
    r_s1.font.size = Pt(10)
    r_s1.font.color.rgb = RGBColor(71, 85, 105)

    r_s2 = p_sign.add_run("Team CybrCraft\n")
    r_s2.font.bold = True
    r_s2.font.size = Pt(12)
    r_s2.font.color.rgb = RGBColor(15, 23, 42)

    r_s3 = p_sign.add_run("Enterprise Solutions & Mobile Engineering\nCybrCraft | https://cybrcraft.com/")
    r_s3.font.size = Pt(10)
    r_s3.font.color.rgb = RGBColor(100, 116, 139)

    # Save Document
    out_file = 'docs/Daily_Amar_Desh_Mobile_App_Proposal_CybrCraft.docx'
    doc.save(out_file)
    print(f"Successfully generated master DOCX file: {out_file} ({os.path.getsize(out_file)} bytes)")

if __name__ == '__main__':
    build_proposal_document()
