import 'package:flutter/material.dart';

import 'deck.dart';
import 'look.dart';
import 'today_store.dart';

/// Draw a card, on the phone itself: choose a focus, seven cards face down,
/// tap the one that draws you, read the quick reading. One draw a day, as on
/// the site; coming back the same day shows today's card again.
class DrawScreen extends StatefulWidget {
  const DrawScreen({super.key, required this.deck, required this.lang, required this.store, this.onLearn});
  final Deck deck;
  final String lang;
  final TodayStore store;

  /// Opens the Tarot course (the full meaning).
  final VoidCallback? onLearn;

  @override
  State<DrawScreen> createState() => _DrawScreenState();
}

class _DrawScreenState extends State<DrawScreen> {
  late String focus = widget.store.focusToday;
  TarotCard? drawn;

  @override
  void initState() {
    super.initState();
    final id = widget.store.drawnToday;
    if (id != null) drawn = widget.deck.byId(id);
  }

  Future<void> _draw(TarotCard c) async {
    await widget.store.saveDraw(c.id, focus);
    setState(() => drawn = c);
  }

  @override
  Widget build(BuildContext context) {
    final d = widget.deck, l = widget.lang;
    final tt = Theme.of(context).textTheme;
    return ListView(padding: const EdgeInsets.fromLTRB(16, 16, 16, 32), children: [
      Text(drawn == null ? d.ui(l, 'pickTitle') : d.ui(l, 'yourCard'), style: tt.headlineSmall),
      const SizedBox(height: 10),
      if (drawn == null) ...[
        Wrap(spacing: 8, runSpacing: 8, children: [
          for (final f in Deck.focuses)
            ChoiceChip(
              label: Text(d.focusName(l, f)),
              selected: focus == f,
              onSelected: (_) => setState(() => focus = f),
            ),
        ]),
        const SizedBox(height: 14),
        Text(d.ui(l, 'tapACard'), style: tt.bodyMedium),
        const SizedBox(height: 16),
        Wrap(alignment: WrapAlignment.center, spacing: 10, runSpacing: 12, children: [
          for (final c in d.hand(widget.store.now, seed: widget.store.seed))
            KeyedSubtree(
              key: ValueKey(c.id),
              child: GestureDetector(key: const Key('facedown'), onTap: () => _draw(c), child: const CardBack(width: 72)),
            ),
        ]),
      ] else
        _Reveal(deck: d, lang: l, card: drawn!, focus: widget.store.focusToday, onLearn: widget.onLearn),
    ]);
  }
}

class _Reveal extends StatelessWidget {
  const _Reveal({required this.deck, required this.lang, required this.card, required this.focus, this.onLearn});
  final Deck deck;
  final String lang, focus;
  final TarotCard card;
  final VoidCallback? onLearn;

  @override
  Widget build(BuildContext context) {
    final t = card.text(lang), r = t.read!, d = deck, l = lang;
    final tt = Theme.of(context).textTheme;
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Center(child: CardFace(card, width: 150)),
      const SizedBox(height: 12),
      Text(t.name, textAlign: TextAlign.center, style: tt.headlineSmall),
      Text(t.meta, textAlign: TextAlign.center, style: tt.bodyMedium?.copyWith(color: Look.inkSoft)),
      ReadingBlock(d.ui(l, 'energyNow'), '${d.ui(l, 'energyLine', r.pos.take(2).toList())}\n\n${r.now}'),
      if (focus == 'general')
        ReadingBlock(d.ui(l, 'adviceHead'), r.advice)
      else
        ReadingBlock(d.ui(l, 'focusHead', [d.focusName(l, focus)]), r.byFocus[focus] ?? r.advice),
      const SizedBox(height: 14),
      Text(d.ui(l, 'pickTeaser'), style: tt.bodyMedium?.copyWith(color: Look.inkSoft)),
      const SizedBox(height: 8),
      if (onLearn != null)
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: Look.back),
          onPressed: onLearn,
          child: Text('${d.ui(l, 'pickTeaserBtn')} →'),
        ),
    ]);
  }
}
