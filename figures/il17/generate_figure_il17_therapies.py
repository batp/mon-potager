#!/usr/bin/env python3
"""Servier-style PPTX: therapeutic options targeting IL-17 / IL-17R at multiple levels.

Based on Noack & Miossec — Box 2 and emerging strategies section.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN

OUT = "/workspace/figures/il17/Figure_IL17_options_therapeutiques.pptx"

BG = RGBColor(0xF8, 0xFA, 0xFC)
INK = RGBColor(0x2C, 0x3E, 0x50)
MUTED = RGBColor(0x5D, 0x6D, 0x7E)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LINE = RGBColor(0xCB, 0xD5, 0xE1)

CORE = RGBColor(0xC4, 0x45, 0x69)
CORE_DK = RGBColor(0x8E, 0x2D, 0x4A)
CORE_LT = RGBColor(0xFB, 0xE9, 0xEF)
REC = RGBColor(0x6D, 0x28, 0xD9)
REC_LT = RGBColor(0xF1, 0xEA, 0xFE)

L1 = RGBColor(0x0D, 0x94, 0x88)      # upstream production
L1_LT = RGBColor(0xE0, 0xF5, 0xF2)
L2 = RGBColor(0xD9, 0x72, 0x16)      # cytokine neutralization
L2_LT = RGBColor(0xFE, 0xF3, 0xE6)
L3 = RGBColor(0x3A, 0x7C, 0xA5)      # receptor
L3_LT = RGBColor(0xE4, 0xF0, 0xF8)
L4 = RGBColor(0x7C, 0x3A, 0xED)      # intracellular signaling
L4_LT = RGBColor(0xF1, 0xEA, 0xFE)
L5 = RGBColor(0xB4, 0x53, 0x09)      # synergy / combo
L5_LT = RGBColor(0xFE, 0xF3, 0xC7)
L6 = RGBColor(0x4D, 0x7C, 0x0F)      # emerging / cellular
L6_LT = RGBColor(0xEC, 0xFC, 0xC8)


def set_fill(shape, color):
    shape.fill.solid()
    shape.fill.fore_color.rgb = color


def no_line(shape):
    shape.line.fill.background()


def set_line(shape, color, width_pt=1.15):
    shape.line.color.rgb = color
    shape.line.width = Pt(width_pt)


def round_rect(slide, left, top, width, height, fill, line=None, adj=0.12):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height
    )
    set_fill(shape, fill)
    if line is None:
        no_line(shape)
    else:
        set_line(shape, line)
    try:
        shape.adjustments[0] = adj
    except Exception:
        pass
    return shape


def oval(slide, left, top, width, height, fill, line=None, line_w=1.5):
    shape = slide.shapes.add_shape(MSO_SHAPE.OVAL, left, top, width, height)
    set_fill(shape, fill)
    if line is None:
        no_line(shape)
    else:
        set_line(shape, line, line_w)
    return shape


def arrow_down(slide, left, top, width, height, color):
    shape = slide.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, left, top, width, height)
    set_fill(shape, color)
    no_line(shape)
    return shape


def set_runs(shape, lines, align=PP_ALIGN.CENTER):
    tf = shape.text_frame
    tf.clear()
    tf.word_wrap = True
    try:
        tf._txBody.get_or_add_bodyPr().set("anchor", "ctr")
    except Exception:
        pass
    for i, line in enumerate(lines):
        if isinstance(line, str):
            text, size, bold, color = line, 11, False, INK
        else:
            text, size, bold, color = line
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_before = Pt(0)
        p.space_after = Pt(1)
        run = p.add_run()
        run.text = text
        run.font.size = Pt(size)
        run.font.bold = bold
        run.font.color.rgb = color
        run.font.name = "Calibri"
    return tf


def textbox(slide, left, top, width, height, text, size=11, bold=False, color=INK, align=PP_ALIGN.LEFT):
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = "Calibri"
    return box


def level_card(slide, left, top, width, height, level_label, title, items, fill, accent, item_size=9):
    round_rect(slide, left, top, width, height, fill, accent, adj=0.08)
    badge = round_rect(slide, left + Inches(0.08), top + Inches(0.08), Inches(0.70), Inches(0.24), accent, None, adj=0.2)
    set_runs(badge, [(level_label, 8, True, WHITE)])
    title_box = slide.shapes.add_textbox(
        left + Inches(0.85), top + Inches(0.06), width - Inches(0.95), Inches(0.28)
    )
    tf = title_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run = p.add_run()
    run.text = title
    run.font.size = Pt(11)
    run.font.bold = True
    run.font.color.rgb = accent
    run.font.name = "Calibri"

    body = slide.shapes.add_textbox(
        left + Inches(0.12),
        top + Inches(0.38),
        width - Inches(0.22),
        height - Inches(0.46),
    )
    tf = body.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        p.space_after = Pt(2)
        run = p.add_run()
        run.text = "• " + item
        run.font.size = Pt(item_size)
        run.font.color.rgb = INK
        run.font.name = "Calibri"
    return body


def drug_chip(slide, left, top, width, height, name, target, fill, accent):
    shape = round_rect(slide, left, top, width, height, fill, accent, adj=0.18)
    set_runs(shape, [(name, 10, True, accent), (target, 8, False, MUTED)])
    return shape


def build_schema_slide(prs, lang="fr"):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), prs.slide_width, prs.slide_height
    )
    set_fill(bg, BG)
    no_line(bg)

    if lang == "fr":
        title = "Options thérapeutiques ciblant l’axe IL-17 / IL-17R"
        subtitle = "Stratégies à différents niveaux — production, cytokine, récepteur, signalisation, synergies"
        footer = (
            "D’après Noack & Miossec — Box 2 et stratégies émergentes  |  "
            "Direct (Ac monoclonaux) vs indirect (IL-23, JAK) vs émergent  |  Style Servier"
        )
        center_top = "Cible centrale"
        lvl = ["N1", "N2", "N3", "N4", "N5", "N6"]
        titles = [
            "Amont — production Th17",
            "Neutralisation de l’IL-17",
            "Blocage du récepteur",
            "Signalisation intracellulaire",
            "Synergies / multi-cibles",
            "Émergent — interactions & ARNs",
        ]
        items = [
            [
                "Anti–IL-23 : ↓ différenciation / maintien Th17",
                "Inhibiteurs JAK/STAT : ↓ IL-6 / IL-23",
                "Modulation DC (↓ IL-6, IL-23)",
                "Microbiote (approches expérimentales)",
            ],
            [
                "Secukinumab : anti–IL-17A",
                "Bimekizumab : anti–IL-17A + IL-17F",
                "Neutralisation directe de la cytokine",
                "Efficaces surtout Pso / PsA / SpA",
            ],
            [
                "Brodalumab : anti–IL-17RA",
                "Bloque plusieurs ligands via IL-17RA",
                "↓ NF-κB / MAPK en aval",
                "Petites molécules anti-complexe (R&D)",
            ],
            [
                "Cible ACT1 (TRAF3IP2) – TRAF6",
                "Préserve potentiellement des fonctions physiologiques",
                "Voie JAK-indépendante de l’IL-17",
                "→ les JAK i. n’arrêtent pas le signal IL-17",
            ],
            [
                "Bispecific / combos IL-17 + TNF",
                "Blocage IL-17 + IL-1β (concept)",
                "Casser la synergie pathogène",
                "Intérêt si réponse incomplète monothérapie",
            ],
            [
                "podoplanine / CD74 tronqué (interactions)",
                "miR-155, miR-326 (promoteurs Th17)",
                "miR-20b, miR-146a (freins)",
                "lncRNAs / nanobodies (perspectives)",
            ],
        ]
        drugs = [
            ("secukinumab", "IL-17A"),
            ("bimekizumab", "IL-17A/F"),
            ("brodalumab", "IL-17RA"),
            ("anti–IL-23", "amont"),
            ("JAKi", "STAT / Th17"),
            ("ACT1 i.", "R&D"),
        ]
        note = "Risque partagé : candidose mucocutanée (rôle protecteur de l’IL-17)"
        axis_prod = "Production"
        axis_func = "Fonction / signal"
    else:
        title = "Therapeutic options targeting the IL-17 / IL-17R axis"
        subtitle = "Strategies at multiple levels — production, cytokine, receptor, signaling, synergies"
        footer = (
            "Based on Noack & Miossec — Box 2 and emerging strategies  |  "
            "Direct (mAbs) vs indirect (IL-23, JAK) vs emerging  |  Servier style"
        )
        center_top = "Central target"
        lvl = ["L1", "L2", "L3", "L4", "L5", "L6"]
        titles = [
            "Upstream — Th17 production",
            "IL-17 neutralization",
            "Receptor blockade",
            "Intracellular signaling",
            "Synergies / multi-target",
            "Emerging — contacts & RNAs",
        ]
        items = [
            [
                "Anti–IL-23: ↓ Th17 differentiation / maintenance",
                "JAK/STAT inhibitors: ↓ IL-6 / IL-23",
                "DC modulation (↓ IL-6, IL-23)",
                "Microbiota (experimental approaches)",
            ],
            [
                "Secukinumab: anti–IL-17A",
                "Bimekizumab: anti–IL-17A + IL-17F",
                "Direct cytokine neutralization",
                "Strongest in Pso / PsA / SpA",
            ],
            [
                "Brodalumab: anti–IL-17RA",
                "Blocks several ligands via IL-17RA",
                "↓ downstream NF-κB / MAPK",
                "Small-molecule complex disruptors (R&D)",
            ],
            [
                "ACT1 (TRAF3IP2)–TRAF6 targeting",
                "May spare some physiological functions",
                "IL-17 pathway is JAK-independent",
                "→ JAKi do not stop IL-17 signaling",
            ],
            [
                "Bispecific / combo IL-17 + TNF",
                "IL-17 + IL-1β blockade (concept)",
                "Break pathogenic synergy",
                "Useful after incomplete mono-response",
            ],
            [
                "Podoplanin / truncated CD74 (contacts)",
                "miR-155, miR-326 (Th17 promoters)",
                "miR-20b, miR-146a (brakes)",
                "lncRNAs / nanobodies (perspectives)",
            ],
        ]
        drugs = [
            ("secukinumab", "IL-17A"),
            ("bimekizumab", "IL-17A/F"),
            ("brodalumab", "IL-17RA"),
            ("anti–IL-23", "upstream"),
            ("JAKi", "STAT / Th17"),
            ("ACT1 i.", "R&D"),
        ]
        note = "Shared risk: mucocutaneous candidiasis (protective role of IL-17)"
        axis_prod = "Production"
        axis_func = "Function / signal"

    textbox(
        slide, Inches(0.25), Inches(0.05), Inches(12.8), Inches(0.32),
        title, size=18, bold=True, color=INK, align=PP_ALIGN.CENTER,
    )
    textbox(
        slide, Inches(0.25), Inches(0.32), Inches(12.8), Inches(0.22),
        subtitle, size=11, color=MUTED, align=PP_ALIGN.CENTER,
    )

    # Vertical pathway spine (center)
    spine = round_rect(slide, Inches(5.35), Inches(0.60), Inches(2.60), Inches(6.45), CORE_LT, CORE, adj=0.04)
    hub = round_rect(slide, Inches(5.55), Inches(0.75), Inches(2.20), Inches(0.32), CORE, None, adj=0.2)
    set_runs(hub, [(center_top, 10, True, WHITE)])

    # Production node
    prod = round_rect(slide, Inches(5.55), Inches(1.20), Inches(2.20), Inches(0.70), L1_LT, L1, adj=0.12)
    set_runs(prod, [(axis_prod, 9, True, L1), ("Th17 · IL-23 · JAK", 9, False, MUTED)])

    arrow_down(slide, Inches(6.45), Inches(1.95), Inches(0.28), Inches(0.28), MUTED)

    # IL-17
    il17 = oval(slide, Inches(5.55), Inches(2.30), Inches(2.20), Inches(0.95), CORE, CORE_DK)
    set_runs(il17, [("IL-17A / IL-17F", 13, True, WHITE), ("(± A/F)", 9, False, RGBColor(0xFF, 0xD6, 0xE0))])

    arrow_down(slide, Inches(6.45), Inches(3.30), Inches(0.28), Inches(0.28), MUTED)

    # Receptor
    receptor = round_rect(slide, Inches(5.55), Inches(3.65), Inches(2.20), Inches(0.95), REC_LT, REC, adj=0.12)
    set_runs(receptor, [("IL-17RA + IL-17RC", 12, True, REC), ("complexe récepteur" if lang == "fr" else "receptor complex", 9, False, MUTED)])

    arrow_down(slide, Inches(6.45), Inches(4.65), Inches(0.28), Inches(0.28), MUTED)

    # Signaling
    sig = round_rect(slide, Inches(5.55), Inches(5.00), Inches(2.20), Inches(0.85), L4_LT, L4, adj=0.12)
    set_runs(sig, [("ACT1 → TRAF6", 11, True, L4), ("NF-κB / MAPK / C/EBP", 9, False, MUTED)])

    out = round_rect(slide, Inches(5.55), Inches(6.05), Inches(2.20), Inches(0.75), WHITE, LINE, adj=0.12)
    set_runs(out, [
        (axis_func, 9, True, MUTED),
        ("chemokines · MMPs · TNF syn." if lang != "fr" else "chimiokines · MMPs · syn. TNF", 8, False, INK),
    ])

    # Drug chips under center-ish top row spanning full width above cards? Better place chips on spine sides.
    # Left column levels 1,2,5
    # Right column levels 3,4,6
    colors = [L1, L2, L3, L4, L5, L6]
    fills = [L1_LT, L2_LT, L3_LT, L4_LT, L5_LT, L6_LT]

    # Layout: 2 columns x 3 rows around the spine
    # Left: N1 top, N2 mid, N5 bottom
    # Right: N3 top, N4 mid, N6 bottom
    positions = [
        (Inches(0.20), Inches(0.60), 0),  # N1
        (Inches(0.20), Inches(2.75), 1),  # N2
        (Inches(8.15), Inches(0.60), 2),  # N3
        (Inches(8.15), Inches(2.75), 3),  # N4
        (Inches(0.20), Inches(4.90), 4),  # N5
        (Inches(8.15), Inches(4.90), 5),  # N6
    ]
    card_w, card_h = Inches(5.00), Inches(2.00)

    for left, top, idx in positions:
        level_card(
            slide, left, top, card_w, card_h,
            lvl[idx], titles[idx], items[idx],
            fills[idx], colors[idx], item_size=9,
        )

    # Example drug chips strip at very bottom of spine area - place above footer as a legend strip
    strip = round_rect(slide, Inches(0.20), Inches(6.95), Inches(12.95), Inches(0.18), WHITE, None, adj=0.1)
    # actually use chips instead
    chip_w = Inches(1.95)
    chip_y = Inches(6.55)
    # Wait - bottom cards already occupy 4.90-6.90. Move note into cards area differently.
    # Put drug examples as small chips inside the center spine top was crowded.
    # Add a thin footer note only.

    textbox(
        slide, Inches(0.25), Inches(7.12), Inches(12.8), Inches(0.18),
        note + "  ·  " + footer,
        size=7.5, color=MUTED, align=PP_ALIGN.CENTER,
    )


def build_pathway_map_slide(prs, lang="fr"):
    """Second visual: linear cascade with inhibition marks at each level."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), prs.slide_width, prs.slide_height
    )
    set_fill(bg, BG)
    no_line(bg)

    if lang == "fr":
        title = "Carte des interventions sur la cascade IL-17"
        subtitle = "Du microbiote / DC jusqu’au signal ACT1 — où agissent les traitements"
        steps = [
            ("Microbiote\nDC / macros", "anti–IL-23\nJAKi\nmod. DC", L1, L1_LT),
            ("Th17\n(RORγt)", "miARN\nlncARN\nTreg/M2*", L1, L1_LT),
            ("IL-17A/F", "secukinumab\nbimekizumab", L2, L2_LT),
            ("IL-17RA/RC", "brodalumab\npetites mol.", L3, L3_LT),
            ("ACT1–TRAF6\nNF-κB/MAPK", "inhib. ACT1\n(R&D)", L4, L4_LT),
            ("Synergie\nTNF / IL-1β", "combos\nbispecifics", L5, L5_LT),
        ]
        tip = "* approches indirectes / conceptuelles — interactions cellulaires (pdpn, CD74) = niveau émergent"
        footer = "D’après Noack & Miossec — stratégies actuelles et futures ciblant l’IL-17"
    else:
        title = "Intervention map on the IL-17 cascade"
        subtitle = "From microbiota / DC to ACT1 signaling — where therapies act"
        steps = [
            ("Microbiota\nDC / macros", "anti–IL-23\nJAKi\nDC mod.", L1, L1_LT),
            ("Th17\n(RORγt)", "miRNAs\nlncRNAs\nTreg/M2*", L1, L1_LT),
            ("IL-17A/F", "secukinumab\nbimekizumab", L2, L2_LT),
            ("IL-17RA/RC", "brodalumab\nsmall mol.", L3, L3_LT),
            ("ACT1–TRAF6\nNF-κB/MAPK", "ACT1 inhib.\n(R&D)", L4, L4_LT),
            ("Synergy\nTNF / IL-1β", "combos\nbispecifics", L5, L5_LT),
        ]
        tip = "* indirect / conceptual approaches — cellular contacts (pdpn, CD74) = emerging level"
        footer = "Based on Noack & Miossec — current and future strategies targeting IL-17"

    textbox(slide, Inches(0.3), Inches(0.12), Inches(12.7), Inches(0.34), title, size=18, bold=True, color=INK, align=PP_ALIGN.CENTER)
    textbox(slide, Inches(0.3), Inches(0.42), Inches(12.7), Inches(0.24), subtitle, size=11, color=MUTED, align=PP_ALIGN.CENTER)

    x0 = Inches(0.35)
    step_w = Inches(1.85)
    gap = Inches(0.22)
    y_node = Inches(1.8)
    y_rx = Inches(4.2)

    for i, (node, rx, accent, fill) in enumerate(steps):
        left = x0 + i * (step_w + gap)
        node_shape = round_rect(slide, left, y_node, step_w, Inches(1.55), fill, accent, adj=0.1)
        # multiline node label
        lines = []
        for part in node.split("\n"):
            lines.append((part, 12 if len(lines) == 0 else 11, True if len(lines) == 0 else False, accent if len(lines) == 0 else INK))
        set_runs(node_shape, lines)

        if i < len(steps) - 1:
            arrow = slide.shapes.add_shape(
                MSO_SHAPE.RIGHT_ARROW,
                left + step_w + Inches(0.02),
                y_node + Inches(0.60),
                Inches(0.18),
                Inches(0.28),
            )
            set_fill(arrow, MUTED)
            no_line(arrow)

        # inhibition arrow down to therapy
        arrow_down(slide, left + Inches(0.75), Inches(3.45), Inches(0.30), Inches(0.45), accent)

        # red-ish stop bar
        stop = round_rect(slide, left + Inches(0.55), Inches(3.95), Inches(0.70), Inches(0.14), CORE, None, adj=0.3)
        set_runs(stop, [("✕", 10, True, WHITE)])

        rx_shape = round_rect(slide, left, y_rx, step_w, Inches(1.80), WHITE, accent, adj=0.1)
        rx_lines = []
        for j, part in enumerate(rx.split("\n")):
            rx_lines.append((part, 11 if j == 0 else 10, j == 0, accent if j == 0 else INK))
        set_runs(rx_shape, rx_lines)

    # Center highlight band behind IL-17 and receptor steps
    highlight = round_rect(slide, Inches(4.55), Inches(1.55), Inches(4.20), Inches(0.18), CORE, None, adj=0.3)
    set_runs(highlight, [("IL-17 / IL-17R — nœud thérapeutique central" if lang == "fr" else "IL-17 / IL-17R — central therapeutic node", 9, True, WHITE)])

    note = round_rect(slide, Inches(0.35), Inches(6.25), Inches(12.6), Inches(0.70), L6_LT, L6, adj=0.08)
    set_runs(note, [
        (tip, 11, False, INK),
        ("podoplanin / truncated CD74 · dual IL-17+TNF · ACT1" if lang != "fr" else "podoplanine / CD74 tronqué · dual IL-17+TNF · ACT1", 10, True, L6),
    ])

    textbox(slide, Inches(0.3), Inches(7.15), Inches(12.7), Inches(0.22), footer, size=8, color=MUTED, align=PP_ALIGN.CENTER)


