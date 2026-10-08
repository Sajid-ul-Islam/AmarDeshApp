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

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Official Mobile App Proposal — Daily Amar Desh | CybrCraft</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@400;600;700&display=swap');

  :root {{
    --primary: #ba131a;
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
    line-height: 1.55;
    padding: 30px 15px;
  }}

  .paper {{
    max-width: 860px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    border-radius: 10px;
    padding: 45px 50px;
  }}

  .header-logos {{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border);
    padding-bottom: 18px;
    margin-bottom: 20px;
  }}
  .logo-img {{
    max-height: 44px;
    width: auto;
    object-fit: contain;
  }}

  .accent-bar {{
    height: 5px;
    background: #ba131a;
    border-radius: 3px;
    margin-bottom: 20px;
  }}

  h1 {{
    font-size: 24px;
    font-weight: 800;
    color: var(--dark);
    line-height: 1.2;
    margin-bottom: 4px;
  }}
  .subtitle {{
    font-size: 13.5px;
    color: var(--muted);
    margin-bottom: 20px;
  }}

  .meta-grid {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    background: var(--light-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px 18px;
    margin-bottom: 25px;
    font-size: 12.5px;
  }}
  .meta-item strong {{
    display: block;
    color: var(--dark);
    font-size: 10.5px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 2px;
  }}

  h2 {{
    font-size: 17px;
    font-weight: 700;
    color: var(--primary);
    margin-top: 28px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 6px;
  }}
  h2.bengali {{
    font-family: 'Noto Serif Bengali', serif;
  }}

  p {{
    font-size: 13.5px;
    margin-bottom: 12px;
    color: #334155;
    line-height: 1.6;
  }}
  .bengali-p {{
    font-family: 'Noto Serif Bengali', serif;
    font-size: 14px;
    line-height: 1.75;
    color: #1e293b;
  }}

  ul {{
    margin: 0 0 16px 20px;
    font-size: 13.5px;
    line-height: 1.6;
  }}
  li {{ margin-bottom: 6px; }}

  .stat-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin: 18px 0 24px;
  }}
  .stat-card {{
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 12px 8px;
    text-align: center;
  }}
  .stat-card .num {{
    font-size: 18px;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 4px;
  }}
  .stat-card .lbl {{
    font-size: 11px;
    color: #7f1d1d;
    font-weight: 600;
  }}

  .callout {{
    padding: 14px 18px;
    border-radius: 6px;
    margin: 16px 0;
    font-size: 13px;
    line-height: 1.5;
  }}
  .callout.green {{
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    color: #14532d;
  }}
  .callout.indigo {{
    background: #eef2ff;
    border-left: 4px solid #4f46e5;
    color: #1e1b4b;
  }}

  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 20px;
    font-size: 12.5px;
  }}
  th {{
    background: var(--dark);
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 9px 12px;
  }}
  td {{
    padding: 9px 12px;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }}
  tr:nth-child(even) td {{
    background: var(--light-bg);
  }}

  .contact-box {{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid var(--border);
    font-size: 12.5px;
  }}
  .contact-col {{
    background: var(--light-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 14px;
  }}
  .contact-col.hl {{
    background: #fef2f2;
    border-color: #fecaca;
  }}
  .contact-col strong {{
    display: block;
    margin-bottom: 4px;
    color: var(--dark);
    font-size: 12px;
  }}

  @media print {{
    body {{ background: #fff; padding: 0; }}
    .paper {{ box-shadow: none; border-radius: 0; padding: 15px 20px; }}
    .page-break {{ page-break-before: always; }}
  }}
</style>
</head>
<body>

<div class="paper">
  <div class="header-logos">
    <img src="{cybr_b64}" alt="CybrCraft Logo" class="logo-img">
    <img src="{ad_b64}" alt="Daily Amar Desh Logo" class="logo-img">
  </div>

  <div class="accent-bar"></div>

  <h1>OFFICIAL MOBILE APP PROPOSAL</h1>
  <div class="subtitle">Daily Amar Desh (দৈনিক আমার দেশ) | Straightforward Executive Pitch</div>

  <div class="meta-grid">
    <div class="meta-item">
      <strong>PREPARED FOR:</strong>
      Mr. Mahmudur Rahman (Editor & Publisher)<br>
      Amar Desh Publication Ltd | Karwan Bazar, Dhaka
    </div>
    <div class="meta-item">
      <strong>PREPARED BY:</strong>
      CybrCraft (https://cybrcraft.com/)<br>
      WhatsApp: +880 1967-600402 | Email: info@cybrcraft.com
    </div>
    <div class="meta-item">
      <strong>PROPOSAL REF:</strong>
      CC-AMARDESH-2026-V2
    </div>
    <div class="meta-item">
      <strong>DELIVERY SPEED:</strong>
      3-Week Direct Store Launch (Demo APK Ready Today)
    </div>
  </div>

  <h2>1. The Core Reality: Why Amar Desh Needs a Mobile App Today</h2>
  <p>Amar Desh represents the voice of truth and resistance (<em>"স্বাধীনতার কথা বলে"</em>). Following the historic July 2024 uprising and the paper’s revival, reader trust in Mahmudur Rahman and Amar Desh is at an all-time peak. However, the newspaper currently has <strong>NO official mobile app</strong> on Google Play Store or Apple App Store. Here is why that needs to change immediately:</p>

  <ul>
    <li><strong>92% of Readers are on Smartphones:</strong> People no longer buy roadside papers like before, nor do they type web URLs into mobile browsers. News is read on smartphone notifications and apps.</li>
    <li><strong>Bypass Big Tech Censorship & Algorithms:</strong> Relying on Facebook or Google means foreign algorithms decide who sees your news. They throttle political journalism and keep the ad money. A mobile app gives you a direct, uncensorable channel straight to your readers' lock-screens.</li>
    <li><strong>Reaching the Youth (Gen-Z):</strong> The student generation that led the revolution respects Amar Desh, but they consume news in seconds on mobile—via instant breaking alerts and audio briefs. Without an app, you lose this generation to unverified social media rumors.</li>
    <li><strong>Serving the Global Diaspora:</strong> Millions of Bangladeshis in the UK, USA, and Middle East want to read Amar Desh every morning. Physical paper cannot reach them abroad; a mobile app delivers the morning ePaper replica instantly.</li>
    <li><strong>Eliminating Fake Scam Apps:</strong> Because Amar Desh doesn't have an official app, unauthorized clone apps on Google Play are misusing your masthead and profiting off your name. An official app reclaims your brand.</li>
  </ul>

  <div class="stat-grid">
    <div class="stat-card">
      <div class="num">92%+</div>
      <div class="lbl">Mobile News Readers</div>
    </div>
    <div class="stat-card">
      <div class="num">1,000,000+</div>
      <div class="lbl">Direct Lock-Screen Push</div>
    </div>
    <div class="stat-card">
      <div class="num">0 Extra Work</div>
      <div class="lbl">For Newsroom Staff</div>
    </div>
    <div class="stat-card">
      <div class="num">100% Owned</div>
      <div class="lbl">Full Source Code & IP</div>
    </div>
  </div>

  <div class="page-break"></div>

  <h2>2. What We Deliver: Simple, Automated & Live Today</h2>

  <div class="callout green">
    <strong>★ WE ALREADY BUILT THE DEMO — TEST IT ON YOUR PHONE TODAY:</strong><br>
    We don't pitch abstract slideshows. CybrCraft has already engineered a fully working Android app with real Amar Desh news. Mr. Mahmudur Rahman and your board can install the APK and test it on your personal phones today.
  </div>

  <div class="callout indigo">
    <strong>ZERO EXTRA WORK FOR YOUR EDITORS:</strong><br>
    Your journalists do NOT need to learn anything new. They post news to your website (<em>dailyamardesh.com</em>) as usual. Our system automatically and instantly updates the app and sends breaking push alerts in seconds.
  </div>

  <p><strong>The 4 Core Things Readers Get in the App:</strong></p>
  <ul>
    <li><strong>1. Instant Breaking News Alerts:</strong> Send urgent news flashes directly to 1,000,000+ reader lock-screens the moment big news breaks.</li>
    <li><strong>2. Digital ePaper Reader (১ম-৮ম পাতা):</strong> Crisp digital replica of the full print paper for diaspora and traditional print readers.</li>
    <li><strong>3. Commuter Audio News (অডিও সংবাদ):</strong> Readers can listen to news hands-free through earphones while stuck in Dhaka traffic.</li>
    <li><strong>4. 7-Day Offline Reading:</strong> Articles save automatically so people can read during power cuts, travel, or rural network drops.</li>
  </ul>

  <table>
    <thead>
      <tr>
        <th>Key Capability</th>
        <th>Current Mobile Web</th>
        <th>CybrCraft Official Mobile App</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Breaking Alerts</strong></td>
        <td>None. Readers must manually visit the site.</td>
        <td style="color:#ba131a; font-weight:600;">Instant push alerts to lock-screens in seconds.</td>
      </tr>
      <tr>
        <td><strong>Offline Reading</strong></td>
        <td>Zero. Shows "No Internet Connection" error.</td>
        <td style="color:#ba131a; font-weight:600;">Automatically readable offline without internet.</td>
      </tr>
      <tr>
        <td><strong>ePaper Experience</strong></td>
        <td>Slow PDF zooming in mobile browser.</td>
        <td style="color:#ba131a; font-weight:600;">Smooth page-flip viewer (১ম-৮ম পাতা) with zoom.</td>
      </tr>
      <tr>
        <td><strong>Audio News</strong></td>
        <td>None. Requires reading small screens.</td>
        <td style="color:#ba131a; font-weight:600;">Natural Bengali speech reader for Dhaka commutes.</td>
      </tr>
      <tr>
        <td><strong>Brand Protection</strong></td>
        <td>Rogue clone apps exploit your trademark.</td>
        <td style="color:#ba131a; font-weight:600;">Official verified publisher profile certified by Amar Desh.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <h2>3. Clear Commercial Pricing & 3-Week Delivery</h2>

  <table>
    <thead>
      <tr>
        <th>Option</th>
        <th>What's Included</th>
        <th>Investment</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Option A: Turnkey Handover</strong><br><em>(Recommended)</em></td>
        <td>• Full Android & iOS Apps<br>• Automated sync with web portal<br>• Breaking push notification setup<br>• 100% source code & GitHub handover<br>• Complete IP ownership under Amar Desh<br>• 3 months free support & bug fixes</td>
        <td style="color:#ba131a; font-weight:700;">BDT 3,50,000<br><span style="font-size:11px; color:#64748b;">(One-Time) *Negotiable</span></td>
      </tr>
      <tr>
        <td><strong>Option B: Turnkey + Management</strong></td>
        <td>• Everything in Option A<br>• Ongoing store updates & 24/7 monitoring<br>• Guaranteed 4-hour fix SLA</td>
        <td style="color:#ba131a; font-weight:700;">BDT 2,50,000<br>+<br>BDT 25,000 / month</td>
      </tr>
      <tr>
        <td><strong>Option C: Ad Revenue Share</strong></td>
        <td>• Zero upfront development fees<br>• CybrCraft builds and maintains<br>• Monetized via Amar Desh Ad Desk campaigns</td>
        <td style="color:#ba131a; font-weight:700;">BDT 0 Upfront<br><span style="font-size:11px; color:#64748b;">(Revenue Share)</span></td>
      </tr>
    </tbody>
  </table>

  <p style="font-size:12.5px; color:#475569; margin-bottom:18px;">
    <strong>Express 3-Week Launch:</strong> Week 1: Automated sync setup &nbsp;|&nbsp; Week 2: Testing on your phones &nbsp;|&nbsp; Week 3: Official Google Play & App Store launch.
  </p>

  <h2 class="bengali">৪. সম্পাদকীয় বোর্ড ও জনাব মাহমুদুর রহমান-এর সমীপে বিনীত নিবেদন</h2>
  <div class="bengali-p">
    <p>শ্রদ্ধেয় সম্পাদক মহোদয়,<br>
    দেশের শতকরা ৯২ ভাগেরও বেশি পাঠক এখন মোবাইলে খবর পড়েন। গুগল প্লে-স্টোর কিংবা অ্যাপল অ্যাপ স্টোরে দৈনিক আমার দেশ-এর নিজস্ব অফিসিয়াল অ্যাপ না থাকায় কোটি পাঠকের কাছে তাৎক্ষণিক ব্রেকিং নিউজ পৌঁছানো যাচ্ছে না এবং সোশ্যাল মিডিয়ার অ্যালগরিদম সংবাদ আটকে দিচ্ছে। একটি নিজস্ব মোবাইল অ্যাপ ‘দৈনিক আমার দেশ’-কে সরাসরি পাঠকের হাতের মুঠোয় পৌঁছে দেবে, যেখানে কোনো মধ্যস্বত্বভোগীর সেন্সরশিপ থাকবে না।</p>
    <p>সবচেয়ে বড় বিষয়—আপনার বার্তা বিভাগের সাংবাদিকদের কোনো বাড়তি কাজ করতে হবে না; ওয়েবসাইটে খবর প্রকাশের সাথে সাথে তা স্বয়ংক্রিয়ভাবে অ্যাপে চলে আসবে। আমরা কোনো তাত্ত্বিক স্লাইড নয়, বরং সরাসরি ফোনে ব্যবহারযোগ্য একটি পূর্ণাঙ্গ লাইভ ডেমো অ্যাপ তৈরি সম্পন্ন করেছি। আপনার কার্যালয়ে সশরীরে উপস্থিত হয়ে মাত্র ১৫ মিনিটে আপনার ফোনে ডেমো প্রদর্শনের সুযোগ প্রার্থনা করছি।</p>
  </div>

  <div class="contact-box">
    <div class="contact-col">
      <strong>NEXT STEP:</strong>
      Schedule a 15-minute live demo at your Karwan Bazar office (Dhaka Trade Centre, 8th Floor) to test the working APK on your smartphone.
    </div>
    <div class="contact-col hl">
      <strong style="color:#ba131a;">CONTACT CYBRCRAFT:</strong>
      WhatsApp / Call: +880 1967-600402<br>
      Email: info@cybrcraft.com | Web: <a href="https://cybrcraft.com/" target="_blank">https://cybrcraft.com/</a><br>
      Office: Bashundhara Riverview, Dhaka
    </div>
  </div>

  <div style="margin-top: 25px; padding-top: 12px; border-top: 1px solid var(--border); font-size: 11.5px; color: var(--muted);">
    <strong>Team CybrCraft</strong> | Enterprise Mobile Solutions | Bashundhara Riverview, Dhaka, Bangladesh
  </div>
</div>

</body>
</html>"""

    out_file = 'docs/Daily_Amar_Desh_Mobile_App_Proposal_CybrCraft.html'
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Successfully generated clean HTML proposal: {out_file} ({os.path.getsize(out_file)} bytes)")

if __name__ == '__main__':
    build_html_proposal()
