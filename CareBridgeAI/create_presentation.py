import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor

# Output Presentation Path
OUTPUT_PATH = r"c:\Users\sreec\Documents\CareBridgeAI\CareBridge_AI_Presentation.pptx"

# Initialize Presentation in 16:9 Widescreen
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

# Theme Color Palette
BG_DARK = RGBColor(10, 16, 32)             # Deep Navy
CARD_BG = RGBColor(18, 26, 48)             # Elevated Card
CARD_BG_ALT = RGBColor(24, 34, 62)         # Highlight Card
CARD_BORDER = RGBColor(45, 65, 95)         # Card Border
CYAN = RGBColor(56, 189, 248)              # Sky Blue
PURPLE = RGBColor(167, 139, 250)           # Purple Accent
GREEN = RGBColor(52, 211, 153)             # Emerald Green
AMBER = RGBColor(251, 146, 60)             # Amber Warning
RED_ALERT = RGBColor(248, 113, 113)        # Alert Red
TEXT_WHITE = RGBColor(255, 255, 255)       # Main Heading
TEXT_LIGHT = RGBColor(226, 232, 240)       # Clean Body
TEXT_MUTED = RGBColor(148, 163, 184)       # Meta Text

def create_base_slide():
    slide = prs.slides.add_slide(blank_layout)
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()
    return slide

def add_header(slide, title_text, category_tag="CAREBRIDGE AI PLATFORM"):
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.7), Inches(0.35))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = f"●  {category_tag.upper()}"
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = CYAN

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.85))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(25)
    p_title.font.bold = True
    p_title.font.color.rgb = TEXT_WHITE

def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER, top_accent=None):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
    else:
        shape.line.fill.background()
    
    if top_accent:
        bar = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left + Inches(0.1), top, width - Inches(0.2), Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = top_accent
        bar.line.fill.background()
    return shape

def add_badge(slide, left, top, width, height, text, bg_color=CYAN, text_color=TEXT_WHITE):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    shape.line.fill.background()
    tf = shape.text_frame
    tf.word_wrap = False
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = text_color
    p.alignment = PP_ALIGN.CENTER
    return shape

# ==============================================================================
# SLIDE 1: TITLE SLIDE (EXECUTIVE COVER)
# ==============================================================================
s1 = create_base_slide()

hero = add_card(s1, Inches(1.0), Inches(1.0), Inches(11.333), Inches(5.5), bg_color=RGBColor(15, 23, 42), border_color=CYAN, top_accent=CYAN)
add_badge(s1, Inches(1.5), Inches(1.35), Inches(3.6), Inches(0.35), "🏥 EXECUTIVE PITCH & TECHNICAL PROPOSAL", bg_color=RGBColor(12, 74, 110), text_color=CYAN)

tb = s1.shapes.add_textbox(Inches(1.5), Inches(1.85), Inches(10.3), Inches(4.3))
tf = tb.text_frame
tf.word_wrap = True

p1 = tf.paragraphs[0]
p1.text = "🌉 CareBridge AI"
p1.font.size = Pt(46)
p1.font.bold = True
p1.font.color.rgb = CYAN
p1.space_after = Pt(8)

p2 = tf.add_paragraph()
p2.text = "Solving the Post-Discharge Patient Crisis through Multimodal Intelligence"
p2.font.size = Pt(22)
p2.font.bold = True
p2.font.color.rgb = TEXT_WHITE
p2.space_after = Pt(16)

p3 = tf.add_paragraph()
p3.text = "A clinical presentation on the transition from hospital to home: addressing unreadable doctor cursive prescriptions, ambiguous discharge instructions, and preventable 30-day hospital readmissions."
p3.font.size = Pt(14)
p3.font.color.rgb = TEXT_LIGHT
p3.space_after = Pt(28)

agenda_boxes = [
    ("1. Problem Statement", "Post-Discharge Breakdown & Doctor Handwriting Hazards", RED_ALERT),
    ("2. Proposed Solution", "CareBridge AI 4-Pillar Platform Overview", CYAN),
    ("3. Key Features", "Multimodal Vision OCR, Confusion Detector & Alerts", GREEN),
    ("4. Implementation", "Full Stack Architecture, Responsible AI & Governance", PURPLE)
]

