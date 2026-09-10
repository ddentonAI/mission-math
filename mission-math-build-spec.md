# MISSION: MATH — Build Specification
### Space-themed adaptive math practice, Alberta Grade 3 curriculum, Grok-powered item generation

**Version:** 1.1 — iPad-targeted
**Audience:** the developer (you, or a coding agent you hand this to)
**Target user:** one Grade 3 student, ages 8–9, working 10–15 minutes a day at home
**Target device:** **iPad, landscape, installed to the Home Screen as a web app.** Not a desktop app that happens to work on a tablet — see §9.
**Success measure:** measurable mastery growth across all seven Alberta Grade 3 organizing ideas, and a kid who keeps coming back voluntarily

---

## 1. Product brief

A single-player space mission game. The student is a cadet flying a ship through the solar system. Each planet is a math strand; each moon or station is a specific skill. Solving problems earns fuel, unlocks ship upgrades, and advances the mission map. Every problem is generated to fit exactly where the student is — not too easy, not defeating.

Three things make this different from a worksheet with a rocket sticker on it:

1. **A real mastery model.** The app knows, per skill, whether he's shaky, solid, or overdue for review, and it picks the next problem from that.
2. **Generated content that never runs out and never repeats stale.** Grok writes fresh, on-theme problems at the right difficulty.
3. **Progress that a parent can actually read.** Not "1,240 stars earned" — "he's solid on 2-digit addition, he's guessing on fractions of a set, and he hasn't touched perimeter in three weeks."

### Non-negotiable design rules

| Rule | Why |
|---|---|
| **The AI generates problems. The app grades them.** Answers are computed and verified by deterministic code, never by the model. | LLMs do arithmetic wrong often enough that a wrong "correct answer" would actively teach a child something false. This is the single most important rule in this document. |
| No visible countdown timers or speed scoring | He's a kid who needs help. Time pressure raises anxiety and depresses performance in exactly the students who need practice most. Latency is logged silently for the model, never shown. |
| Wrong answers cost nothing | No lives, no losing fuel, no streak destruction. Errors trigger a hint and a re-try, then a worked example. Progress bars only go forward. |
| Sessions end on a win | The last item of a session is always at or below current mastery level. Finish confident. |
| Reading level stays low | All text at Grade 2–3 reading level. Every word problem readable aloud in under 15 seconds. Math difficulty must never be hidden behind reading difficulty. |
| One concept per screen | No dashboards, no clutter. The whole task fits above the fold with no scrolling, ever. |
| **Fingers only. No keyboard, no hover, no scrolling.** Every interaction is a tap or a drag on a target he can hit with a thumb. | The system keyboard covers a third of the iPad screen, autocorrects numbers, and is a fine-motor obstacle for an 8-year-old. Hover states are invisible on touch. Scrolling during a problem hides the question. |
| Nothing important within 60 px of the left or right screen edge | That's where his palms rest when he holds the iPad in landscape. Accidental taps there will make the app feel broken and unfair. |

---

## 2. Curriculum map — Alberta Grade 3 Mathematics (2022 curriculum)

Alberta's current K–6 math curriculum organizes Grade 3 into **seven organizing ideas**: Number, Patterns, Algebra, Geometry, Measurement, Time, and Statistics. Roughly 90 learning outcomes and "knowledge, understanding, skills and procedures" statements sit under them.

> **Verify before you build.** Pull the authoritative outcome list from the Alberta curriculum site (curriculum.learnalberta.ca → Mathematics → Grade 3) or ask his teacher for the outcome checklist the school uses, and reconcile it against the table below. The skill IDs are yours to own; the outcome wording should come from the province. Also ask which strands his class has already covered this year, so the app sequences with school rather than against it.

The skill graph below is the app's spine. Each node gets a stable ID, a prerequisite list, a difficulty ladder (L1–L5), and a space theme.

### 2.1 Number (`NUM`)

| ID | Skill | Difficulty ladder (L1 → L5) | Theme |
|---|---|---|---|
| `NUM-PV` | Place value to 10 000 | 3-digit expanded form → compare/order 4-digit → represent 4-digit multiple ways → round/estimate → flexible regrouping | **Fuel tanks**: thousands / hundreds / tens / ones tanks on the ship |
| `NUM-AS` | Addition & subtraction within 1000 | no regrouping → one regroup → two regroups → 3-digit with zeros → 2-step word problems | **Cargo loading** at the orbital depot |
| `NUM-MD` | Multiplication & division within 100 | equal groups & skip counting → arrays → facts ×2 ×5 ×10 → facts ×3 ×4 ×6–×9 → division & fact families, remainders | **Solar panel arrays** and **crew pods** |
| `NUM-FR` | Fractions | name parts of a whole → numerator/denominator → fractions of a set → on a number line → compare same denominator, then same numerator | **Oxygen tanks** and **planet slices** |

### 2.2 Patterns (`PAT`)

| ID | Skill | Ladder | Theme |
|---|---|---|---|
| `PAT-SEQ` | Increasing & decreasing numerical sequences | +2/+5/+10 forward → backward → find the rule → missing middle terms → two-step or non-constant rules | **Navigation beacons** along a flight path |
| `PAT-MUL` | Multiples & skip counting | count by 2,5,10 → by 3,4 → identify multiples → skip count from non-zero start → patterns on a hundred chart | **Orbit ticks** around a planet |

