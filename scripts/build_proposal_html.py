import base64
import os

def img_to_base64(path):
    if not os.path.exists(path):
        return ""
    ext = os.path.splitext(path)[1].replace('.', '')
    if ext == 'jpg': ext = 'jpeg'
    with open(path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('utf-8')
    return f"data:image/{ext};base64,{data}"

def build_html_proposal():
    cybr_b64 = img_to_base64('assets/proposal/cybrcraft_logo.png')
    ad_b64 = img_to_base64('assets/proposal/amardesh_logo.jpg')
    comp_b64 = img_to_base64('assets/proposal/engagement_comparison.png')
    arch_b64 = img_to_base64('assets/proposal/architecture_diagram.png')
    road_b64 = img_to_base64('assets/proposal/timeline_roadmap.png')
    home_b64 = img_to_base64('assets/proposal/stitch_home_feed.jpg')
    reader_b64 = img_to_base64('assets/proposal/stitch_article_reader.jpg')
    epaper_b64 = img_to_base64('assets/proposal/stitch_epaper_saved.jpg')
    explore_b64 = img_to_base64('assets/proposal/stitch_explore_categories.jpg')

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Official Mobile App Project Proposal — Daily Amar Desh | CybrCraft</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700&display=swap');

  :root {{
    --primary: #dc2626;
    --primary-dark: #991b1b;
    --secondary: #7c2cff;
    --dark: #0f172a;
    --slate: #334155;
    --muted: #64748b;
    --light-bg: #f8fafc;
    --border: #e2e8f0;
  }}

  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--slate);
    background: #f1f5f9;
    line-height: 1.6;
    padding: 40px 20px;
  }}

  .paper {{
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    border-radius: 12px;
    padding: 60px 70px;
  }}

  /* HEADER & LOGOS */
  .header-logos {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border);
    padding-bottom: 25px;
    margin-bottom: 35px;
  }}
  .logo-img {{
    max-height: 52px;
    width: auto;
    object-fit: contain;
  }}

  .accent-bar {{
    height: 6px;
    background: linear-gradient(90deg, #dc2626 0%, #7c2cff 100%);
    border-radius: 3px;
    margin-bottom: 30px;
  }}

  h1 {{
    font-size: 32px;
    font-weight: 800;
    color: var(--dark);
    line-height: 1.2;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }}
  .subtitle {{
    font-size: 16px;
    color: var(--muted);
    margin-bottom: 30px;
  }}

  /* TWO PHASE BADGE */
  .badge-card {{
    background: #fef2f2;
    border-left: 4px solid var(--primary);
    padding: 16px 20px;
    border-radius: 6px;
    margin-bottom: 35px;
  }}
  .badge-card strong {{
    color: var(--primary-dark);
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .badge-card p {{
    color: #7f1d1d;
    font-size: 13.5px;
    margin-top: 4px;
  }}

  /* METADATA GRID */
  .meta-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: var(--light-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 25px;
    margin-bottom: 45px;
    font-size: 13.5px;
  }}
  .meta-item strong {{
    display: block;
    color: var(--dark);
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }}

  /* SECTION HEADINGS */
  h2 {{
    font-size: 22px;
    font-weight: 700;
    color: var(--dark);
    margin-top: 40px;
    margin-bottom: 15px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
  }}
  h2.bengali {{
    font-family: 'Noto Serif Bengali', 'Inter', serif;
    color: var(--primary);
  }}

  p {{
    font-size: 14.5px;
    margin-bottom: 16px;
    color: #334155;
    line-height: 1.7;
  }}
  .bengali-p {{
    font-family: 'Noto Serif Bengali', 'Inter', serif;
    font-size: 15px;
    line-height: 1.8;
  }}

  /* KPI STAT GRID */
  .kpi-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin: 25px 0 35px;
  }}
  .kpi-card {{
    background: var(--light-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 18px 15px;
    text-align: center;
  }}
  .kpi-card .number {{
    font-size: 26px;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 6px;
  }}
  .kpi-card .label {{
    font-size: 13px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 3px;
  }}
  .kpi-card .desc {{
    font-size: 11px;
    color: var(--muted);
  }}

  /* DIAGRAMS & CHARTS */
  .diagram-container {{
    margin: 25px 0;
    text-align: center;
  }}
  .diagram-img {{
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  }}
  .caption {{
    font-size: 12px;
    color: var(--muted);
    font-style: italic;
    margin-top: 8px;
  }}

  /* SCREENS SHOWCASE GRID */
  .screens-grid {{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin: 25px 0 35px;
  }}
  .screen-card {{
    background: #fbf9f5;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }}
  .screen-img-box {{
    width: 100%;
    background: #f5f3ef;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--border);
    padding: 12px;
  }}
  .screen-img {{
    max-width: 100%;
    max-height: 480px;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }}
  .screen-info {{
    padding: 14px 16px;
    background: #ffffff;
    flex: 1;
  }}
  .screen-title {{
    font-size: 13.5px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 4px;
  }}
  .screen-desc {{
    font-size: 12px;
    color: var(--muted);
    line-height: 1.45;
  }}

  /* TABLES */
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0 30px;
    font-size: 13.5px;
  }}
  th {{
    background: var(--dark);
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 12px 14px;
  }}
  th.red {{
    background: var(--primary);
  }}
  td {{
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }}
  tr:nth-child(even) td {{
    background: var(--light-bg);
  }}

  /* CONTACT FOOTER */
  .contact-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 35px;
    padding-top: 25px;
    border-top: 2px solid var(--border);
  }}
  .contact-col {{
    background: var(--light-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    font-size: 13px;
  }}
  .contact-col.highlight {{
    background: #fef2f2;
    border-color: #fecaca;
  }}
  .contact-col h4 {{
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
    color: var(--dark);
  }}

  @media print {{
    body {{ background: #fff; padding: 0; }}
    .paper {{ box-shadow: none; border-radius: 0; padding: 20px 30px; }}
    .page-break {{ page-break-before: always; }}
  }}
</style>
</head>
<body>

<div class="paper">
  <!-- DUAL LOGO HEADER -->
  <div class="header-logos">
    <img src="{cybr_b64}" alt="CybrCraft Logo" class="logo-img">
    <img src="{ad_b64}" alt="Daily Amar Desh Logo" class="logo-img">
  </div>

  <div class="accent-bar"></div>

  <h1>PROJECT PROPOSAL:<br>OFFICIAL MOBILE APPLICATION ECOSYSTEM</h1>
  <div class="subtitle">Live Interactive Demo, One-Stop Automated Backend Integration & Official Store Launch for Daily Amar Desh (দৈনিক আমার দেশ)</div>

  <div class="badge-card">
    <strong>★ TWO-PHASE DELIVERY & ONE-STOP AUTOMATED SOLUTION</strong>
    <p>1) <strong>Phase 1 (Live Demo PoC):</strong> A fully functioning Android APK is available today for hands-on review by Mahmudur Rahman and senior editorial heads.<br>
    2) <strong>Phase 2 (Production):</strong> Upon confirmation, the app directly and securely integrates with Amar Desh's official backend/CMS with <strong>zero manual work for journalists</strong>. Any backend stack modernization will be handled end-to-end by CybrCraft.</p>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      <strong>PREPARED FOR:</strong>
      Mr. Mahmudur Rahman (Editor & Publisher / সম্পাদক ও প্রকাশক)<br>
      Amar Desh Publication Limited (আমার দেশ পাবলিকেশন লিমিটেড)<br>
      Dhaka Trade Centre (8th Floor), Karwan Bazar, Dhaka-1215
    </div>
    <div class="meta-item">
      <strong>PREPARED BY:</strong>
      CybrCraft (https://cybrcraft.com/)<br>
      Bashundhara Riverview, Dhaka, Bangladesh<br>
      Email: info@cybrcraft.com | WhatsApp: +880 1967-600402
    </div>
    <div class="meta-item">
      <strong>PROPOSAL REFERENCE:</strong>
      CC-PRP-2026-AMARDESH-01
    </div>
    <div class="meta-item">
      <strong>DATE:</strong>
      October 2026 | Version 1.1.0 (Pitch Ready)
    </div>
  </div>

  <h2>1. Executive Summary & Delivery Strategy</h2>
  <p>Daily Amar Desh (দৈনিক আমার দেশ), founded under the motto <em>"স্বাধীনতার কথা বলে"</em> (Speaks of Independence) and guided by the uncompromising leadership of Editor and Publisher Mahmudur Rahman, is one of Bangladesh’s most courageous and widely followed national dailies. Following the historic July 2024 uprising and the paper’s triumphant return, reader loyalty has reached an all-time peak across Bangladesh and the international diaspora.</p>
  <p>While Amar Desh has established an active web portal (dailyamardesh.com) and an e-paper portal (eamardesh.com), <strong>the publication currently has NO official native mobile application on the Google Play Store or Apple App Store</strong>. In a media market where over 92% of readers consume news exclusively on smartphones, this creates critical gaps in breaking news delivery, reader retention, and brand protection.</p>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="number">92%+</div>
      <div class="label">Mobile Readership</div>
      <div class="desc">Primary news consumption mode in Bangladesh</div>
    </div>
    <div class="kpi-card">
      <div class="number">&lt; 1.2s</div>
      <div class="label">Cold Launch Speed</div>
      <div class="desc">Hardware-accelerated instant rendering</div>
    </div>
    <div class="kpi-card">
      <div class="number">7 Days</div>
      <div class="label">Offline SQLite Cache</div>
      <div class="desc">Full-text reading during travel & power cuts</div>
    </div>
    <div class="kpi-card">
      <div class="number">0 Manual</div>
      <div class="label">Newsroom Effort</div>
      <div class="desc">100% automated CMS & backend ingestion</div>
    </div>
    <div class="kpi-card">
      <div class="number">2-3 Wks</div>
      <div class="label">Rapid Turnaround</div>
      <div class="desc">Working prototype ready for launch</div>
    </div>
    <div class="kpi-card">
      <div class="number">100%</div>
      <div class="label">Source Code Ownership</div>
      <div class="desc">Full intellectual property handover option</div>
    </div>
  </div>

  <h2>2. Business Opportunity & Digital Benchmark</h2>
  <p>Relying solely on a mobile web browser creates multiple points of friction that degrade reader engagement. The chart below illustrates the quantified performance advantages of deploying an official native mobile app:</p>

  <div class="diagram-container">
    <img src="{comp_b64}" alt="Digital Benchmark Comparison Chart" class="diagram-img">
    <div class="caption">Figure 1: Digital Performance Benchmark — Mobile Web Browser vs. Official Mobile App</div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Strategic Metric</th>
        <th>Current Mobile Web Portal</th>
        <th>CybrCraft Native Mobile App</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Push Notifications</strong></td>
        <td>None. Readers discover breaking news via social media algorithms.</td>
        <td style="color:#166534; font-weight:600;">Real-time FCM push alerts reach 1,000,000+ devices in seconds.</td>
      </tr>
      <tr>
        <td><strong>Offline Accessibility</strong></td>
        <td>Zero. Without 4G/WiFi, web browser displays "No Internet Connection".</td>
        <td style="color:#166534; font-weight:600;">SQLite relational database stores up to 500 articles for 7-day offline reading.</td>
      </tr>
      <tr>
        <td><strong>ePaper Experience</strong></td>
        <td>Clunky PDF browser zooming with high memory overhead.</td>
        <td style="color:#166534; font-weight:600;">Native page-flip viewer (১ম-৮ম পাতা) with smooth hardware pinch-zoom.</td>
      </tr>
      <tr>
        <td><strong>Commuter Audio News</strong></td>
        <td>Manual reading required on small mobile screens.</td>
        <td style="color:#166534; font-weight:600;">Natural Bengali Text-to-Speech (TTS) with play, pause, and speed multiplier.</td>
      </tr>
      <tr>
        <td><strong>Brand Protection</strong></td>
        <td>Unofficial aggregators on Google Play exploit the trademark.</td>
        <td style="color:#166534; font-weight:600;">Official verified publisher profile certified under Amar Desh Publication Ltd.</td>
      </tr>
    </tbody>
  </table>

  <h2>3. System Architecture & Secure Backend Integration</h2>
  <p>Our current app is a live Demo/PoC enabling immediate testing. Upon project confirmation, the production app will not rely on scraping; it will connect directly to Daily Amar Desh's official backend/CMS via secure APIs. Amar Desh journalists and editors will not perform any extra manual work—publishing in the web CMS will automatically, securely, and instantaneously sync to the mobile app. CybrCraft will handle any server-side API or stack modernization required.</p>

  <div class="diagram-container">
    <img src="{arch_b64}" alt="System Architecture Diagram" class="diagram-img">
    <div class="caption">Figure 2: Secure Official Backend Architecture & Two-Phase Ingestion Flow</div>
  </div>

  <table>
    <thead>
      <tr>
        <th class="red">Navigation Hub</th>
        <th class="red">Key Features & Capabilities</th>
        <th class="red">Editorial Value to Amar Desh</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>1. হোম (Home Feed)</strong></td>
        <td>• Live Bengali & Hijri date header<br>• Breaking News animated ticker<br>• 8-Division prayer times widget<br>• Hyperlocal division switcher<br>• 14 category carousel chips</td>
        <td>Delivers instantaneous, comprehensive news overview matching dailyamardesh.com homepage.</td>
      </tr>
      <tr>
        <td><strong>2. ই-পেপার (ePaper Gallery)</strong></td>
        <td>• Multi-page navigation (১ম-৮ম পাতা)<br>• Crisp pinch-to-zoom & pan<br>• Single-tap offline edition download<br>• Direct sync with eamardesh.com</td>
        <td>Replicates the print newspaper experience digitally; high reader retention for print loyalists.</td>
      </tr>
      <tr>
        <td><strong>3. ভিডিও (Multimedia Hub)</strong></td>
        <td>• In-app streaming of Amar Desh YouTube news<br>• Category filters (National, Talkshow, Analysis)<br>• Zero ads interruption</td>
        <td>Empowers younger, mobile-first audiences who prefer video and audio journalism.</td>
      </tr>
      <tr>
        <td><strong>4. সেভ (Saved & Offline)</strong></td>
        <td>• Persistent bookmark library<br>• SQLite 7-day automatic LRU cache<br>• Full-text search across cached stories</td>
        <td>Ensures reading continuity during power cuts, transit, or rural connectivity drops.</td>
      </tr>
      <tr>
        <td><strong>5. মেনু (Catalog & Settings)</strong></td>
        <td>• 14-vertical category directory<br>• Dark Mode / Light Mode toggle<br>• Bengali typography scaling (A- / A+)<br>• HQ contact & social links</td>
        <td>Complete reader comfort, accessibility, and direct connectivity to Amar Desh publication office.</td>
      </tr>
    </tbody>
  </table>

  <h2>4. UI/UX Design System Showcase & Broadsheet Aesthetics</h2>
  <p>To honor Daily Amar Desh's legacy and broadsheet stature, CybrCraft engineered the <strong>Modern Editorial</strong> design system via the Stitch UI framework. The visual interface replaces generic startup rounded shapes with authentic newspaper parchment (<code>#FBF9F5</code>), deep printer's ink (<code>#121212</code>), Editorial Crimson (<code>#BA131A</code>), and 1px hairline rules (<code>#E5E0D8</code>). The showcase below presents the actual high-fidelity mobile application screens designed for Daily Amar Desh:</p>

  <div class="screens-grid">
    <div class="screen-card">
      <div class="screen-img-box">
        <img src="{home_b64}" alt="Broadsheet Home Feed" class="screen-img">
      </div>
      <div class="screen-info">
        <div class="screen-title">Figure 3: Broadsheet Home Feed</div>
        <div class="screen-desc">Live masthead, breaking news ticker, lead hero splash, and 14-vertical category carousel chips.</div>
      </div>
    </div>
    <div class="screen-card">
      <div class="screen-img-box">
        <img src="{reader_b64}" alt="Narrative Article Reader" class="screen-img">
      </div>
      <div class="screen-info">
        <div class="screen-title">Figure 4: Narrative Article Reader</div>
        <div class="screen-desc">Book-grade typography (Newsreader / Noto Serif), 3-point AI smart summary, and bracketed author bylines.</div>
      </div>
    </div>
    <div class="screen-card">
      <div class="screen-img-box">
        <img src="{epaper_b64}" alt="Digital ePaper & Saved Edition" class="screen-img">
      </div>
      <div class="screen-info">
        <div class="screen-title">Figure 5: Digital ePaper & Saved Edition</div>
        <div class="screen-desc">High-resolution print replica canvas with 1px column hotspot crop reading and offline download.</div>
      </div>
    </div>
    <div class="screen-card">
      <div class="screen-img-box">
        <img src="{explore_b64}" alt="Sections Directory & Topics Hub" class="screen-img">
      </div>
      <div class="screen-info">
        <div class="screen-title">Figure 6: Sections Directory & Topics Hub</div>
        <div class="screen-desc">Complete 14-vertical newsroom directory, district picker, AI assistant settings, and multi-language controls.</div>
      </div>
    </div>
  </div>

  <h2>5. Project Timeline & 3-Week Rapid Roadmap</h2>
  <p>Because CybrCraft has already engineered and verified the frontend and mobile architecture in the Demo PoC, the standard development timeline of 3 to 4 months is compressed down to an express 3-week delivery window:</p>

  <div class="diagram-container">
    <img src="{road_b64}" alt="Project Timeline Roadmap" class="diagram-img">
    <div class="caption">Figure 7: 3-Week Express Delivery Schedule & Milestones</div>
  </div>

  <h2>6. Commercial Engagement Options</h2>
  <table>
    <thead>
      <tr>
        <th>Engagement Model</th>
        <th>Scope & Deliverables</th>
        <th>Commercial Terms</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Option A: Turnkey Ownership (Recommended)</strong></td>
        <td>• Full Android & iOS production builds<br>• Official CMS/backend API integration<br>• Automated push notification poller setup<br>• 100% full source code & GitHub handover<br>• 3 months complimentary warranty & bug fixes</td>
        <td style="color:#b91c1c; font-weight:700;">One-time: BDT 3,50,000<br><span style="font-size:11px; color:#64748b;">(Three Lakh Fifty Thousand Taka)</span></td>
      </tr>
      <tr>
        <td><strong>Option B: Turnkey + Annual Retainer</strong></td>
        <td>• Everything in Option A<br>• Monthly OS updates (Android 15/16, iOS 18/19)<br>• 24/7 backend API & push notification monitoring<br>• Guaranteed 4-hour SLA for critical issues</td>
        <td style="color:#b91c1c; font-weight:700;">BDT 2,50,000 Upfront<br>+ BDT 25,000 / month</td>
      </tr>
      <tr>
        <td><strong>Option C: Strategic Media Partnership</strong></td>
        <td>• Zero upfront development fee<br>• CybrCraft integrates, develops and maintains app<br>• Monetization via Amar Desh direct ad campaigns<br>• Shared revenue distribution agreement</td>
        <td style="color:#166534; font-weight:700;">BDT 0 Upfront<br><span style="font-size:11px; color:#64748b;">(Ad-Revenue Share Agreement)</span></td>
      </tr>
    </tbody>
  </table>

  <h2 class="bengali">৭. সম্পাদকীয় বোর্ড ও জনাব মাহমুদুর রহমান-এর সমীপে নিবেদন</h2>
  <p class="bengali-p"><strong>শ্রদ্ধেয় সম্পাদক ও প্রকাশক মহোদয়,</strong><br>
  ‘স্বাধীনতার কথা বলে’— আপসহীন সাংবাদিকতার প্রতীক ‘দৈনিক আমার দেশ’ দীর্ঘ সংগ্রাম ও জুলাই ২০২৪-এর ঐতিহাসিক গণঅভ্যুত্থানের পর কোটি পাঠকের হৃদয়ে পুনরুজ্জীবিত হয়েছে। স্বাধীন বাংলাদেশের মুক্ত চিন্তার অগ্রযাত্রায় আপনার বলিষ্ঠ নেতৃত্ব অনস্বীকার্য।</p>
  <p class="bengali-p">বর্তমানে গুগল প্লে-স্টোর কিংবা অ্যাপল অ্যাপ স্টোরে দৈনিক আমার দেশ-এর কোনো অফিসিয়াল মোবাইল অ্যাপ্লিকেশন না থাকায় পাঠকদের জন্য ব্রেকিং নিউজ পুশ অ্যালার্ট এবং অফলাইন রিডিং নিশ্চিত করা সম্ভব হচ্ছে না। সাইবারক্রাফট (CybrCraft) শুধুমাত্র কোনো তাত্ত্বিক পরিকল্পনা নয়, বরং সরাসরি ফোনে ব্যবহারযোগ্য একটি পূর্ণাঙ্গ পরীক্ষামূলক অ্যান্ড্রয়েড ডেমো এপিকে (Demo APK) তৈরি সম্পন্ন করেছে।</p>
  <p class="bengali-p">প্রকল্প চূড়ান্তকরণের পর অ্যাপটি কোনো স্ক্র্যাপিং করবে না; বরং ‘দৈনিক আমার দেশ’-এর অফিসিয়াল ব্যাকএন্ড/সিএমএস-এর সাথে সরাসরি ও সুরক্ষিত এপিআই-এর মাধ্যমে যুক্ত হবে। আপনার বার্তা দলের কোনো বাড়তি কাজ করতে হবে না—ওয়েবে সংবাদ প্রকাশিত হওয়ার সাথে সাথে তা স্বয়ংক্রিয়ভাবে অ্যাপে চলে আসবে। ব্যাকএন্ডে কোনো টেক স্ট্যাক আপগ্রেডেশন প্রয়োজন হলে তা-ও সাইবারক্রাফট বাস্তবায়ন করবে। আমরা কারওয়ান বাজারের ঢাকা ট্রেড সেন্টারে আপনার কার্যালয়ে সশরীরে উপস্থিত হয়ে মাত্র ১৫ মিনিটের একটি সংক্ষিপ্ত লাইভ ডেমো প্রদর্শনের সুযোগ প্রার্থনা করছি।</p>

  <div class="contact-grid">
    <div class="contact-col">
      <h4>CYBRCRAFT LEADERSHIP:</h4>
      <strong>Agency:</strong> CybrCraft (https://cybrcraft.com/)<br>
      <strong>Email:</strong> info@cybrcraft.com<br>
      <strong>Mobile / WhatsApp:</strong> +880 1967-600402<br>
      <strong>Office:</strong> Bashundhara Riverview, Dhaka, Bangladesh
    </div>
    <div class="contact-col highlight">
      <h4>TARGET CLIENT OFFICE:</h4>
      <strong>Client:</strong> Amar Desh Publication Limited<br>
      <strong>Editor:</strong> Mahmudur Rahman (মাহমুদুর রহমান)<br>
      <strong>Office:</strong> Dhaka Trade Centre (8th Floor), Karwan Bazar<br>
      <strong>IT Dept:</strong> +880-1332-837513 | <strong>Email:</strong> info@dailyamardesh.com
    </div>
  </div>
</div>

</body>
</html>
"""

    out_file = 'docs/Daily_Amar_Desh_Mobile_App_Proposal_CybrCraft.html'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully generated HTML proposal: {out_file} ({os.path.getsize(out_file)} bytes)")

if __name__ == '__main__':
    build_html_proposal()
