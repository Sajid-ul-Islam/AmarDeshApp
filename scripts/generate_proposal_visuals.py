import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

os.makedirs('assets/proposal', exist_ok=True)

# Use standard universal fonts that render flawlessly without any font corruption
plt.rcParams['font.sans-serif'] = ['Segoe UI', 'Arial', 'Helvetica', 'DejaVu Sans']
plt.rcParams['font.family'] = 'sans-serif'

# -------------------------------------------------------------
# 1. DIGITAL PERFORMANCE & ENGAGEMENT BENCHMARK CHART
# -------------------------------------------------------------
def generate_comparison_chart():
    fig, ax = plt.subplots(figsize=(10.5, 5.2), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    labels = [
        'Breaking News Push\nReach (%)',
        'Offline Reading\nAvailability (%)',
        '30-Day Reader\nRetention (%)',
        'Daily Session\nLength (Minutes)',
        'Direct Reader\nLoyalty Index (/10)'
    ]
    web_scores = [0, 0, 15, 1.8, 3.8]
    app_scores = [98, 100, 68, 7.5, 9.6]

    x = np.arange(len(labels))
    width = 0.35

    rects1 = ax.bar(x - width/2, web_scores, width, label='Mobile Web Browser (dailyamardesh.com)',
                    color='#94a3b8', edgecolor='#64748b', linewidth=1.2, zorder=3)
    rects2 = ax.bar(x + width/2, app_scores, width, label='Official Native Mobile App (Direct Channel)',
                    color='#ba131a', edgecolor='#880d12', linewidth=1.2, zorder=3)

    ax.set_ylabel('Digital Performance & Reader Retention', fontsize=11, fontweight='bold', color='#1e293b')
    ax.set_title('Digital Media Benchmark: Mobile Web Browser vs. Official Mobile App',
                 fontsize=13, fontweight='bold', color='#0f172a', pad=24)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=10, fontweight='600', color='#334155')
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#cbd5e1', fontsize=9.5, loc='upper center', bbox_to_anchor=(0.5, 1.08), ncol=2)
    ax.grid(axis='y', linestyle='--', alpha=0.5, color='#cbd5e1', zorder=0)
    ax.set_ylim(0, 120)

    for rect in rects1:
        h = rect.get_height()
        ax.annotate(f'{h}',
                    xy=(rect.get_x() + rect.get_width() / 2, h),
                    xytext=(0, 4), textcoords="offset points",
                    ha='center', va='bottom', fontsize=9, fontweight='bold', color='#64748b')

    for rect in rects2:
        h = rect.get_height()
        ax.annotate(f'{h}',
                    xy=(rect.get_x() + rect.get_width() / 2, h),
                    xytext=(0, 4), textcoords="offset points",
                    ha='center', va='bottom', fontsize=9, fontweight='bold', color='#ba131a')

    for spine in ['top', 'right', 'left', 'bottom']:
        ax.spines[spine].set_color('#e2e8f0')

    plt.tight_layout()
    outpath = 'assets/proposal/engagement_comparison.png'
    plt.savefig(outpath, bbox_inches='tight')
    plt.close()
    print(f'Generated: {outpath}')