### 2.3 Algebra (`ALG`)

| ID | Skill | Ladder | Theme |
|---|---|---|---|
| `ALG-EQ` | Equality and equations with an unknown | true/false equations → balance both sides → unknown in result position → unknown in any position → unknown from a word problem | **Airlock balance beam** — both sides must match or the door won't open |

### 2.4 Geometry (`GEO`)

| ID | Skill | Ladder | Theme |
|---|---|---|---|
| `GEO-POLY` | Polygons: sides, vertices, classification | name common polygons → count sides/vertices → sort by one attribute → sort by two → identify irregular polygons |	**Station modules** you bolt together |
| `GEO-TRANS` | Transformations & symmetry | recognize a line of symmetry → complete a symmetric figure → slide/flip/turn identification → predict result of a transformation → combine two |	**Satellite panels** and mirrored hull plating |

### 2.5 Measurement (`MEA`)

| ID | Skill | Ladder | Theme |
|---|---|---|---|
| `MEA-LEN` | Length, units and referents | choose cm vs m → estimate with a referent → measure to nearest cm → convert cm↔m → relate to imperial (inch/foot) |	**Rover traverse** on the surface |
| `MEA-PER` | Perimeter | count unit sides → rectangle perimeter → irregular polygon perimeter → missing side given perimeter → compare two shapes |	**Landing pad fencing** |
| `MEA-ANG` | Angles | recognize an angle → compare to a right angle → smaller/larger than right → order by size → find angles in shapes |	**Telescope aiming** and launch trajectory |

### 2.6 Time (`TIM`)

| ID | Skill | Ladder | Theme |
|---|---|---|---|
| `TIM-CLK` | Telling time | o'clock & half past → to 5 minutes → to the minute → minutes *until* the next hour → elapsed time within an hour |	**Mission clock** counting to launch |
| `TIM-DAY` | a.m./p.m. and the 24-hour cycle | day vs night activities → assign a.m./p.m. → order events in a day → 24-hour cycle reasoning → duration across a.m./p.m. |	**Station day/night** as you orbit Earth 16 times a day |

### 2.7 Statistics (`STA`)

| ID | Skill | Ladder | Theme |
|---|---|---|---|
| `STA-DATA` | Collect, organize and interpret first-hand data | read a pictograph → tally & frequency table → read a bar graph → build a bar graph from data → compare and answer 2-step questions |	**Alien species survey** logged by the ship's scanner |

**Total: 15 skill nodes × 5 levels = 75 mastery cells.** That's the whole game board, and it's a tractable amount of content to build and validate.

### 2.8 Prerequisite edges

```
NUM-PV → NUM-AS → ALG-EQ
NUM-AS → NUM-MD → NUM-FR
PAT-MUL → NUM-MD
NUM-MD → PAT-SEQ (L4+)
GEO-POLY → GEO-TRANS
GEO-POLY → MEA-PER
MEA-LEN → MEA-PER
NUM-AS → TIM-CLK (L4 elapsed time)
NUM-AS → STA-DATA (L4+)
```

A node unlocks when every prerequisite is at L3 or better. Nothing else gates content — the map should look open and inviting, not locked down.

---

## 3. The game loop

### 3.1 Session structure (target 12 minutes, 14–18 items)

| Phase | Items | Selection rule | Purpose |
|---|---|---|---|
| **Pre-flight** | 2 | Mastered skills, one level below current | Warm up, guarantee two early wins |
| **Mission** | 8–10 | Current focus node at target difficulty | The actual learning |
| **Systems check** | 3–4 | Spaced-review queue (due items) | Retention |
| **Bonus transmission** | 1 | One level above current, optional, skippable | Stretch without stakes |
| **Debrief** | — | — | Fuel earned, map progress, one sentence of praise tied to a specific thing he did |

Hard stop at 15 minutes or 20 items, whichever first, with a "come back tomorrow" screen. Optional parent setting to allow a second session.

### 3.2 Item interaction

Each item is presented as a mission event with a visual. All six input types are custom touch widgets — the system keyboard is never invoked anywhere in the student-facing app.

| Input type | Touch design | Used by |
|---|---|---|
| **Numeric keypad** (default) | Custom on-screen pad, 0–9 + backspace + submit. Keys **88 × 88 px**, 12 px gaps, bottom-right corner. Digits appear in a large answer slot above the pad. No system keyboard, so no autocorrect, no layout shift, no covered question. | `NUM-*`, `MEA-*`, `TIM-CLK` |
| **Multiple choice** | 4 cards in a 2×2 grid, each ≥ 260 × 120 px, in the lower half of the screen. Distractors seeded from misconception tags. | any |
| **Drag-to-place** | Pointer Events, not HTML5 drag-and-drop (which does not work in iOS Safari). Hit slop 44 px beyond the visual bounds. The dragged token renders **56 px above the finger** so it isn't hidden under it, and scales to 1.15× while held. Snap to the nearest valid slot within 40 px, with a haptic-style visual pulse on snap. | number line, fraction bars, bar-graph building |
| **Tap-to-select** | Tap toggles; selected state must be obvious without colour alone (border + checkmark + scale). Minimum 64 × 64 px per selectable, even for small shapes — inflate the hit area invisibly. | polygons, symmetry lines, data categories |
| **Clock hands** | Drag either hand around the face; minute hand snaps to 5-minute increments at L1–L2, 1-minute at L3+. Face diameter ≥ 320 px. Hands grabbable anywhere along their length, not just the tip. | `TIM-CLK` |
| **Scratchpad** (optional, always available) | Full-screen canvas overlay on a corner button. Finger or **Apple Pencil** (`pointerType === 'pen'` gets a thinner stroke and ignores palm contact). Never graded, never saved as an answer — it exists so he can work things out the way he would on paper. | any |

