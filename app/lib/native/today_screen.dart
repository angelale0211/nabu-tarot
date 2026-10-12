import 'package:flutter/material.dart';

import 'deck.dart';
import 'look.dart';
import 'lunar.dart';
import 'today_store.dart';

const _weekdays = {
  'vi': ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'],
  'en': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  'de': ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
};
const _months = {
  'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  'de': ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
};

String dateLine(DateTime d, String lang) {
  final wd = (_weekdays[lang] ?? _weekdays['vi']!)[d.weekday - 1];
  switch (lang) {
    case 'en':
      return '$wd, ${d.day} ${_months['en']![d.month - 1]} ${d.year}';
    case 'de':
      return '$wd, ${d.day}. ${_months['de']![d.month - 1]} ${d.year}';
    default:
      return '$wd, ngày ${d.day} tháng ${d.month} năm ${d.year}';
  }
}

/// Today, on the phone: the date, the Vietnamese lunar date and the moon,
/// today's card (or a way to draw it), and the doors to the rest of Nabu.
class TodayScreen extends StatelessWidget {
  const TodayScreen({
    super.key,
    required this.deck,
    required this.lunar,
    required this.lang,
    required this.store,
    required this.onDraw,
    required this.onOpen,
  });
  final Deck deck;
  final Lunar lunar;
  final String lang;
  final TodayStore store;
  final VoidCallback onDraw;

  /// Opens a route of the site ('play', 'book').
  final void Function(String route) onOpen;

  @override
  Widget build(BuildContext context) {
    final now = store.now, l = lang, tt = Theme.of(context).textTheme;
    final ld = lunar.of(now);
    final id = store.drawnToday;
    final card = id == null ? null : deck.byId(id);
    final drawLabel = {'vi': 'Rút bài hôm nay', 'en': "Draw today's card", 'de': 'Heute eine Karte ziehen'}[l] ?? 'Rút bài hôm nay';
    return ListView(padding: const EdgeInsets.fromLTRB(16, 18, 16, 32), children: [
      Text(dateLine(now, l), style: tt.headlineSmall),
      if (ld != null) ...[
        const SizedBox(height: 6),
        Text(ld.line(l), style: tt.bodyMedium),
        Text(ld.moonLine(l), style: tt.bodyMedium),
      ],
      const SizedBox(height: 18),
      Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Look.surface, borderRadius: BorderRadius.circular(18)),
        child: card == null
            ? Row(children: [
                const CardBack(width: 54),
                const SizedBox(width: 16),
                Expanded(
                  child: FilledButton(
                    key: const Key('today-draw'),
                    style: FilledButton.styleFrom(backgroundColor: Look.back, minimumSize: const Size(0, 48)),
                    onPressed: onDraw,
                    child: Text(drawLabel),
                  ),
                ),
              ])
            : InkWell(
                onTap: onDraw,
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  CardFace(card, width: 64),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(deck.ui(l, 'yourCard'), style: tt.bodyMedium?.copyWith(color: Look.inkSoft)),
                      Text(card.text(l).name, style: tt.titleMedium),
                      const SizedBox(height: 4),
                      Text(card.text(l).read?.now ?? '', maxLines: 4, overflow: TextOverflow.ellipsis, style: tt.bodyMedium),
                    ]),
                  ),
                ]),
              ),
      ),
      const SizedBox(height: 18),
      Row(children: [
        Expanded(child: _Door(key: const Key('open-play'), icon: Icons.spa_outlined, label: deck.navName(l, 'play'), onTap: () => onOpen('play'))),
        const SizedBox(width: 12),
        Expanded(child: _Door(key: const Key('open-book'), icon: Icons.event_available_outlined, label: deck.navName(l, 'book'), onTap: () => onOpen('book'))),
      ]),
    ]);
  }
}

class _Door extends StatelessWidget {
  const _Door({super.key, required this.icon, required this.label, required this.onTap});
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
        color: Look.surface,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 18),
            child: Column(children: [
              Icon(icon, color: Look.ink),
              const SizedBox(height: 6),
              Text(label, style: const TextStyle(color: Look.ink, fontWeight: FontWeight.w600)),
            ]),
          ),
        ),
      );
}
