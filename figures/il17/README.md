# Figures IL-17 — Noack & Miossec

PowerPoint figures (topo type Servier Medical Art) summarizing the review framework:

**Noack & Miossec** — *Cellular and molecular interactions regulating IL-17 production and function in chronic inflammation affecting joints*.

## 1. Production / function overview

- `Figure_IL17_production_fonction_Servier.pptx`
  - **Slide 1** — French schematic
  - **Slide 2** — English schematic
  - **Slide 3** — French figure legend

| Zone | Content |
|------|---------|
| **Above** | Regulation of **production**: inducing cytokines, cellular interactions (podoplanin, truncated CD74), environment, negative regulators |
| **Center** | **IL-17A/F** → **IL-17RA + IL-17RC** → ACT1 / NF-κB / MAPK / C/EBP |
| **Below** | Regulation of **function**: TNF synergy, autoantibodies, IL-25 antagonism, tissue context |

## 2. Cytokine interactions (positive / negative)

- `Figure_IL17_cytokines_pos_neg.pptx`
  - **Slide 1** — French schematic
  - **Slide 2** — English schematic
  - **Slide 3** — French figure legend

| Zone | Content |
|------|---------|
| **Left (+)** | Inducing / amplifying cytokines: TGF-β+IL-6, IL-1β, IL-23, IL-21; function synergy with TNF / IL-1β / IL-22 |
| **Center** | Th17 → **IL-17A/F** → **IL-17RA+IL-17RC** |
| **Right (−)** | Inhibitory cytokines: IL-4, IL-13, IL-10; IL-25 antagonism; natural anti–IL-17 autoantibodies |

## Regenerate

```bash
python3 figures/il17/generate_figure_il17.py
python3 figures/il17/generate_figure_il17_cytokines.py
```
