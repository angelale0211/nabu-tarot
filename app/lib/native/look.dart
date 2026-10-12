import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'deck.dart';

/// The site's colours (src/shell.html, the pink theme).
class Look {
  static const ground = Color(0xFFFBEEF2);
  static const surface = Color(0xFFFFF9FB);
  static const ink = Color(0xFF3B2A5E);
  static const inkSoft = Color(0xFF6B5A86);
  static const gold = Color(0xFFE5BE5E);
  static const back = Color(0xFF3D2A6E);

  static ThemeData theme() => ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: ground,
        colorScheme: ColorScheme.fromSeed(seedColor: back, surface: surface),
        textTheme: const TextTheme(
          headlineSmall: TextStyle(color: ink, fontFamily: 'serif', fontWeight: FontWeight.w600),
          titleMedium: TextStyle(color: ink, fontWeight: FontWeight.w600),
          bodyMedium: TextStyle(color: ink, height: 1.45),
        ),
      );
}

/// A card face: the site's own drawing.
class CardFace extends StatelessWidget {
  const CardFace(this.card, {super.key, this.width = 120});
  final TarotCard card;
  final double width;

  @override
  Widget build(BuildContext context) => SizedBox(
        width: width,
        height: width * 1.72,
        child: SvgPicture.string(card.svg, fit: BoxFit.contain),
      );
}

/// A card back, the crescent the site prints on every back.
class CardBack extends StatelessWidget {
  const CardBack({super.key, this.width = 64});
  final double width;

  @override
  Widget build(BuildContext context) => Container(
        width: width,
        height: width * 1.72,
        decoration: BoxDecoration(
          color: Look.back,
          borderRadius: BorderRadius.circular(width * 0.12),
          border: Border.all(color: Look.gold, width: 1.5),
          boxShadow: const [BoxShadow(color: Color(0x33281946), blurRadius: 8, offset: Offset(0, 3))],
        ),
        alignment: Alignment.center,
        child: Icon(Icons.nightlight_round, color: Look.gold, size: width * 0.42),
      );
}

/// A titled block of reading text.
class ReadingBlock extends StatelessWidget {
  const ReadingBlock(this.title, this.body, {super.key});
  final String title, body;

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        margin: const EdgeInsets.only(top: 12),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: Look.surface, borderRadius: BorderRadius.circular(14)),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(body, style: Theme.of(context).textTheme.bodyMedium),
        ]),
      );
}