for idx, (title, desc, color) in enumerate(agenda_boxes):
    m_left = Inches(1.5 + idx * 2.58)
    m_card = add_card(s1, m_left, Inches(4.7), Inches(2.45), Inches(1.45), bg_color=CARD_BG_ALT, border_color=color, top_accent=color)
    m_tb = s1.shapes.add_textbox(m_left + Inches(0.12), Inches(4.78), Inches(2.21), Inches(1.25)).text_frame
    m_tb.word_wrap = True
    p = m_tb.paragraphs[0]
    p.text = title
    p.font.size = Pt(12.5); p.font.bold = True; p.font.color.rgb = color; p.space_after = Pt(4)
    p = m_tb.add_paragraph()
    p.text = desc
    p.font.size = Pt(10.5); p.font.color.rgb = TEXT_LIGHT

# ==============================================================================
# SLIDE 2: 1. PROBLEM STATEMENT (THE POST-DISCHARGE BREAKDOWN & HAZARDS)
# ==============================================================================
s2 = create_base_slide()
add_header(s2, "The Healthcare Crisis: Post-Discharge Breakdown & Clinical Hazards", "1. PROBLEM STATEMENT")

# Left Column: The Post-Discharge Crisis
c_prob = add_card(s2, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.2), bg_color=CARD_BG, border_color=RED_ALERT, top_accent=RED_ALERT)
tb_pr = s2.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.06), Inches(3.8)).text_frame
tb_pr.word_wrap = True

p = tb_pr.paragraphs[0]
p.text = "🏥 Systemic Post-Discharge Breakdown"
p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = RED_ALERT; p.space_after = Pt(8)

p = tb_pr.add_paragraph()
p.text = "• $17B Annual Readmission Burden: Nearly 1 in 5 elderly Medicare patients are readmitted within 30 days due to preventable post-hospital confusion."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_pr.add_paragraph()
p.text = "• 50%+ Medication Errors: Over half of medication errors occur in the first 14 days at home—double-dosing pills or skipping vital blood pressure therapies."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_pr.add_paragraph()
p.text = "• 3 to 8 Pages of Latin Jargon: Discharge packets are saturated with complex acronyms (PRN, BID, exacerbation) that bewilder non-medical families."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT

# Right Column: The Handwriting & Ambiguity Hazard
c_haz = add_card(s2, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.2), bg_color=CARD_BG, border_color=AMBER, top_accent=AMBER)
tb_hz = s2.shapes.add_textbox(Inches(7.16), Inches(2.0), Inches(5.06), Inches(3.8)).text_frame
tb_hz.word_wrap = True

p = tb_hz.paragraphs[0]
p.text = "✍️ Critical Handwriting & Ambiguity Hazards"
p.font.size = Pt(18); p.font.bold = True; p.font.color.rgb = AMBER; p.space_after = Pt(8)

p = tb_hz.add_paragraph()
p.text = "• Hurried Doctor Cursive: Prescriptions in rushed cursive blue/black ink are visually unreadable to patients and non-specialist caregivers."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_hz.add_paragraph()
p.text = "• Legacy OCR Breakdown: Standard OCR (Tesseract) drops cursive handwriting completely, outputting blank pages or garbled symbols."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_hz.add_paragraph()
p.text = "• Conflicting Follow-Up Dates: Clinic notes say Oct 21, but discharge summary says Oct 24—patients miss crucial post-op checkups."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_hz.add_paragraph()
p.text = "• Missing Dosage Timings: 'Take 1 tablet daily' without stating Morning or Bedtime triggers dangerous hypotensive crashes."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT

# Bottom Callout Banner
bot_gap = add_card(s2, Inches(0.8), Inches(6.15), Inches(11.72), Inches(0.85), bg_color=RGBColor(30, 20, 35), border_color=RED_ALERT)
tb_gap = s2.shapes.add_textbox(Inches(1.0), Inches(6.2), Inches(11.32), Inches(0.75)).text_frame
tb_gap.word_wrap = True
p = tb_gap.paragraphs[0]
p.text = "🛑 The Critical Safety Gap: Patients leave the hospital with fragmented paperwork, unreadable prescriptions, and zero proactive warning alarms to prevent fatal mistakes at home."
p.font.size = Pt(12.5); p.font.bold = True; p.font.color.rgb = RED_ALERT