def build_legend_slide(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    bg = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), prs.slide_width, prs.slide_height
    )
    set_fill(bg, BG)
    no_line(bg)
    textbox(
        slide, Inches(0.6), Inches(0.35), Inches(12.0), Inches(0.40),
        "Légende — Options thérapeutiques sur l’axe IL-17 / IL-17R",
        size=18, bold=True, color=INK, align=PP_ALIGN.LEFT,
    )
    legend = (
        "Cette figure place IL-17 et son récepteur (IL-17RA/IL-17RC) au centre d’une cascade "
        "thérapeutique multi-niveaux.\n\n"
        "En amont, les anti–IL-23 et les inhibiteurs JAK/STAT réduisent la production d’IL-17 "
        "en limitant la différenciation et le maintien des Th17, sans bloquer directement le "
        "signal IL-17 (voie JAK-indépendante). Au niveau de la cytokine, secukinumab "
        "neutralise l’IL-17A, tandis que bimekizumab bloque IL-17A et IL-17F. "
        "Au niveau du récepteur, brodalumab cible IL-17RA.\n\n"
        "Plus en aval, le ciblage d’ACT1–TRAF6 et les approches combinées (IL-17 + TNF) "
        "visent la signalisation et les synergies pathogènes. Les stratégies émergentes "
        "incluent la modulation des interactions cellulaires (podoplanine, CD74 tronqué) "
        "et des ARN régulateurs (miARN, lncARN), afin d’affiner l’inhibition tout en "
        "préservant mieux les fonctions protectrices de l’IL-17."
    )
    box = slide.shapes.add_textbox(Inches(0.6), Inches(0.95), Inches(12.0), Inches(5.8))
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.LEFT
    run = p.add_run()
    run.text = legend
    run.font.size = Pt(14)
    run.font.color.rgb = INK
    run.font.name = "Calibri"


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    build_schema_slide(prs, lang="fr")
    build_schema_slide(prs, lang="en")
    build_pathway_map_slide(prs, lang="fr")
    build_pathway_map_slide(prs, lang="en")
    build_legend_slide(prs)
    prs.save(OUT)
    print(f"Saved {OUT}")


if __name__ == "__main__":
    build()
