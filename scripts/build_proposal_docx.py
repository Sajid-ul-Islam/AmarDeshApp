import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=70, bottom=70, left=100, right=100):
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
    """Sets subtle borders for the table."""
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

    # Page Setup: Standard Letter, 0.75-inch margins to fit clean 3-page layout
    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Styles Setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(30, 41, 59) # #1e293b

    # =========================================================================
    # PAGE 1: THE REALITY & WHY AMAR DESH NEEDS A MOBILE APP
    # =========================================================================

    # Header Logos (CybrCraft & Amar Desh)
    hdr_table = doc.add_table(rows=1, cols=2)
    hdr_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_table.autofit = False
    hdr_table.columns[0].width = Inches(3.5)
    hdr_table.columns[1].width = Inches(3.5)

    c_left = hdr_table.cell(0, 0)
    c_right = hdr_table.cell(0, 1)

    p_l = c_left.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.LEFT
    if os.path.exists('assets/proposal/cybrcraft_logo.png'):
        p_l.add_run().add_picture('assets/proposal/cybrcraft_logo.png', width=Inches(1.8))

    p_r = c_right.paragraphs[0]
    p_r.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    if os.path.exists('assets/proposal/amardesh_logo.jpg'):
        p_r.add_run().add_picture('assets/proposal/amardesh_logo.jpg', width=Inches(2.0))

    # Accent Red Bar
    bar_tbl = doc.add_table(rows=1, cols=1)
    bar_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    b_cell = bar_tbl.cell(0, 0)
    b_cell.width = Inches(7.0)
    set_cell_background(b_cell, 'BA131A')
    set_cell_margins(b_cell, top=10, bottom=10, left=0, right=0)
    p_b = b_cell.paragraphs[0]
    p_b.paragraph_format.space_before = Pt(0)
    p_b.paragraph_format.space_after = Pt(0)

    # Main Title
    p_title = doc.add_paragraph()
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(2)
    r_t = p_title.add_run("OFFICIAL MOBILE APP PROPOSAL")
    r_t.font.name = 'Calibri'
    r_t.font.size = Pt(20)
    r_t.font.bold = True
    r_t.font.color.rgb = RGBColor(15, 23, 42)

    # Subtitle
    p_sub = doc.add_paragraph()
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(10)
    r_s = p_sub.add_run("Daily Amar Desh (দৈনিক আমার দেশ) | Straightforward Executive Pitch")
    r_s.font.size = Pt(11)
    r_s.font.color.rgb = RGBColor(100, 116, 139)

    # Metadata Strip (Clean 2-Column Table)
    meta_tbl = doc.add_table(rows=2, cols=2)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_tbl.autofit = False
    meta_tbl.columns[0].width = Inches(3.5)
    meta_tbl.columns[1].width = Inches(3.5)

    meta_items = [
        ("PREPARED FOR:", "Mr. Mahmudur Rahman (Editor & Publisher)\nAmar Desh Publication Ltd | Karwan Bazar, Dhaka"),
        ("PREPARED BY:", "CybrCraft (https://cybrcraft.com/)\nEmail: info@cybrcraft.com | WhatsApp: +880 1967-600402"),
        ("PROPOSAL REF:", "CC-AMARDESH-2026-V2"),
        ("DELIVERY SPEED:", "3-Week Direct Store Launch (Demo APK Ready Today)")
    ]

    for idx, (label, val) in enumerate(meta_items):
        r_idx = idx // 2
        c_idx = idx % 2
        cell = meta_tbl.cell(r_idx, c_idx)
        set_cell_background(cell, "F8FAFC")
        set_cell_margins(cell, top=40, bottom=40, left=60, right=60)
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r_lbl = p.add_run(label + " ")
        r_lbl.font.bold = True
        r_lbl.font.size = Pt(8.5)
        r_lbl.font.color.rgb = RGBColor(71, 85, 105)
        r_v = p.add_run(val)
        r_v.font.size = Pt(8.5)
        r_v.font.color.rgb = RGBColor(15, 23, 42)

    # Spacing
    p_sp1 = doc.add_paragraph()
    p_sp1.paragraph_format.space_before = Pt(8)
    p_sp1.paragraph_format.space_after = Pt(0)

    # SECTION 1: The Core Reality
    h1 = doc.add_paragraph()
    h1.paragraph_format.space_before = Pt(6)
    h1.paragraph_format.space_after = Pt(4)
    r_h1 = h1.add_run("1. The Core Reality: Why Amar Desh Needs a Mobile App Today")
    r_h1.font.size = Pt(13)
    r_h1.font.bold = True
    r_h1.font.color.rgb = RGBColor(186, 19, 26)

    p_intro = doc.add_paragraph(
        "Amar Desh represents the voice of truth and resistance ('স্বাধীনতার কথা বলে'). After the historic July 2024 uprising, "
        "public trust in Mahmudur Rahman and Amar Desh is at an all-time peak. However, the newspaper currently has NO official app "
        "on Google Play Store or Apple App Store. Here is why that needs to change immediately:"
    )
    p_intro.paragraph_format.space_after = Pt(6)

    reasons = [
        ("92% of Readers are on Phones:", "People no longer buy roadside papers like before, nor do they type web URLs into mobile browsers. News is read on smartphone notifications and apps."),
        ("Bypass Social Media Censorship:", "When you depend on Facebook or Google, their algorithms decide who sees your news. They throttle political news and keep the ad money. A mobile app gives you a direct, uncensorable channel straight to your readers' lock-screens."),
        ("Reaching the Youth (Gen-Z):", "The student generation that led the revolution respects Amar Desh, but they consume news in seconds on mobile—breaking alerts, audio briefs, and quick reads. Without an app, you lose this generation to unverified social media rumors."),
        ("Serving the Global Diaspora:", "Millions of proud Bangladeshis in the UK, USA, and Middle East want to read Amar Desh every morning. Physical paper cannot reach them abroad; a mobile app delivers the morning ePaper instantly."),
        ("Eliminating Fake Apps:", "Because Amar Desh doesn't have an official app, unauthorized clone apps on Google Play are misusing your masthead and earning money off your reputation. An official app reclaims your brand.")
    ]

    for title, desc in reasons:
        p_r = doc.add_paragraph()
        p_r.paragraph_format.space_before = Pt(2)
        p_r.paragraph_format.space_after = Pt(3)
        r1 = p_r.add_run(f"• {title} ")
        r1.font.bold = True
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = RGBColor(15, 23, 42)
        r2 = p_r.add_run(desc)
        r2.font.size = Pt(9.5)

    # Bottom Stat Strip
    stat_tbl = doc.add_table(rows=1, cols=4)
    stat_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    stat_tbl.autofit = False
    set_table_borders(stat_tbl, color="CBD5E1")

    stat_data = [
        ("92%+", "Mobile News Readers"),
        ("1,000,000+", "Direct Lock-Screen Push"),
        ("0 Extra Work", "For Newsroom Staff"),
        ("100% Owned", "Full Source Code & IP")
    ]

    for idx, (num, desc) in enumerate(stat_data):
        cell = stat_tbl.cell(0, idx)
        cell.width = Inches(1.75)
        set_cell_background(cell, "FEF2F2")
        set_cell_margins(cell, top=60, bottom=60, left=40, right=40)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r_n = p.add_run(num + "\n")
        r_n.font.bold = True
        r_n.font.size = Pt(12)
        r_n.font.color.rgb = RGBColor(186, 19, 26)
        r_d = p.add_run(desc)
        r_d.font.size = Pt(8)
        r_d.font.color.rgb = RGBColor(71, 85, 105)

    # END OF PAGE 1
    doc.add_page_break()

    # =========================================================================
    # PAGE 2: WHAT WE DELIVER — STRAIGHTFORWARD, AUTOMATED & LIVE TODAY
    # =========================================================================

    h2 = doc.add_paragraph()
    h2.paragraph_format.space_before = Pt(0)
    h2.paragraph_format.space_after = Pt(4)
    r_h2 = h2.add_run("2. What We Deliver: Simple, Automated & Live Today")
    r_h2.font.size = Pt(13)
    r_h2.font.bold = True
    r_h2.font.color.rgb = RGBColor(186, 19, 26)

    # Confidence Box (Working Demo Ready)
    demo_tbl = doc.add_table(rows=1, cols=1)
    demo_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    d_cell = demo_tbl.cell(0, 0)
    d_cell.width = Inches(7.0)
    set_cell_background(d_cell, "F0FDF4")
    set_cell_margins(d_cell, top=80, bottom=80, left=100, right=100)
    p_dm = d_cell.paragraphs[0]
    p_dm.paragraph_format.space_before = Pt(0)
    p_dm.paragraph_format.space_after = Pt(0)
    r_dm_t = p_dm.add_run("★ WE ALREADY BUILT THE DEMO — TEST IT ON YOUR PHONE TODAY:\n")
    r_dm_t.font.bold = True
    r_dm_t.font.size = Pt(9.5)
    r_dm_t.font.color.rgb = RGBColor(22, 101, 52)
    r_dm_b = p_dm.add_run(
        "We don't pitch abstract slideshows. CybrCraft has already engineered a fully working Android app with real Amar Desh news. "
        "Mr. Mahmudur Rahman and your board can install the APK and test it on your personal phones today."
    )
    r_dm_b.font.size = Pt(9)
    r_dm_b.font.color.rgb = RGBColor(20, 83, 45)

    # Zero Newsroom Work Callout
    zero_tbl = doc.add_table(rows=1, cols=1)
    zero_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    z_cell = zero_tbl.cell(0, 0)
    z_cell.width = Inches(7.0)
    set_cell_background(z_cell, "EEF2FF")
    set_cell_margins(z_cell, top=80, bottom=80, left=100, right=100)
    p_zr = z_cell.paragraphs[0]
    p_zr.paragraph_format.space_before = Pt(4)
    p_zr.paragraph_format.space_after = Pt(0)
    r_zr_t = p_zr.add_run("ZERO EXTRA WORK FOR YOUR EDITORS:\n")
    r_zr_t.font.bold = True
    r_zr_t.font.size = Pt(9.5)
    r_zr_t.font.color.rgb = RGBColor(67, 56, 202)
    r_zr_b = p_zr.add_run(
        "Your journalists do NOT need to learn anything new. They post news to your website (dailyamardesh.com) as usual. "
        "Our system automatically and instantly updates the app and sends breaking push alerts in seconds."
    )
    r_zr_b.font.size = Pt(9)
    r_zr_b.font.color.rgb = RGBColor(30, 27, 75)

    # 4 Simple Things the App Does
    p_caps = doc.add_paragraph()
    p_caps.paragraph_format.space_before = Pt(8)
    p_caps.paragraph_format.space_after = Pt(4)
    r_cp_h = p_caps.add_run("The 4 Core Things Readers Get in the App:")
    r_cp_h.font.bold = True
    r_cp_h.font.size = Pt(10.5)

    feats = [
        ("1. Instant Breaking News Alerts:", "Send urgent news flashes directly to 1M+ reader lock-screens the moment big news breaks."),
        ("2. Digital ePaper Reader (১ম-৮ম পাতা):", "Crisp digital replica of the full print paper for diaspora and traditional print readers."),
        ("3. Commuter Audio News (অডিও সংবাদ):", "Readers can listen to news hands-free through earphones while stuck in Dhaka traffic."),
        ("4. 7-Day Offline Reading:", "Articles save automatically so people can read during power cuts, travel, or rural network drops.")
    ]

    for f_title, f_desc in feats:
        p_f = doc.add_paragraph()
        p_f.paragraph_format.space_before = Pt(2)
        p_f.paragraph_format.space_after = Pt(2)
        rf1 = p_f.add_run(f"• {f_title} ")
        rf1.font.bold = True
        rf1.font.size = Pt(9.5)
        rf1.font.color.rgb = RGBColor(15, 23, 42)
        rf2 = p_f.add_run(f_desc)
        rf2.font.size = Pt(9.5)

    # Straightforward Comparison Table
    p_cmp = doc.add_paragraph()
    p_cmp.paragraph_format.space_before = Pt(6)
    p_cmp.paragraph_format.space_after = Pt(4)
    r_cmp_h = p_cmp.add_run("Why a Native App Beats Mobile Web:")
    r_cmp_h.font.bold = True
    r_cmp_h.font.size = Pt(10)

    cmp_tbl = doc.add_table(rows=5, cols=3)
    cmp_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cmp_tbl.autofit = False
    set_table_borders(cmp_tbl, color="CBD5E1")
    cmp_tbl.columns[0].width = Inches(1.8)
    cmp_tbl.columns[1].width = Inches(2.6)
    cmp_tbl.columns[2].width = Inches(2.6)

    cmp_headers = ["Key Capability", "Current Web Portal", "CybrCraft Mobile App"]
    for i, h in enumerate(cmp_headers):
        c = cmp_tbl.cell(0, i)
        set_cell_background(c, "1E293B")
        set_cell_margins(c, top=60, bottom=60, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    rows_data = [
        ("Breaking Alerts", "None. Readers must manually visit site.", "Instant push alerts to lock-screen in seconds."),
        ("Offline Reading", "Zero. Shows 'No Internet' error.", "Automatically readable offline without internet."),
        ("ePaper Experience", "Slow PDF zooming in mobile browser.", "Smooth page-flip viewer (১ম-৮ম পাতা) with zoom."),
        ("Audio News", "None. Requires reading small screens.", "Natural Bengali speech reader for Dhaka commutes.")
    ]

    for idx, (cap, wb, ap) in enumerate(rows_data):
        row_idx = idx + 1
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate([cap, wb, ap]):
            c = cmp_tbl.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=60, right=60)
            p = c.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True
            elif col_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(186, 19, 26)

    # Optional clean visual if space fits
    if os.path.exists('assets/proposal/engagement_comparison.png'):
        p_ch = doc.add_paragraph()
        p_ch.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_ch.paragraph_format.space_before = Pt(6)
        p_ch.paragraph_format.space_after = Pt(0)
        r_img = p_ch.add_run()
        r_img.add_picture('assets/proposal/engagement_comparison.png', width=Inches(5.6))

    # END OF PAGE 2
    doc.add_page_break()

    # =========================================================================
    # PAGE 3: PRICING, 3-WEEK PLAN, BENGALI SUMMARY & NEXT STEPS
    # =========================================================================

    h3 = doc.add_paragraph()
    h3.paragraph_format.space_before = Pt(0)
    h3.paragraph_format.space_after = Pt(4)
    r_h3 = h3.add_run("3. Clear Commercial Pricing & 3-Week Delivery")
    r_h3.font.size = Pt(13)
    r_h3.font.bold = True
    r_h3.font.color.rgb = RGBColor(186, 19, 26)

    # 3 Clear Options Table
    comm_tbl = doc.add_table(rows=4, cols=3)
    comm_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    comm_tbl.autofit = False
    set_table_borders(comm_tbl, color="CBD5E1")
    comm_tbl.columns[0].width = Inches(2.2)
    comm_tbl.columns[1].width = Inches(3.1)
    comm_tbl.columns[2].width = Inches(1.7)

    c_headers = ["Option", "What's Included", "Investment"]
    for i, h in enumerate(c_headers):
        c = comm_tbl.cell(0, i)
        set_cell_background(c, "1E293B")
        set_cell_margins(c, top=60, bottom=60, left=60, right=60)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    c_rows = [
        ("Option A: Turnkey Handover\n(Recommended)",
         "• Full Android & iOS Apps\n• Automated sync with web portal\n• Breaking push notification setup\n• 100% source code & GitHub handover\n• Complete IP ownership under Amar Desh\n• 3 months free support & bug fixes",
         "BDT 3,50,000\n(One-Time)\n\n*Negotiable"),
        ("Option B: Turnkey + Management",
         "• Everything in Option A\n• Ongoing store updates & 24/7 monitoring\n• Guaranteed 4-hour fix SLA",
         "BDT 2,50,000\n+\nBDT 25,000 / month"),
        ("Option C: Ad Revenue Share",
         "• Zero upfront development fees\n• CybrCraft builds and maintains\n• Monetized via Amar Desh Ad Desk campaigns",
         "BDT 0 Upfront\n(Revenue Share)")
    ]

    for idx, (opt, inc, inv) in enumerate(c_rows):
        row_idx = idx + 1
        bg = "F8FAFC" if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate([opt, inc, inv]):
            c = comm_tbl.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=50, bottom=50, left=60, right=60)
            p = c.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if col_idx == 0:
                r.font.bold = True
            elif col_idx == 2:
                r.font.bold = True
                r.font.color.rgb = RGBColor(186, 19, 26)

    # 3-Week Timeline Summary (Clean text strip)
    p_tl = doc.add_paragraph()
    p_tl.paragraph_format.space_before = Pt(6)
    p_tl.paragraph_format.space_after = Pt(4)
    r_tl_h = p_tl.add_run("Express 3-Week Launch: ")
    r_tl_h.font.bold = True
    r_tl_h.font.size = Pt(9.5)
    r_tl_h.font.color.rgb = RGBColor(15, 23, 42)
    r_tl_b = p_tl.add_run("Week 1: Automated sync setup  |  Week 2: Testing on your phones  |  Week 3: Official Google Play & App Store launch.")
    r_tl_b.font.size = Pt(9)
    r_tl_b.font.color.rgb = RGBColor(71, 85, 105)

    # Bengali Executive Summary
    h_bn = doc.add_paragraph()
    h_bn.paragraph_format.space_before = Pt(6)
    h_bn.paragraph_format.space_after = Pt(2)
    r_hbn = h_bn.add_run("৪. সম্পাদকীয় বোর্ড ও জনাব মাহমুদুর রহমান-এর সমীপে বিনীত নিবেদন")
    r_hbn.font.size = Pt(11)
    r_hbn.font.bold = True
    r_hbn.font.color.rgb = RGBColor(186, 19, 26)

    p_bn = doc.add_paragraph(
        "শ্রদ্ধেয় সম্পাদক মহোদয়,\n"
        "দেশের শতকরা ৯২ ভাগেরও বেশি পাঠক এখন মোবাইলে খবর পড়েন। গুগল প্লে-স্টোর কিংবা অ্যাপল অ্যাপ স্টোরে দৈনিক আমার দেশ-এর নিজস্ব "
        "অফিসিয়াল অ্যাপ না থাকায় কোটি পাঠকের কাছে তাৎক্ষণিক ব্রেকিং নিউজ পৌঁছানো যাচ্ছে না এবং সোশ্যাল মিডিয়ার অ্যালগরিদম সংবাদ আটকে দিচ্ছে। "
        "একটি নিজস্ব মোবাইল অ্যাপ দৈনিক আমার দেশ-কে সরাসরি পাঠকের হাতের মুঠোয় পৌঁছে দেবে।\n"
        "সবচেয়ে বড় বিষয়—আপনার বার্তা বিভাগের কোনো বাড়তি কাজ করতে হবে না; ওয়েবসাইটে খবর প্রকাশের সাথে সাথে তা স্বয়ংক্রিয়ভাবে অ্যাপে চলে আসবে। "
        "আমরা কোনো তাত্ত্বিক স্লাইড নয়, বরং সরাসরি ফোনে ব্যবহারযোগ্য একটি পূর্ণাঙ্গ লাইভ ডেমো অ্যাপ তৈরি সম্পন্ন করেছি। আপনার কার্যালয়ে সশরীরে উপস্থিত হয়ে "
        "মাত্র ১৫ মিনিটে আপনার ফোনে ডেমো প্রদর্শনের সুযোগ প্রার্থনা করছি।"
    )
    p_bn.paragraph_format.space_after = Pt(6)
    p_bn.runs[0].font.size = Pt(9)

    # Next Steps & Contact Box
    nxt_tbl = doc.add_table(rows=1, cols=2)
    nxt_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    nxt_tbl.autofit = False
    nxt_tbl.columns[0].width = Inches(3.5)
    nxt_tbl.columns[1].width = Inches(3.5)

    n_c1 = nxt_tbl.cell(0, 0)
    n_c2 = nxt_tbl.cell(0, 1)
    set_cell_background(n_c1, "F8FAFC")
    set_cell_background(n_c2, "FEF2F2")
    set_cell_margins(n_c1, top=50, bottom=50, left=60, right=60)
    set_cell_margins(n_c2, top=50, bottom=50, left=60, right=60)

    p_nc1 = n_c1.paragraphs[0]
    p_nc1.paragraph_format.space_before = Pt(0)
    p_nc1.paragraph_format.space_after = Pt(0)
    r_nc1_t = p_nc1.add_run("NEXT STEP:\n")
    r_nc1_t.font.bold = True
    r_nc1_t.font.size = Pt(9)
    p_nc1.add_run("Schedule a 15-minute live demo at your Karwan Bazar office (Dhaka Trade Centre, 8th Floor) to test the working APK.").font.size = Pt(8.5)

    p_nc2 = n_c2.paragraphs[0]
    p_nc2.paragraph_format.space_before = Pt(0)
    p_nc2.paragraph_format.space_after = Pt(0)
    r_nc2_t = p_nc2.add_run("CONTACT CYBRCRAFT:\n")
    r_nc2_t.font.bold = True
    r_nc2_t.font.size = Pt(9)
    r_nc2_t.font.color.rgb = RGBColor(186, 19, 26)
    p_nc2.add_run("WhatsApp / Call: +880 1967-600402\nEmail: info@cybrcraft.com | Web: https://cybrcraft.com/").font.size = Pt(8.5)

    # Clean Sign-off
    p_so = doc.add_paragraph()
    p_so.paragraph_format.space_before = Pt(6)
    p_so.paragraph_format.space_after = Pt(0)
    r_so1 = p_so.add_run("Team CybrCraft ")
    r_so1.font.bold = True
    r_so1.font.size = Pt(9.5)
    r_so2 = p_so.add_run("| Enterprise Mobile Solutions | Bashundhara Riverview, Dhaka")
    r_so2.font.size = Pt(8.5)
    r_so2.font.color.rgb = RGBColor(100, 116, 139)

    # Save
    out_file = 'docs/Daily_Amar_Desh_Mobile_App_Proposal_CybrCraft.docx'
    doc.save(out_file)
    print(f"Successfully generated 3-page master DOCX file: {out_file} ({os.path.getsize(out_file)} bytes)")

if __name__ == '__main__':
    build_proposal_document()