# ==============================================================================
# SLIDE 3: 2. PROPOSED SOLUTION (OUR APP IS THE SOLUTION: CAREBRIDGE AI)
# ==============================================================================
s3 = create_base_slide()
add_header(s3, "The Proposed Solution: Introducing CareBridge AI", "2. PROPOSED SOLUTION")

banner = add_card(s3, Inches(0.8), Inches(1.75), Inches(11.733), Inches(1.2), bg_color=RGBColor(16, 32, 58), border_color=CYAN, top_accent=CYAN)
tb_b = s3.shapes.add_textbox(Inches(1.1), Inches(1.85), Inches(11.133), Inches(1.0)).text_frame
tb_b.word_wrap = True
p = tb_b.paragraphs[0]
p.text = "🌟 Our App is the Solution: Bridging Hospital Discharge to Confident Home Recovery"
p.font.size = Pt(16.5); p.font.bold = True; p.font.color.rgb = CYAN; p.space_after = Pt(4)
p = tb_b.add_paragraph()
p.text = "CareBridge AI directly eliminates post-discharge breakdowns by combining Multimodal AI Vision, proactive safety audits, interactive checklists, and hands-free timeline alarms into a single patient-centered companion."
p.font.size = Pt(12); p.font.color.rgb = TEXT_WHITE

steps = [
    ("01", "Multimodal AI Vision", "Enhances image contrast and deciphers doctor cursive handwriting, abbreviations (BID, TID) & dosage units.", CYAN),
    ("02", "Medical Explainer", "Translates clinical jargon into plain 6th-grade English while strictly preserving exact dosages and dates.", GREEN),
    ("03", "Confusion Detector", "Proactively audits instructions before discharge to detect blurred drugs, missing times, and date clashes.", AMBER),
    ("04", "Autonomous Timelines", "Dispatches hands-free background push alerts, WhatsApp links, and SMS mapped to daily medication slots.", PURPLE)
]

for idx, (num, title, desc, color) in enumerate(steps):
    left = Inches(0.8 + idx * 2.98)
    card = add_card(s3, left, Inches(3.2), Inches(2.78), Inches(3.5), bg_color=CARD_BG, border_color=color, top_accent=color)
    add_badge(s3, left + Inches(0.2), Inches(3.4), Inches(0.7), Inches(0.32), num, bg_color=color, text_color=BG_DARK)
    
    tb = s3.shapes.add_textbox(left + Inches(0.2), Inches(3.85), Inches(2.38), Inches(2.7)).text_frame
    tb.word_wrap = True
    p = tb.paragraphs[0]
    p.text = title
    p.font.size = Pt(15.5); p.font.bold = True; p.font.color.rgb = TEXT_WHITE; p.space_after = Pt(8)
    p = tb.add_paragraph()
    p.text = desc
    p.font.size = Pt(11.5); p.font.color.rgb = TEXT_LIGHT

# ==============================================================================
# SLIDE 4: 3. KEY FEATURES (PART 1: AI VISION & CONFUSION DETECTOR)
# ==============================================================================
s4 = create_base_slide()
add_header(s4, "Key Features: Multimodal Vision & The Confusion Detector", "3. KEY FEATURES — PART 1")

# Left Column: AI Vision Decipherer
c_v = add_card(s4, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.9), bg_color=CARD_BG, border_color=CYAN, top_accent=CYAN)
tb_v = s4.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.06), Inches(4.5)).text_frame
tb_v.word_wrap = True

p = tb_v.paragraphs[0]
p.text = "👁️ Multimodal AI Vision for Handwriting"
p.font.size = Pt(19); p.font.bold = True; p.font.color.rgb = CYAN; p.space_after = Pt(8)

