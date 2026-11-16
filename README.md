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

Kuan-Shun Su · Institute of Manufacturing Information and Systems, National Cheng Kung University, Tainan, Taiwan
guanshun58@gmail.com · +886 933 180 363

This repository contains only the public showcase site. The software is available for pilots and licensing on request.