**The scratchpad is worth building early.** The most common failure of tablet math apps is that they train kids to guess from four options instead of computing. A place to actually work the problem, with a pencil if you have one, keeps the arithmetic honest.

### 3.3 Response handling

| Event | App behaviour |
|---|---|
| Correct, first try | Immediate positive feedback + fuel. Advance. |
| Correct, after hint | Same fuel, slightly less "mastery credit" (weight 0.6). Advance. |
| Wrong, 1st time | No penalty language. Show targeted hint (from the item's `hint` field). Re-try same item. |
| Wrong, 2nd time | Show worked solution, step by step, in the space theme. Mark item as `taught`. Queue a near-clone for tomorrow. |
| Wrong twice on two consecutive items in a node | Drop difficulty one level for the rest of the session, silently. |
| Idle > 45 s | Gentle animated nudge, then offer the hint. Never scold. |

### 3.4 Meta-progression (the reason he opens it tomorrow)

- **Fuel** — soft currency from every attempt, more for first-try correct.
- **Ship upgrades** — spend fuel on cosmetic parts: hull colours, engines, decals, a crew pet. Purely cosmetic, always affordable within a few sessions.
- **Solar system map** — each planet fills in as its strand's skills reach Mastered. Reaching a new planet is the big milestone; make the animation good.
- **Mission log** — a scrapbook of planets visited and badges earned (e.g. "Fraction Navigator", "Perimeter Engineer").
- **Streak** — count days practised, but streaks pause rather than break. A missed day shows "mission on standby," not a reset to zero.

---

## 4. Architecture

### 4.1 Recommended stack

```
┌─────────────────────────────────────────────────┐
│  CLIENT  iPad — installed PWA, landscape        │
│  React 18 + Vite + Tailwind                     │
│  Framer Motion (animation), Howler (audio)      │
│  @use-gesture/react or dnd-kit (Pointer Events) │
│  Service worker + IndexedDB → full offline play │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS (LAN, trusted local cert)
┌──────────────────▼──────────────────────────────┐
│  SERVER  Node 20 + Express (or Python/FastAPI)  │
│  ├── /api/session   session assembly            │
│  ├── /api/attempt   grading + mastery update    │
│  ├── /api/progress  dashboard data              │
│  └── /api/generate  Grok proxy (server-only key)│
├─────────────────────────────────────────────────┤
│  DATA    SQLite (better-sqlite3 / Prisma)       │
│  item bank · attempts · mastery · review queue  │
├─────────────────────────────────────────────────┤
│  JOBS    nightly item-bank top-up (cron)        │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS
              ┌────▼──────┐
              │  xAI API  │  api.x.ai/v1
              └───────────┘
```

**Why a server at all, for a single kid?** Three reasons: the Grok API key must never ship to the client; progress data survives a browser cache clear; and the item bank can be pre-generated in batches overnight instead of paying latency at question time.

**Serve it over HTTPS, even on the LAN.** Service workers, offline caching, Home Screen install and Screen Wake Lock all require a secure context, and `http://192.168.x.x` is not one. Two workable options:

- **`mkcert`** — generate a local CA, install the root cert on the iPad (Settings → General → VPN & Device Management, then enable it under Certificate Trust Settings), serve on `https://mathbox.local:3443`. Ten minutes of setup, works forever, nothing leaves the house.
- **Tailscale** — put the iPad and the server on a tailnet, use MagicDNS + Tailscale's HTTPS certs. Slightly more moving parts, but the app then works from anywhere, including grandma's house.

Plain `http://` on the LAN is fine for Phase 1 development in a Safari tab. It will not survive contact with Phase 5.

An Electron or Capacitor wrapper is a Phase 5 nicety, not a Phase 1 requirement — an installed PWA on iPadOS 26 already runs full-screen with its own icon and no address bar.

### 4.2 Critical: the AI is a content author, not a judge

```
Grok  →  candidate item (structured JSON)
          ↓
      VALIDATOR (deterministic code)
          ↓  reject → discard, log, regenerate
      ITEM BANK (SQLite, pre-verified)
          ↓
      SESSION ENGINE (picks items, no AI in the loop)
          ↓
      GRADER (deterministic comparison)
```

At question time there is no model call. The kid gets instant response, offline tolerance, zero risk of a hallucinated answer key, and near-zero marginal cost.

---

## 5. Data model

```sql
-- Static curriculum, seeded from a JSON file, not generated
skill_node(id TEXT PK, strand TEXT, title TEXT, outcome_ref TEXT,
           theme TEXT, prereqs JSON, max_level INT DEFAULT 5)

-- The pre-verified problem bank
item(id TEXT PK, skill_id TEXT FK, level INT, kind TEXT,
     stem TEXT, input_type TEXT, payload JSON,   -- visuals, options, drag targets
     answer JSON, answer_type TEXT,              -- 'int' | 'fraction' | 'set' | 'time'
     hint TEXT, worked_solution JSON,            -- ordered steps
     misconception_tags JSON,
     source TEXT,                                -- 'template' | 'grok'
     generator_model TEXT, validated_at DATETIME,
     times_served INT DEFAULT 0, retired BOOL DEFAULT 0)

student(id TEXT PK, display_name TEXT, created_at DATETIME,
        settings JSON)   -- session length, sound, font size, allowed strands

session(id TEXT PK, student_id TEXT, started_at, ended_at,
        items_served INT, items_correct INT, completed BOOL)

attempt(id TEXT PK, session_id TEXT, item_id TEXT, skill_id TEXT, level INT,
        response JSON, correct BOOL, attempt_number INT,
        hint_used BOOL, latency_ms INT, created_at DATETIME)

mastery(student_id TEXT, skill_id TEXT, level INT,
        state TEXT,        -- locked|introduced|practising|mastered|review_due
        ewma_accuracy REAL, streak INT, attempts INT,
        median_latency_ms INT, last_seen_at DATETIME,
        PRIMARY KEY(student_id, skill_id))

review_queue(student_id TEXT, skill_id TEXT, level INT,
             box INT,          -- Leitner 1..5
             due_at DATETIME)

api_usage(id INTEGER PK, called_at DATETIME, model TEXT, purpose TEXT,
          input_tokens INT, output_tokens INT, est_cost_usd REAL,
          items_returned INT, items_accepted INT)
```

---

## 6. The adaptive engine

All of this is plain code. No model calls. Deterministic, testable, debuggable.

### 6.1 Mastery state per skill

Track an exponentially-weighted moving accuracy so recent evidence dominates:

```
ewma = α · outcome + (1 − α) · ewma        α = 0.30
outcome = 1.0 first-try correct
        = 0.6 correct after hint
        = 0.0 incorrect
```

**Level up** (L → L+1) when: `ewma ≥ 0.85` AND at least 5 attempts at the level AND last 3 attempts include no 2-error item.
**Level down** when: `ewma ≤ 0.45` over the last 5 attempts at the level, or two consecutive items each missed twice.
**Mastered** = reached L5 with `ewma ≥ 0.85`, then enters the review queue and stops being a focus node.

### 6.2 Item selection

Per session:
- **Focus node** = highest-priority node by score:
  `priority = 0.5·(1 − ewma) + 0.3·recency_gap_norm + 0.2·prereq_readiness`
  Rotate the focus node daily so no strand goes untouched for more than ~6 sessions. Never run two consecutive sessions on the same node unless it's mid-breakthrough (`ewma` rising).
- **Target difficulty** = current level, with 15% of items drawn one level down (confidence) and 10% one level up (stretch).
- **Review items** = due entries from `review_queue`, oldest first.
- **Never** serve the same `item.id` within 10 days; prefer `times_served = 0`.

### 6.3 Spaced review (Leitner)

Boxes 1→5 with intervals **1, 3, 7, 16, 35 days**. Correct on review → advance a box. Incorrect → back to box 1 and the node re-opens as a focus candidate at one level below its mastered level.

### 6.4 Misconception tracking

Every item carries `misconception_tags` on its distractors (e.g. `regroup_omitted`, `place_value_swap`, `numerator_denominator_reversed`, `perimeter_as_area`, `minutes_read_as_hours`, `skip_count_off_by_one`). When a distractor is chosen, log the tag. Three hits on the same tag in 14 days triggers:
1. A targeted mini-set of 4 items attacking that specific error, and
2. A line in the parent's weekly summary.

This is the highest-value analytics in the whole app — it turns "he got 60%" into "he's forgetting to regroup in the tens column."

---

## 7. Grok integration

### 7.1 Setup

```
Base URL:  https://api.x.ai/v1        (OpenAI-compatible)
Auth:      Authorization: Bearer $XAI_API_KEY   ← server-side env var only
Models:    grok-4.6   flagship — use for the initial bank build and for
                      tricky item types (word problems, worked solutions)
           grok-4.3   cheaper workhorse — nightly top-ups, flavour text
```

Both support **structured outputs** and function calling — use structured outputs (JSON schema) rather than "please return JSON," and you'll cut your rejection rate dramatically. Confirm current model IDs and pricing at `docs.x.ai` before you wire it up; xAI's model lineup has been moving quickly, and they've been migrating from Chat Completions to a Responses API, so check which surface you're targeting.

Key handling: `.env` on the server, `.gitignore` it, never referenced in client code, never in a React bundle. Add a hard monthly spend cap in the xAI console as a second line of defence.

### 7.2 Where the model is used

| # | Job | Model | When | Volume |
|---|---|---|---|---|
| 1 | **Item generation** | grok-4.6 (build), grok-4.3 (top-up) | Batch, offline, cron | ~50–100 items/night, batched 10 per call |
| 2 | **Worked solutions** | grok-4.6 | Same call as generation | Bundled |
| 3 | **Mission flavour text** | grok-4.3 | Weekly, cached | ~20 strings |
| 4 | **Misconception summary for the parent** | grok-4.6 | Weekly, one call | 1 call |
| 5 | ~~Grading~~ | **never** | — | — |

Realistic spend for one student: well under $2/month. Front-load a larger bank build (500–800 items) in Phase 3, then top-ups are trivial.

### 7.3 Generation prompt

**System prompt:**

```
You write math practice problems for a Grade 3 student in Alberta, Canada,
aged 8. Everything you write is set in a friendly space-exploration story:
rockets, planets, moons, rovers, space stations, astronauts, alien creatures,
cargo pods, telescopes.

HARD RULES
1. Reading level: Grade 2. Short sentences. Common words only. A problem stem
   is at most 25 words.
2. Metric units, Canadian spelling.
3. Never write anything scary, violent, or about danger to people. No crashes,
   no running out of oxygen, no one lost in space. Space is fun and safe here.
4. Numbers must stay strictly inside the bounds given in the request.
5. Division must come out evenly unless the request explicitly asks for
   remainders.
6. Subtraction results must be positive.
7. Every distractor must come from a REAL mistake a Grade 3 student makes
   (an off-by-one, a forgotten regroup, a reversed numerator), never a
   random number.
8. The hint must point at the next step. It must NOT contain the answer.
9. Return only valid JSON matching the schema. No commentary.
```

**User prompt template:**

```
Generate {n} problems.

Skill:        {skill_id} — {skill_title}
Level:        {level} of 5 — {level_descriptor}
Alberta outcome: {outcome_text}
Theme:        {theme}
Input type:   {input_type}
Number bounds: {bounds}          e.g. {"a": [100, 999], "b": [10, 99]}
Constraints:  {constraints}      e.g. "requires exactly one regroup"
Avoid stems similar to: {recent_stems_sample}
```

**Response schema (per item):**

```json
{
  "stem": "Rover Pip drove 234 m to the crater, then 158 m more. How far in total?",
  "input_type": "numeric",
  "operands": {"a": 234, "b": 158, "op": "+"},
  "answer": 392,
  "answer_type": "int",
  "unit": "m",
  "distractors": [
    {"value": 382, "misconception": "regroup_omitted"},
    {"value": 76,  "misconception": "wrong_operation"},
    {"value": 492, "misconception": "place_value_carry_twice"}
  ],
  "hint": "Start with the ones. 4 + 8 is more than 10 — what do you do?",
  "worked_solution": [
    "Ones: 4 + 8 = 12. Write 2, carry 1.",
    "Tens: 3 + 5 + 1 = 9.",
    "Hundreds: 2 + 1 = 3.",
    "Total: 392 m."
  ],
  "visual": {"type": "rover_path", "segments": [234, 158]}
}
```

Note that `operands` is separate from `answer`. That's deliberate — it's what makes the validator possible.

### 7.4 The validator (the most important 200 lines in the project)

Every generated item passes all of these or it's discarded:

| Check | Rule |
|---|---|
| **Recompute** | Independently evaluate `operands` in code. `computed == answer` or reject. This catches model arithmetic errors before they reach the child. |
| **Bounds** | All operands and the answer inside the level's declared range. |
| **Sign** | No negative results. |
| **Divisibility** | Integer quotient unless remainders were requested. |
| **Stem consistency** | Numbers appearing in the stem must match `operands`. Regex the digits out and compare. |
| **Distractors** | Unique, ≠ answer, plausible magnitude (within 3× of answer), each has a misconception tag. |
| **Hint leakage** | The answer must not appear as a number in the `hint`. Reject. |
| **Reading level** | Word count ≤ 25; flag any word outside a Grade 3 word list for review. |
| **Safety** | Blocklist scan (die, dead, crash, explode, lost, trapped, starve, alone…). |
| **Duplicate** | Normalized stem hash not already in the bank; operand tuple not already present at that level. |

Log accept/reject rates by skill and level in `api_usage`. If a given cell rejects above ~30%, the prompt for that cell needs work — that's your feedback loop, and it's worth building a tiny CLI report for it.

**Fallback:** every skill/level cell must also have a hand-written procedural template generator that produces valid items with zero AI. If the API is down, the key expires, or the bank runs dry, the app keeps working. The AI adds variety and story; it is never a dependency for the app functioning.

### 7.5 Parent weekly summary prompt

Feed it structured data only (mastery states, top misconception tags, time on task, accuracy deltas) — never raw problem text — and ask for: three sentences on what improved, the single biggest sticking point in plain language, and one specific 10-minute off-screen activity to do together this week.

---

## 8. Progress tracking & the parent dashboard

Separate route (`/parent`), behind a simple 4-digit PIN so he doesn't wander in. This is the one surface built for a laptop rather than the iPad — dense tables, small type, scrolling and CSV export are all fine here, and none of the touch constraints in §9 apply.

**Views:**

1. **Mastery heatmap** — 15 skills × 5 levels grid, colour-coded by state. The single most useful screen. One glance tells you where he is against the whole Grade 3 curriculum.
2. **Trend** — accuracy and items/session over the last 8 weeks, with a rolling average. Flat is fine; falling is a signal.
3. **Attention list** — skills where `ewma < 0.6`, plus the top three active misconception tags with a plain-English explanation of each.
4. **Time on task** — minutes/day, sessions completed vs abandoned. Abandonment rate is your engagement metric; if it climbs, difficulty is mis-tuned.
5. **Curriculum coverage** — % of Alberta Grade 3 outcomes touched and at what mastery. Print/export this before parent–teacher interviews.
6. **Session replay** — last 20 attempts with the actual item, his answer, and time taken. This is where you find out he can do the math but is misreading the question.

**Exports:** CSV of all attempts, and a one-page PDF summary. Everything stays on your machine — no third-party analytics, no telemetry, nothing about your kid leaving the house except the anonymous generation prompts (which contain no student data at all — verify this in code review).

---

## 9. iPad platform specification

### 9.1 Target hardware and layout grid

Design to **CSS points, landscape**. Every current iPad lands between 744 and 1024 points tall:

| Device class | Landscape (CSS pt) | Notes |
|---|---|---|
| iPad mini | 1133 × 744 | **The design floor.** If it works here it works everywhere. |
| iPad / iPad Air 11" | 1180 × 820 | The most likely device. Design here. |
| iPad Air / Pro 13" | 1366 × 1024 | Scale up, don't reflow. |

**Rules:**
- **Landscape only.** Portrait shows a friendly "turn your ship sideways" screen with an animated rotating iPad. Don't build two layouts for one kid. (Manifest `orientation` is unreliable on iPadOS; enforce it in CSS with an orientation media query.)
- **Fixed-viewport layout, zero scrolling.** `height: 100dvh` (not `100vh` — that's the classic Safari toolbar bug), `overflow: hidden` on the root, everything inside a flex layout that scales. The parent dashboard is the only scrollable route.
- **Scale, don't reflow.** Lay out at a 1180 × 820 design canvas and scale with `clamp()` / a root font-size set from viewport units. A kid app has one layout; responsive breakpoints are wasted complexity here.
- **Respect the safe area.** `viewport-fit=cover` plus `env(safe-area-inset-*)` padding, so nothing sits under the home indicator or the rounded corners.

### 9.2 Ergonomics — where things go

He holds the iPad in two hands in landscape, or props it flat on the table. That dictates the layout:

```
┌──────────────────────────────────────────────────────────┐
│  ← palm     progress dots · fuel · pause          palm →  │  ← nothing tappable
│  zone                                             zone    │     in these 60px
│         ┌──────────────────────────────────┐              │
│         │        VISUAL / ILLUSTRATION     │              │  ← eyes, not fingers
│         └──────────────────────────────────┘              │
│              PROBLEM STEM  (32–40 px type)                │
│                                                           │
│   ┌────────┐                          ┌────────────────┐  │
│   │  HINT  │                          │   KEYPAD /     │  │  ← thumb zones
│   │ pencil │                          │   ANSWER INPUT │  │
│   └────────┘                          └────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

- **Primary input bottom-right** (right-thumb reach). Hint and scratchpad bottom-left.
- **Question and visual in the upper 55%**, never covered by a hand or a widget.
- **Minimum touch target 64 × 64 px** — Apple's 44 pt guideline is a floor for adults; children have less precise targeting, so go bigger. Primary actions 88 px+.
- **12 px minimum spacing** between adjacent targets so a fat-finger tap can't hit two things.
- **No hover, no tooltips, no long-press, no right-click.** Every affordance is visible at rest. No gesture the kid has to be taught.
- **No swipe navigation.** iPadOS eats edge swipes for its own multitasking gestures, and a mis-swipe that drops him out of the app mid-problem feels like punishment.
- **Type scale:** problem stem 32–40 px, keypad digits 40 px, body 20 px minimum. He's at arm's length on a couch, not 50 cm from a monitor.

### 9.3 iOS Safari / WebKit checklist

These are the things that will otherwise eat a weekend:

```css
html, body {
  height: 100dvh;
  overflow: hidden;
  overscroll-behavior: none;        /* kill rubber-band bounce + pull-to-refresh */
  touch-action: manipulation;        /* kill 300ms double-tap-to-zoom delay */
  -webkit-touch-callout: none;       /* no "Copy/Look Up" popover on long press */
  -webkit-user-select: none;         /* no accidental text selection while dragging */
  -webkit-tap-highlight-color: transparent;
}
.draggable { touch-action: none; }   /* required or Safari steals the gesture */
```

```html
<meta name="viewport"
      content="width=device-width, initial-scale=1, viewport-fit=cover,
               maximum-scale=1, user-scalable=no">
<link rel="apple-touch-icon" href="/icon-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

| Gotcha | Handling |
|---|---|
| **HTML5 drag-and-drop doesn't exist on iOS** | Use Pointer Events throughout (`@use-gesture/react`, `dnd-kit`, or ~150 lines of your own). Never `dragstart`/`drop`. |
| **Audio won't play until a user gesture** | Unlock the Web Audio context on the first tap of the Launch screen. Use Web Audio (Howler defaults to it) so the physical mute switch doesn't silence feedback sounds. |
| **The 7-day storage cap** | Safari evicts script-writable storage from sites not used in 7 days. **Installed Home Screen web apps are exempt** — one more reason installation is mandatory, not optional. Belt and braces: call `navigator.storage.persist()`, and treat the server as the source of truth so a wipe costs nothing. |
| **Cache API is capped ~50 MB** | Keep the offline bundle lean. Vector art and procedural sound, not video and sample libraries. |
| **Screen dims mid-thought** | `navigator.wakeLock.request('screen')` on session start, re-acquire on `visibilitychange`. Works properly in installed web apps from Safari 18.4 onward; wrap in try/catch and carry on if denied. |
| **Home Screen install is manual** | No install prompt exists on iOS. You do it once yourself: Share → Add to Home Screen. On iPadOS 26 it opens as a full web app by default. |
| **Rotation, app switching, backgrounding** | Persist every attempt to IndexedDB *before* rendering the next item, and restore mid-session state on relaunch. He will hit the home button mid-problem. |
| **No reliable background sync** | Sync the offline attempt queue on app foreground, not in a background worker. |
| **Older iPad GPUs** | Animate `transform` and `opacity` only. No SVG filters, no box-shadow animation, cap particles at ~40. Target a steady 60 fps on an A12. |

### 9.4 Two settings on the iPad itself

Worth doing once, and worth a line in the README:

- **Guided Access** (Settings → Accessibility → Guided Access, then triple-click the top button in the app) locks the iPad to this app for the session. This is the difference between 12 minutes of math and 12 minutes of YouTube.
- **Screen Time → App Limits** as a softer alternative if you'd rather not lock the device.

### 9.5 Testing

Simulator and Chrome device-emulation will not catch the things that matter — palm rejection, drag feel, audio unlock, install behaviour. Test on the actual iPad from day one, with Safari Web Inspector attached over USB from a Mac (Settings → Apps → Safari → Advanced → Web Inspector on the iPad; Develop menu on the Mac). Budget for the fact that a real 8-year-old's finger is the only reliable test instrument for target sizing.

---

## 10. Screen inventory & touch layout

| Screen | Contents | Touch notes |
|---|---|---|
| **Launch** | Ship on the pad, "Start mission", streak flame, today's destination | One giant button, centre-bottom. First tap also unlocks the audio context. |
| **Star map** | Solar system, planets by strand, progress rings, current position | Pinch-zoom explicitly disabled; planets are fixed, tappable, ≥ 100 px. Pan by dragging if the map exceeds the viewport — but prefer a map that fits. |
| **Mission briefing** | 10 s of story setting up the session's skill | Tap anywhere to advance or skip. No small "skip" link. |
| **Problem** | Visual, stem, input widget, hint, scratchpad, progress dots (n of 14) | The §9.2 layout. No scrolling, no timer. |
| **Feedback** | Instant, animated, ≤ 2 s for correct; hint card for incorrect | Auto-advances on correct so he isn't tapping "next" 18 times a session. |
| **Worked example** | Step-by-step reveal, tap anywhere to advance | Full-screen. Steps appear one at a time, large type. |
| **Debrief** | Fuel earned, map movement, one specific piece of praise | |
| **Hangar** | Spend fuel on cosmetic ship parts | Tap-to-select grid, ≥ 140 px tiles. No drag needed. |
| **Mission log** | Badges, planets visited, personal bests | The one student screen allowed to scroll — vertically, with momentum. |
| **Parent** (PIN) | The six views in §8 | Built for a laptop browser, not the iPad. Dense data, small type, scrolling, CSV export — all fine here. Reachable from the iPad but not optimised for it. |

**Visual direction:** flat vector illustration, deep navy and violet space with warm orange/yellow accents for the ship and UI, chunky rounded sans (Baloo 2, Fredoka, or similar), generous whitespace, animation reserved for reward moments — never during a problem, where it's a distraction. Sound on by default with an easy mute; a short satisfying chime for correct, a *neutral* soft tone for incorrect (never a buzzer — buzzers teach shame). Honour `prefers-reduced-motion`, and include an in-app text-size control plus a dyslexia-friendly font option, since web apps don't inherit iPadOS Dynamic Type.

---

## 11. Build phases

| Phase | Deliverable | Notes |
|---|---|---|
| **0. Curriculum** | `curriculum.json` — 15 nodes, ladders, prereqs, outcome refs | No code. Verify against the official Alberta outcomes first. Half a day. |
| **1. Playable core, on the iPad** | React shell at the fixed landscape layout, custom keypad, 4 skills, template-generated items, one session loop, IndexedDB | **No AI yet.** Develop in Chrome for speed, but test on the iPad daily from day one — layout and touch problems don't show up in a desktop browser. Get him playing it in week one and watch his hands, not the screen. |
| **2. Engine + persistence** | SQLite, mastery model, review queue, all 15 skills via templates, all six touch input widgets, parent dashboard v1 | The app is genuinely useful at the end of this phase even if you stop here. |
| **3. Grok pipeline** | Generation prompts, JSON schema, validator, batch job, bank of 500+ verified items | Build the validator *first*, then the generator. Test the validator against deliberately broken items. |
| **4. Adaptive polish** | Misconception engine, targeted remediation sets, weekly parent summary, generated flavour text | |
| **5. Installed app** | HTTPS + local cert, manifest + icons, service worker, full offline play, wake lock, art pass, sound, ship customisation, accessibility | This is where it stops being a website and starts being *his app on his iPad*. Don't defer it further — the Home Screen icon is a surprisingly large part of whether a kid opens it. |

Ship Phase 1 fast. A Grade 3 kid will tell you more in ten minutes of use than a month of spec refinement.

---

## 12. Acceptance criteria

**Correctness (blocking)**
- [ ] 500 randomly sampled bank items independently re-solved by a separate script: **100% agreement**. Not 99%.
- [ ] Validator rejects a deliberately corrupted item set at 100%.
- [ ] No item's hint contains its answer.
- [ ] Every skill/level cell has ≥ 20 available items and a working template fallback.

**Pedagogy**
- [ ] No path through the app shows a countdown timer.
- [ ] Every incorrect answer produces a hint, then a worked solution — never just "wrong."
- [ ] Session accuracy sits in the 70–85% band after two weeks of calibration. Below 65% means it's discouraging; above 90% means it's not teaching.
- [ ] Sessions end at or below current mastery level.

**Engineering**
- [ ] `XAI_API_KEY` appears nowhere in the client bundle (`grep` the build output as a CI step).
- [ ] The app runs a full session with the network unplugged.
- [ ] Every attempt is durably persisted before the next item renders.
- [ ] No student-identifying data is included in any outbound API request.

**iPad (blocking)**
- [ ] The system keyboard never appears anywhere in the student-facing app.
- [ ] No screen in the student app scrolls, at 744 pt viewport height (iPad mini), except the Mission Log.
- [ ] Every interactive target measures ≥ 64 × 64 px in the DOM at the 1180 × 820 design size; primary actions ≥ 88 px.
- [ ] Nothing tappable falls within 60 px of the left or right screen edge on the Problem screen.
- [ ] Every drag interaction completes with a finger on a real iPad, with the dragged token visible above the fingertip throughout.
- [ ] Double-tap does not zoom; long-press does not select text or raise a popover; edge-drag does not navigate.
- [ ] Installs to the Home Screen, opens full-screen with no address bar, and plays a complete session in Airplane Mode.
- [ ] Rotating to portrait mid-problem shows the rotate prompt and returns to the same problem, state intact.
- [ ] Backgrounding the app mid-problem and returning restores the same item and the same answer-in-progress.
- [ ] Sustained 60 fps during map and reward animations on the oldest iPad in the house.

**Engagement**
- [ ] Cold start (tap icon → first problem) under 8 seconds, warm start under 3.
- [ ] Session completion rate above 80% over four weeks.

---

## 13. Risks

| Risk | Mitigation |
|---|---|
| **Model generates a wrong answer key** | The validator. This is why it's non-negotiable. Also spot-check 20 items yourself before he ever sees them. |
| **Built on desktop, breaks on the iPad** | Test on the real device daily from Phase 1. The failure mode is discovering in week six that every drag interaction feels wrong and half the layout scrolls. |
| **Touch targets sized for an adult** | Watch him use it. If he taps twice to hit one thing, the target is too small — no amount of "it meets the 44 pt guideline" survives that observation. |
| **He leaves the app for YouTube** | Guided Access (§9.4). Enable it before you hand the iPad over, not after. |
| **Safari eviction wipes local progress** | Install to the Home Screen, call `persist()`, and keep the server as the source of truth. Never let the only copy of his mastery data live in a browser cache. |
| **Curriculum map is subtly wrong** | Verify against the province's published outcomes and cross-check with his teacher. Store `outcome_ref` on each node so it's auditable. |
| **Difficulty mis-tuned → frustration** | The 70–85% accuracy band is a monitored metric, not a hope. Add a parent override to force a level down. |
| **Novelty wears off in three weeks** | Meta-progression is deliberately slow-burn (planets, not points). Budget a small content refresh — new planet, new ship parts — for week 6. |
| **It becomes a screen-time fight** | Hard 15-minute cap built in, so the app ends the session, not you. |
| **Scope creep kills it before Phase 1 ships** | Phase 1 is four skills and no AI. Resist everything else until he's played it. |
| **Cost surprise** | Spend cap in the xAI console, `api_usage` logging, batch generation only. |

---

## 14. First four things to do

1. Pull the official Alberta Grade 3 math outcomes and write `curriculum.json`. Ask his teacher which strands are already covered this term.
2. Build the Problem screen shell — fixed landscape layout, custom numeric keypad, one hard-coded question — and put it on the iPad **before you write anything else**. Half a day, and it de-risks every layout decision in this document.
3. Write the validator and its test suite before you write a single generation prompt.
4. Build Phase 1 with four skills — `NUM-AS`, `NUM-MD`, `TIM-CLK`, `MEA-PER` — and hand him the iPad.