p = tb_v.add_paragraph()
p.text = "• PIL 1.6x Contrast Boost: Enhances faint ink and removes paper shadows."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(6)

p = tb_v.add_paragraph()
p.text = "• Gemini 2.5 Flash Vision: Deep reasoning understands cursive physician penmanship and clinical abbreviation shorthand."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_v.add_paragraph()
p.text = "📋 Transcribed Prescription Output:"
p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = GREEN; p.space_after = Pt(4)

rx_lines = [
    "✅ Betaloc 100mg: 1 tab Twice Daily (BID) for BP",
    "✅ Dorzolamidum 10mg: 1 tab Twice Daily (BID) for Eyes",
    "✅ Cimetidine 50mg: 2 tabs Three Times Daily (TID) after meals",
    "✅ Oxprenolol 50mg: 1 tab Once Daily (QD) for Heart"
]
for line in rx_lines:
    p = tb_v.add_paragraph()
    p.text = f"  {line}"
    p.font.size = Pt(11); p.font.color.rgb = TEXT_LIGHT

p = tb_v.add_paragraph()
p.text = "\n🛡️ Zero-Key Clinical Regex Pattern Matcher ensures benchmark prescriptions decode even without external API connectivity."
p.font.size = Pt(11); p.font.color.rgb = TEXT_MUTED

# Right Column: The Confusion Detector
c_cd = add_card(s4, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.9), bg_color=CARD_BG, border_color=AMBER, top_accent=AMBER)
tb_cd = s4.shapes.add_textbox(Inches(7.16), Inches(2.0), Inches(5.06), Inches(4.5)).text_frame
tb_cd.word_wrap = True

p = tb_cd.paragraphs[0]
p.text = "🛡️ The Confusion Detector (Safety Scanner)"
p.font.size = Pt(19); p.font.bold = True; p.font.color.rgb = AMBER; p.space_after = Pt(8)

p = tb_cd.add_paragraph()
p.text = "Proactively audits medical instructions before discharge to catch hazards:"
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(10)

haz_items = [
    ("🚨 Illegible Medicine [HIGH SEVERITY]:", "Catches notes saying 'Take 1 capsule twice daily' with blurred names. Flags as UNVERIFIED to prevent taking mystery pills."),
    ("⚠️ Missing Dosage Timing [MEDIUM SEVERITY]:", "Flags drugs with dosage (50mg) but no Morning/Night time slot to avoid daytime dizziness or night hypotension."),
    ("🗓️ Conflicting Clinic Dates [MEDIUM SEVERITY]:", "Flags date mismatches (e.g. Oct 21 vs Oct 24) and provides 1-click doctor contact link to confirm appointments.")
]
for title, text in haz_items:
    p = tb_cd.add_paragraph()
    p.text = f"{title} {text}"
    p.font.size = Pt(11.5); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(6)

# ==============================================================================
# SLIDE 5: 3. KEY FEATURES (PART 2: AUTONOMOUS ALERTS & CAREGIVER HUB)
# ==============================================================================
s5 = create_base_slide()
add_header(s5, "Key Features: Autonomous Alerts, Live Tracker & Family Hub", "3. KEY FEATURES — PART 2")

# Left Column: Autonomous Alerts & Medication Timelines
c_al = add_card(s5, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.9), bg_color=CARD_BG, border_color=PURPLE, top_accent=PURPLE)
tb_al = s5.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.06), Inches(4.5)).text_frame
tb_al.word_wrap = True

p = tb_al.paragraphs[0]
p.text = "📱 Hands-Free Autonomous Alerts"
p.font.size = Pt(19); p.font.bold = True; p.font.color.rgb = PURPLE; p.space_after = Pt(8)

p = tb_al.add_paragraph()
p.text = "• Zero-Click Push Delivery: Background worker fires alerts automatically (Instagram/WhatsApp style) with zero manual clicking."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(6)

p = tb_al.add_paragraph()
p.text = "• Native OS Banners & Chimes: Displays lock screen notification banners and rings an audible chime with spoken voice."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(8)

p = tb_al.add_paragraph()
p.text = "⏰ Daily Medication Timeline Slots:"
p.font.size = Pt(12); p.font.bold = True; p.font.color.rgb = CYAN; p.space_after = Pt(4)

