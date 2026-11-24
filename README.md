# TrustNav · Localization integrity for orchard robots

**Website:** https://seanchen181-ux.github.io/trustnav/

Under the tree canopy, GPS can jump by meters while still claiming centimeter accuracy, and typical navigation software keeps telling the operator that everything is fine. TrustNav adds a trust layer on top of a robot's existing navigation:

1. **Cross-checking** – every position source is continuously compared with the others; a source that disagrees is set aside.
2. **Verified recovery** – a returning source is verified before it is trusted again.
3. **Clear operating modes** – NORMAL / DEGRADED (slow down) / HOLD (stop), following fixed, auditable rules. No AI model is in the decision path.

Operators use **TrustNav Mission Control**, a browser-based 3D console with sensor trust, event timelines, an approval workflow for every stop, and an assistant that answers "why did it stop?" from the logs.

## Measured results (public orchard dataset, 360 test runs)

| With GPS errors | Conventional system | TrustNav |
|---|---|---|
| Time reporting "all normal" while more than 0.5 m off | 3.2 % | **0.12 %** |
| Same, during the problem itself | 30 % | **0.6 %** |
| Time to set the faulty source aside | – | **2.3 s** (average) |

## Contact

Cheng-Chou Chang · allenbecareful@gmail.com · +886 922 748 788

This repository contains only the public showcase site. The software is available for pilots and licensing on request.

## Immersive product presentation — 2026-11-25
- Editorial terrain-led design inspired by the user's supplied reference; no third-party screenshot assets used.
- Interactive Three.js orchard viewer: 111,717 sampled points from the existing CitrusFarm seq06 D0 reconstruction, stored as a ~1 MB static display asset. RTK reference route; marker animation is illustrative and labelled. No estimator source or server credentials included.
- Orbit, pause, top, reset, expanded view, and accessible native modal explanations. Touch scrolling preserved on mobile; expand to manipulate the scene. Automatic motion starts only on explicit Play.
- Both demo films and the evidence/trade-off definitions retained. Public UI has no robot control or approval actions.
- Vendored Three.js 0.160.0 with MIT notice under assets/vendor.
- Browser QA: 1440/1024/768/390 widths, 3D loaded, no overflow or exceptions, interaction checks pass. Chrome DevTools MCP installed and actual new_page/evaluate_script checks succeeded.
