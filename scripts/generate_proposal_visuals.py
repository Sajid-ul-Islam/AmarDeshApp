import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import os

os.makedirs('assets/proposal', exist_ok=True)

# Set high-quality font stack with Nirmala UI (supports Bengali & English) and Segoe UI
plt.rcParams['font.sans-serif'] = ['Nirmala UI', 'Segoe UI', 'Arial', 'DejaVu Sans']
plt.rcParams['font.family'] = 'sans-serif'

# -------------------------------------------------------------
# 1. ENGAGEMENT & RETENTION COMPARISON CHART
# -------------------------------------------------------------
def generate_comparison_chart():
    fig, ax = plt.subplots(figsize=(10, 5.2), dpi=300)
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
    rects2 = ax.bar(x + width/2, app_scores, width, label='Official Native Mobile App (CybrCraft Solution)',
                    color='#dc2626', edgecolor='#991b1b', linewidth=1.2, zorder=3)

    ax.set_ylabel('Digital Performance & Engagement Metric', fontsize=11, fontweight='bold', color='#1e293b')
    ax.set_title('Digital Performance Benchmark: Mobile Web Browser vs. Official Mobile App',
                 fontsize=13, fontweight='bold', color='#0f172a', pad=22)
    ax.set_xticks(x)
    ax.set_xticklabels(labels, fontsize=10, fontweight='600', color='#334155')
    ax.legend(frameon=True, facecolor='#ffffff', edgecolor='#cbd5e1', fontsize=9.5, loc='upper left')
    ax.grid(axis='y', linestyle='--', alpha=0.5, color='#cbd5e1', zorder=0)
    ax.set_ylim(0, 115)

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
                    ha='center', va='bottom', fontsize=9, fontweight='bold', color='#b91c1c')

    for spine in ['top', 'right', 'left', 'bottom']:
        ax.spines[spine].set_color('#e2e8f0')

    plt.tight_layout()
    outpath = 'assets/proposal/engagement_comparison.png'
    plt.savefig(outpath, bbox_inches='tight')
    plt.close()
    print(f'Generated: {outpath}')