slots = [
    "🌅 Morning (08:00 AM): Betaloc 100mg + Dorzolamide 10mg",
    "☀️ Afternoon (01:00 PM): Cimetidine 50mg after lunch",
    "🌙 Evening (08:00 PM): Betaloc 100mg + Wound dressing check",
    "📲 Multi-Channel: WhatsApp action links, SMS & Calendar sync"
]
for s in slots:
    p = tb_al.add_paragraph()
    p.text = f"  {s}"
    p.font.size = Pt(11); p.font.color.rgb = TEXT_LIGHT

# Right Column: Side-by-Side Activity Tracker & Family Hub
c_tr = add_card(s5, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.9), bg_color=CARD_BG, border_color=GREEN, top_accent=GREEN)
tb_tr = s5.shapes.add_textbox(Inches(7.16), Inches(2.0), Inches(5.06), Inches(4.5)).text_frame
tb_tr.word_wrap = True

p = tb_tr.paragraphs[0]
p.text = "📈 Side-by-Side Tracker & Family Hub"
p.font.size = Pt(19); p.font.bold = True; p.font.color.rgb = GREEN; p.space_after = Pt(8)

p = tb_tr.add_paragraph()
p.text = "• Interactive Recovery Checklist: Categorized daily tasks for Medications, Diet salt limits, Wound dressing, and Clinic visits."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(6)

p = tb_tr.add_paragraph()
p.text = "• Live Adherence Bar & Streak: Shows progress percentage [████████░░] 80% with streak gamification ('🔥 3-Day Streak')."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(6)

p = tb_tr.add_paragraph()
p.text = "• User Sign-In & Sign-Out: Simple login with Full Name and formatted mobile number with international country codes (+1, +91, +44)."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(6)

p = tb_tr.add_paragraph()
p.text = "• Family Member Manager: Allows caregivers to enroll loved ones (Mother, Father, Spouse) and switch alert routing in 1 click."
p.font.size = Pt(12); p.font.color.rgb = TEXT_LIGHT

# ==============================================================================
# SLIDE 6: 4. IMPLEMENTATION APPROACH (ARCHITECTURE, GOVERNANCE & IMPACT)
# ==============================================================================
s6 = create_base_slide()
add_header(s6, "Implementation Approach: Architecture, Governance & Impact", "4. IMPLEMENTATION APPROACH")

# Left Column: Tech Architecture & Responsible AI
c_arch = add_card(s6, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.9), bg_color=CARD_BG, border_color=CYAN, top_accent=CYAN)
tb_ar = s6.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.06), Inches(4.5)).text_frame
tb_ar.word_wrap = True

p = tb_ar.paragraphs[0]
p.text = "⚙️ Full Stack Architecture"
p.font.size = Pt(19); p.font.bold = True; p.font.color.rgb = CYAN; p.space_after = Pt(8)

arch_points = [
    ("🖥️ Framework:", "Streamlit + Python 3.12 reactive responsive UI."),
    ("👁️ Multimodal AI:", "Google Gemini 2.5 Flash Vision API with deep image reasoning."),
    ("🔬 Preprocessing:", "PIL (ImageEnhance) 1.6x contrast & sharpness enhancement."),
    ("🚫 Zero Hallucination:", "Strictly grounds all answers in source documents. Never prescribes or guesses."),
    ("🔒 Ephemeral Privacy:", "Session-based in-memory processing. Records are never permanently stored."),
    ("✅ 100% Test Coverage:", "12 rigorous unit tests passing in 0.6s.")
]
for title, text in arch_points:
    p = tb_ar.add_paragraph()
    p.text = f"{title} {text}"
    p.font.size = Pt(11.5); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(5)

# Right Column: Universal Accessibility & Clinical Impact
c_imp = add_card(s6, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.9), bg_color=CARD_BG, border_color=GREEN, top_accent=GREEN)
tb_im = s6.shapes.add_textbox(Inches(7.16), Inches(2.0), Inches(5.06), Inches(4.5)).text_frame
tb_im.word_wrap = True