# -------------------------------------------------------------
# 2. STRATEGIC GROWTH & NEWSPAPER ADAPTATION FRAMEWORK
# -------------------------------------------------------------
def generate_growth_framework_diagram():
    fig, ax = plt.subplots(figsize=(11.5, 6.6), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')
    ax.set_xlim(0, 11.5)
    ax.set_ylim(0, 6.6)
    ax.axis('off')

    # Main Title & Executive Subtitle
    ax.text(5.75, 6.2, 'Daily Amar Desh: Strategic Growth & Modern Media Adaptation Framework',
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(5.75, 5.8, 'Sustaining Independent Editorial Leadership, Reaching Next-Gen Audiences & Maximizing Commercial Value',
            ha='center', va='center', fontsize=10, color='#64748b')

    # 4 Pillar Cards
    pillars = [
        {
            'x': 0.5, 'w': 2.4, 'title': '1. AUDIENCE SOVEREIGNTY',
            'sub': 'Escape Big Tech Feeds',
            'color': '#ba131a', 'bg': '#fef2f2',
            'points': [
                '• Direct pipeline to 1M+ pockets',
                '• Immune to algorithm throttling',
                '• Real-time breaking news push',
                '• Uncensorable editorial voice',
                '• Total reader ownership'
            ]
        },
        {
            'x': 3.2, 'w': 2.4, 'title': '2. NEXT-GEN ADAPTATION',
            'sub': 'Engaging Gen-Z & Youth',
            'color': '#2563eb', 'bg': '#eff6ff',
            'points': [
                '• July 2024 youth alignment',
                '• Commuter audio news briefs',
                '• Modern visual storytelling',
                '• Sub-second mobile response',
                '• Daily prayer & district focus'
            ]
        },
        {
            'x': 5.9, 'w': 2.4, 'title': '3. GLOBAL DIASPORA',
            'sub': 'UK, US, Gulf & Worldwide',
            'color': '#0d9488', 'bg': '#f0fdfa',
            'points': [
                '• High-res morning ePaper replica',
                '• Global real-time homeland alerts',
                '• Bridge diaspora to Dhaka daily',
                '• International reader loyalty',
                '• Unrestricted overseas access'
            ]
        },
        {
            'x': 8.6, 'w': 2.4, 'title': '4. COMMERCIAL GROWTH',
            'sub': 'Sustainable Revenue Streams',
            'color': '#7c3aed', 'bg': '#f5f3ff',
            'points': [
                '• Premium native splash sponsors',
                '• High-yield digital ad inventory',
                '• Zero cuts to Big Tech platforms',
                '• ePaper subscriptions & patrons',
                '• Direct advertiser partnerships'
            ]
        }
    ]

    for p in pillars:
        # Card Background
        rect = patches.FancyBboxPatch((p['x'], 1.4), p['w'], 3.9, boxstyle="round,pad=0.15",
                                      facecolor=p['bg'], edgecolor=p['color'], linewidth=1.6)
        ax.add_patch(rect)

        # Header Badge
        cx = p['x'] + p['w'] / 2.0
        ax.text(cx, 4.95, p['title'], ha='center', va='center', fontsize=10, fontweight='bold', color=p['color'])
        ax.text(cx, 4.65, p['sub'], ha='center', va='center', fontsize=8.5, fontstyle='italic', color='#475569')

        # Divider line
        ax.plot([p['x'] + 0.2, p['x'] + p['w'] - 0.2], [4.4, 4.4], color=p['color'], alpha=0.3, linewidth=1)

        # Points
        body_text = '\n\n'.join(p['points'])
        ax.text(p['x'] + 0.2, 3.0, body_text, ha='left', va='center', fontsize=8.5, color='#1e293b', linespacing=1.2)

    # Bottom Foundation Box: Operational Harmony
    foundation_box = patches.FancyBboxPatch((0.5, 0.25), 10.5, 0.85, boxstyle="round,pad=0.12",
                                           facecolor='#f8fafc', edgecolor='#94a3b8', linewidth=1.2)
    ax.add_patch(foundation_box)

    ax.text(5.75, 0.78, 'FOUNDATIONAL PILLAR: ZERO EDITORIAL FRICTION & 100% AUTOMATED NEWSROOM WORKFLOW',
            ha='center', va='center', fontsize=9.5, fontweight='bold', color='#0f172a')
    ax.text(5.75, 0.45, 'Amar Desh editors publish as usual on your existing web portal. Content instantaneously syncs to mobile with zero manual overhead.',
            ha='center', va='center', fontsize=8.5, color='#475569')

    plt.tight_layout()
    outpath = 'assets/proposal/newspaper_growth_framework.png'
    plt.savefig(outpath, bbox_inches='tight')
    plt.close()
    print(f'Generated: {outpath}')

# -------------------------------------------------------------
# 3. 3-WEEK RAPID DELIVERY ROADMAP GANTT
# -------------------------------------------------------------
def generate_roadmap_chart():
    fig, ax = plt.subplots(figsize=(10.5, 4.4), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    tasks = [
        'Phase 1: Project Alignment & Newsroom Workflow Setup',
        'Phase 2: Automated Content Sync & Push Notification Verification',
        'Phase 3: Editorial Board Review & Executive Demonstration',
        'Phase 4: Store Compliance, Brand Verification & Security Sign-off',
        'Phase 5: Official Launch on Google Play Store & Apple App Store'
    ]

    starts = [0, 2, 5, 8, 11]
    durations = [3, 4, 4, 3, 4]
    colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#10b981']

    y_pos = np.arange(len(tasks))

    for i in range(len(tasks)):
        ax.barh(y_pos[i], durations[i], left=starts[i], height=0.45,
                color=colors[i], edgecolor='#334155', linewidth=0.8, zorder=3)
        ax.text(starts[i] + durations[i]/2, y_pos[i], f'{durations[i]} Days',
                ha='center', va='center', color='#ffffff', fontweight='bold', fontsize=8.5)

    ax.set_yticks(y_pos)
    ax.set_yticklabels(tasks, fontsize=9.5, fontweight='bold', color='#1e293b')
    ax.invert_yaxis()

    ax.set_xlabel('Project Timeline (Days 1 to 15 / 3 Business Weeks)', fontsize=11, fontweight='bold', color='#1e293b', labelpad=10)
    ax.set_title('Rapid 3-Week Executive Implementation & Official Store Launch Schedule', fontsize=13, fontweight='bold', color='#0f172a', pad=22)
    ax.set_xlim(0, 16)
    ax.set_xticks(range(0, 17, 2))
    ax.set_xticklabels([f'Day {i}' for i in range(0, 17, 2)], fontsize=9, color='#475569')

    # Week Dividers
    ax.axvline(5, color='#cbd5e1', linestyle='--', linewidth=1.5, zorder=2)
    ax.text(2.5, -0.65, 'WEEK 1: Kickoff & Setup', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#3b82f6')

    ax.axvline(10, color='#cbd5e1', linestyle='--', linewidth=1.5, zorder=2)
    ax.text(7.5, -0.65, 'WEEK 2: Board Review', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#8b5cf6')

    ax.text(13.0, -0.65, 'WEEK 3: Official Launch', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#10b981')

    ax.grid(axis='x', linestyle=':', alpha=0.6, color='#94a3b8', zorder=0)

    for spine in ['top', 'right', 'left', 'bottom']:
        ax.spines[spine].set_color('#e2e8f0')

    plt.tight_layout()
    outpath = 'assets/proposal/timeline_roadmap.png'
    plt.savefig(outpath, bbox_inches='tight')
    plt.close()
    print(f'Generated: {outpath}')

if __name__ == '__main__':
    generate_comparison_chart()
    generate_growth_framework_diagram()
    generate_roadmap_chart()
