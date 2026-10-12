import 'package:flutter/material.dart';

import 'deck.dart';
import 'look.dart';

/// All 78 cards, on the phone: search by name, open one for its picture and
/// its upright and reversed meaning.
class CardsScreen extends StatefulWidget {
  const CardsScreen({super.key, required this.deck, required this.lang});
  final Deck deck;
  final String lang;

  @override
  State<CardsScreen> createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  String q = '';

  @override
  Widget build(BuildContext context) {
    final l = widget.lang;
    final shown = widget.deck.cards.where((c) => q.isEmpty || c.text(l).name.toLowerCase().contains(q.toLowerCase())).toList();
    return Column(children: [
      Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
        child: TextField(
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.search),
            hintText: {'vi': 'Tìm lá bài', 'en': 'Find a card', 'de': 'Karte suchen'}[l] ?? 'Tìm lá bài',
            filled: true,
            fillColor: Look.surface,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
          ),
          onChanged: (v) => setState(() => q = v.trim()),
        ),
      ),
      Expanded(
        child: ListView.builder(
          itemCount: shown.length,
          itemBuilder: (context, i) {
            final c = shown[i], t = c.text(l);
            return ListTile(
              leading: CardFace(c, width: 30),
              title: Text(t.name, style: const TextStyle(color: Look.ink, fontWeight: FontWeight.w600)),
              subtitle: Text(t.meta, style: const TextStyle(color: Look.inkSoft)),
              onTap: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => CardPage(card: c, lang: l))),
            );
          },
        ),
      ),
    ]);
  }
}

class CardPage extends StatelessWidget {
  const CardPage({super.key, required this.card, required this.lang});
  final TarotCard card;
  final String lang;

  @override
  Widget build(BuildContext context) {
    final t = card.text(lang);
    final up = {'vi': 'Chiều xuôi', 'en': 'Upright', 'de': 'Aufrecht'}[lang] ?? 'Chiều xuôi';
    final rev = {'vi': 'Chiều ngược', 'en': 'Reversed', 'de': 'Umgekehrt'}[lang] ?? 'Chiều ngược';
    return Scaffold(
      appBar: AppBar(title: Text(t.name), backgroundColor: Look.ground, foregroundColor: Look.ink),
      body: ListView(padding: const EdgeInsets.fromLTRB(16, 8, 16, 32), children: [
        Center(child: CardFace(card, width: 170)),
        const SizedBox(height: 10),
        Text(t.meta, textAlign: TextAlign.center, style: const TextStyle(color: Look.inkSoft)),
        if (t.kw.isNotEmpty) Text(t.kw.join(' · '), textAlign: TextAlign.center, style: const TextStyle(color: Look.ink)),
        ReadingBlock(up, t.up),
        ReadingBlock(rev, t.rev),
      ]),
    );
  }
}