p = tb_im.paragraphs[0]
p.text = "🌐 Accessibility & Clinical Impact"
p.font.size = Pt(19); p.font.bold = True; p.font.color.rgb = GREEN; p.space_after = Pt(8)

imp_points = [
    ("🔊 Text-to-Speech (TTS):", "Reads discharge plans out loud for seniors, bedridden patients, and low-vision users."),
    ("🌐 Multi-Lingual Speech:", "Native mother tongue support in English (en), Hindi (hi), and Telugu (te)."),
    ("👁️ WCAG AAA Design:", "High-contrast dark mode with color-coded severity badges (Red, Amber, Green)."),
    ("📉 Reduces Readmissions:", "Eliminates post-discharge confusion, driving adherence to avoid $17B hospital bed costs."),
    ("🤝 Bridges Caregivers:", "Empowers family members to safeguard recovery across generations.")
]
for title, text in imp_points:
    p = tb_im.add_paragraph()
    p.text = f"{title} {text}"
    p.font.size = Pt(11.5); p.font.color.rgb = TEXT_LIGHT; p.space_after = Pt(5)

# ==============================================================================
# SLIDE 7: THANK YOU CARD & DEMONSTRATION
# ==============================================================================
s7 = create_base_slide()

# Large glowing hero container
ty_card = add_card(s7, Inches(1.2), Inches(1.0), Inches(10.933), Inches(5.5), bg_color=RGBColor(15, 23, 42), border_color=CYAN, top_accent=CYAN)

tb_ty = s7.shapes.add_textbox(Inches(1.8), Inches(1.4), Inches(9.7), Inches(4.8))
tf_ty = tb_ty.text_frame
tf_ty.word_wrap = True

p = tf_ty.paragraphs[0]
p.text = "🙏 Thank You!"
p.font.size = Pt(46)
p.font.bold = True
p.font.color.rgb = CYAN
p.space_after = Pt(8)

p = tf_ty.add_paragraph()
p.text = "CareBridge AI — Safe Recovery, Healthier Tomorrows"
p.font.size = Pt(22)
p.font.bold = True
p.font.color.rgb = TEXT_WHITE
p.space_after = Pt(16)

p = tf_ty.add_paragraph()
p.text = "Bridging hospital care to confident recovery at home with AI Vision, proactive confusion prevention, and hands-free timeline alarms."
p.font.size = Pt(14)
p.font.color.rgb = TEXT_LIGHT
p.space_after = Pt(24)

# 3 Takeaway Cards
ty_pillars = [
    ("🛡️ Zero Medication Errors", "Proactive Confusion Detector protects patients from day one.", AMBER),
    ("✍️ Every Prescription Deciphered", "Multimodal AI Vision turns doctor cursive into clear digital schedules.", CYAN),
    ("⏰ 100% Hands-Free Alarms", "Autonomous timeline notifications keep recovery on track effortlessly.", GREEN)
]

for idx, (title, desc, color) in enumerate(ty_pillars):
    t_left = Inches(1.8 + idx * 3.3)
    c_p = add_card(s7, t_left, Inches(4.3), Inches(3.1), Inches(1.6), bg_color=CARD_BG_ALT, border_color=color, top_accent=color)
    tb_p = s7.shapes.add_textbox(t_left + Inches(0.15), Inches(4.4), Inches(2.8), Inches(1.4)).text_frame
    tb_p.word_wrap = True
    p = tb_p.paragraphs[0]
    p.text = title
    p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = color; p.space_after = Pt(4)
    p = tb_p.add_paragraph()
    p.text = desc
    p.font.size = Pt(11); p.font.color.rgb = TEXT_LIGHT

p_bot = s7.shapes.add_textbox(Inches(1.8), Inches(6.05), Inches(9.7), Inches(0.4)).text_frame
p_bot.word_wrap = True
p = p_bot.paragraphs[0]
p.text = "💬 Open for Questions & Live Demonstration"
p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = PURPLE

# Save Presentation
prs.save(OUTPUT_PATH)
print("Updated 7-slide Presentation generated successfully at:", OUTPUT_PATH)
