# German for Nabu Tarot — the glossary every window works from

Read this **before** translating anything. Four windows translating separately
will otherwise write *Kelche* in one file and *Becher* in another, *Legung* here
and *Auslage* there — and that reads worse than leaving it in English, because
it looks careless rather than untranslated.

---

## 1. The words that must not drift

| English | German | Not |
|---|---|---|
| Major Arcana | **Große Arkana** | Große Geheimnisse |
| Minor Arcana | **Kleine Arkana** | Kleine Geheimnisse |
| Wands | **Stäbe** | Stäbchen, Zepter |
| Cups | **Kelche** | Becher, Tassen |
| Swords | **Schwerter** | — |
| Pentacles | **Münzen** | Pentakel, Scheiben, Denare |
| Ace | **Ass** | Eins |
| Page | **Bube** | Page, Prinz |
| Knight | **Ritter** | — |
| Queen | **Königin** | Dame |
| King | **König** | — |
| Court cards | **Hofkarten** | Königskarten |
| a spread | **eine Legung** | Auslage, Spread |
| to draw a card | **eine Karte ziehen** | eine Karte greifen |
| upright | **aufrecht** | aufgerichtet |
| reversed | **umgekehrt** | gedreht, revers |
| keywords | **Stichworte** | Schlüsselwörter |
| reading (the session) | **Legung** / **Beratung** | Lesung |
| Fire · Water · Air · Earth | **Feuer · Wasser · Luft · Erde** | — |

### The 22 Major Arcana, fixed

0 Der Narr · I Der Magier · II Die Hohepriesterin · III Die Herrscherin ·
IV Der Herrscher · V Der Hierophant · VI Die Liebenden · VII Der Wagen ·
VIII Die Kraft · IX Der Eremit · X Das Rad des Schicksals · XI Die Gerechtigkeit ·
XII **Der Gehängte** · XIII Der Tod · XIV **Die Mäßigkeit** · XV Der Teufel ·
XVI Der Turm · XVII Der Stern · XVIII Der Mond · XIX Die Sonne ·
XX **Das Gericht** · XXI Die Welt

Pip and court names are built by `LEX.de`: `Ass der Kelche`, `Zehn der Schwerter`,
`Ritter der Stäbe`, `Königin der Münzen`.

### Lenormand keeps its German originals

Lenormand **is** a German deck. Do not translate the English back — use the
original names: *Der Reiter, Der Klee, Das Schiff, Das Haus, Der Baum, Die
Wolken, Die Schlange, Der Sarg, Der Blumenstrauß, Die Sense, Die Rute, Die
Eulen/Die Vögel, Das Kind, Der Fuchs, Der Bär, Die Sterne, Der Storch, Der Hund,
Der Turm, Der Park, Der Berg, Die Wege, Die Mäuse, Das Herz, Der Ring, Das Buch,
Der Brief, Der Herr, Die Dame, Die Lilie, Die Sonne, Der Mond, Der Schlüssel,
Die Fische, Der Anker, Das Kreuz.*

---

## 2. The voice

- **du**, never *Sie*. This app talks to one person, warmly.
- Short sentences. One idea per sentence. The owner asks for this in every
  language, and it matters most where a reader is deciding whether to trust you.
- Everyday German, not esoteric-catalogue German. *Was die Karte sagt*, not
  *Die Aussage der Karte im Kontext der Legung*.
- Imperatives in the friendly short form: *Wähl*, *Tipp*, *Schau*, *Melde dich
  an* — not *Wählen Sie*.
- A card never promises. *Ein Segen ist ein Segen, kein Versprechen.* Keep that
  register: the German must not sound more certain than the English.
- Never claim the app is fully German while stages 2–5 are unfinished.

## 3. Prices, in one line

Vietnamese **đ**, English **$**, German **€**, all from `MONEY` in
`src/services.js`. **Never type a price into a sentence** — that is how
`luckOffer` and `pickOffer` ended up saying 79.000đ in a euro interface.

---

## 4. The traps that cost hours

**Encode before you open.** `io.open(p,'wb').write(s.encode())` empties the file
first and encodes second, so a bad character truncates it to nothing.

```python
data = s.encode('utf-8')                 # encode first
with io.open(p, 'wb') as fh: fh.write(data)
```

**No bash heredocs for German text.** Backslashes are eaten and `’` becomes
a lone surrogate. Use the Write tool.

**Assert your anchors.** `assert s.count(old) == 1` before every replace. Half
the failed patches in this project were an anchor matching twice or not at all.

**An apostrophe closes the string.** `person's` inside a single-quoted JS string
blanks the entire app. Escape it, or reword.

**One file, one window.** Never open a file another window is writing.

**Nobody runs `build.py`. Nobody runs `test/run.py`. Nobody commits.**
`index.html` is a build artefact where the last writer wins, and the suite binds
port 8765 — two runs at once and both report nothing. One window builds at the
end.

---

## 5. Where the German lives

| Stage | New file | Fills |
|---|---|---|
| 1 ✔ done | — | `STR.de` in `strings.js` |
| 2 ✔ done | `src/tarot-de.js`, `src/len-de.js`, `src/quiz-tarot-de.js` | `LEX.de`, `DECKTEXT.de`, `LEN.de`, the 40 quiz questions |
| 3 | `src/insight-de.js` | `INSIGHT.de` |
| 4 | `src/kb-guides-de.js`, `src/lessons-de.js` | guides, lessons |
| 5 | `src/kb-questions-de.js` | the AI knowledge base |

`deDefaults()` in `src/main.js` fills German from English wherever it is still
missing, so a half-finished stage never blanks the app — but it only fills what
is `undefined`, so a real `de` is never overwritten.