# -------------------------------------------------------------
# 2. SYSTEM ARCHITECTURE & DATA FLOW DIAGRAM (UPDATED: SECURE CMS INTEGRATION)
# -------------------------------------------------------------
def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(11, 6.4), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#ffffff')
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 6.4)
    ax.axis('off')

    # Draw Title
    ax.text(5.5, 6.0, 'Daily Amar Desh Mobile App: Secure Official Backend Architecture',
            ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')
    ax.text(5.5, 5.6, 'Zero Extra Newsroom Effort — Automated Sync with Amar Desh CMS & Backend APIs',
            ha='center', va='center', fontsize=10, color='#64748b')

    # Box 1: Sources (Left)
    rect1 = patches.FancyBboxPatch((0.4, 1.3), 2.6, 3.8, boxstyle="round,pad=0.2",
                                  facecolor='#f8fafc', edgecolor='#94a3b8', linewidth=1.5)
    ax.add_patch(rect1)
    ax.text(1.7, 4.7, 'Amar Desh Newsroom & CMS', ha='center', va='center', fontsize=11, fontweight='bold', color='#1e293b')
    ax.text(1.7, 3.6, '• Existing Web CMS / Backend\n  (Editors Publish as Usual)\n\n• Zero Manual App Work\n  (100% Automated Ingestion)\n\n• ePaper Scans (eamardesh)\n\n• Verified Multimedia Feed\n\n• Optional Stack Upgrades\n  (API/Webhooks by CybrCraft)',
            ha='center', va='center', fontsize=9, color='#334155', linespacing=1.3)

    # Box 2: Processing Core (Center)
    rect2 = patches.FancyBboxPatch((4.0, 1.3), 3.0, 3.8, boxstyle="round,pad=0.2",
                                  facecolor='#eef2ff', edgecolor='#6366f1', linewidth=1.8)
    ax.add_patch(rect2)
    ax.text(5.5, 4.7, 'Secure Sync & Core Engine', ha='center', va='center', fontsize=11, fontweight='bold', color='#3730a3')
    ax.text(5.5, 3.6, '• Official Secure REST API Layer\n  (Token / API Key Authenticated)\n\n• Automated Webhooks & Poller\n  (Zero-Delay Publishing Sync)\n\n• SQLite Database Cache\n  (7-Day Full-Text Offline Index)\n\n• Bengali Audio TTS Engine\n\n• 8-Division Prayer & Hijri Logic',
            ha='center', va='center', fontsize=9, color='#1e1b4b', linespacing=1.3)

    # Box 3: User Experience Hubs (Right)
    rect3 = patches.FancyBboxPatch((8.0, 1.3), 2.6, 3.8, boxstyle="round,pad=0.2",
                                  facecolor='#fef2f2', edgecolor='#dc2626', linewidth=1.8)
    ax.add_patch(rect3)
    ax.text(9.3, 4.7, '5 Native App Hubs', ha='center', va='center', fontsize=11, fontweight='bold', color='#991b1b')
    ax.text(9.3, 3.6, '1. Home Feed (হোম)\n2. ePaper Viewer (ই-পেপার)\n3. Video Hub (ভিডিও)\n4. Saved Articles (সেভ)\n5. Full Menu (মেনু)\n\n+ July Revolution Portal\n+ Breaking News Ticker\n+ Bengali Speech Reader',
            ha='center', va='center', fontsize=9, color='#7f1d1d', linespacing=1.3)

    # Connection Arrows
    ax.annotate('', xy=(3.9, 3.2), xytext=(3.0, 3.2),
                arrowprops=dict(facecolor='#6366f1', edgecolor='#4338ca', arrowstyle='simple,tail_width=1.5,head_width=5,head_length=5', lw=1))
    ax.text(3.45, 3.5, 'Official Secure API\n& Webhooks', ha='center', va='bottom', fontsize=8, fontweight='bold', color='#4338ca')

    ax.annotate('', xy=(7.9, 3.2), xytext=(7.0, 3.2),
                arrowprops=dict(facecolor='#dc2626', edgecolor='#b91c1c', arrowstyle='simple,tail_width=1.5,head_width=5,head_length=5', lw=1))
    ax.text(7.45, 3.5, 'Instant Sync to\nNative Mobile UI', ha='center', va='bottom', fontsize=8, fontweight='bold', color='#b91c1c')

    # Bottom Banner: Two-Phase Strategy
    rect4 = patches.FancyBboxPatch((0.5, 0.2), 10.0, 0.75, boxstyle="round,pad=0.15",
                                  facecolor='#f0fdf4', edgecolor='#16a34a', linewidth=1.4)
    ax.add_patch(rect4)
    ax.text(5.5, 0.68, 'TWO-PHASE EVOLUTION: PHASE 1 (LIVE NOW): Interactive Demo PoC for Testing & Board Review',
            ha='center', va='center', fontsize=8.5, fontweight='bold', color='#166534')
    ax.text(5.5, 0.38, 'PHASE 2 (POST-CONFIRMATION): Official Secure Backend/CMS Integration + FCM Push + Zero Extra Work for Amar Desh Team',
            ha='center', va='center', fontsize=8, color='#15803d')

    plt.tight_layout()
    outpath = 'assets/proposal/architecture_diagram.png'
    plt.savefig(outpath, bbox_inches='tight')
    plt.close()
    print(f'Generated: {outpath}')

# -------------------------------------------------------------
# 3. 3-WEEK RAPID DELIVERY ROADMAP GANTT
# -------------------------------------------------------------
def generate_roadmap_chart():
    fig, ax = plt.subplots(figsize=(10, 4.4), dpi=300)
    fig.patch.set_facecolor('#ffffff')
    ax.set_facecolor('#f8fafc')

    tasks = [
        'Phase 1: Project Kickoff & Backend API Alignment',
        'Phase 2: Official Secure API & Push Integration',
        'Phase 3: Editorial Beta Testing & Editorial Audit',
        'Phase 4: Security Verification & Final Polish',
        'Phase 5: Google Play & Apple App Store Launch'
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
    ax.set_title('Rapid 3-Week Implementation & Official Store Launch Roadmap', fontsize=13, fontweight='bold', color='#0f172a', pad=15)
    ax.set_xlim(0, 16)
    ax.set_xticks(range(0, 17, 2))
    ax.set_xticklabels([f'Day {i}' for i in range(0, 17, 2)], fontsize=9, color='#475569')

    # Week Dividers
    ax.axvline(5, color='#cbd5e1', linestyle='--', linewidth=1.5, zorder=2)
    ax.text(2.5, -0.6, 'WEEK 1: API & Setup', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#3b82f6')

    ax.axvline(10, color='#cbd5e1', linestyle='--', linewidth=1.5, zorder=2)
    ax.text(7.5, -0.6, 'WEEK 2: Beta Audit', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#8b5cf6')

    ax.text(13.0, -0.6, 'WEEK 3: Launch', ha='center', va='center', fontsize=9.5, fontweight='bold', color='#10b981')

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
    generate_architecture_diagram()
    generate_roadmap_chart()
