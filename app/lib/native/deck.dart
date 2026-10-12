import 'dart:convert';

import 'package:flutter/services.dart';

/// The quick reading for one card, as the site's Draw screen gives it.
class Reading {
  Reading(Map<String, dynamic> j)
      : pos = List<String>.from(j['pos'] as List),
        neg = List<String>.from(j['neg'] as List),
        now = '${j['now']}',
        advice = '${j['advice']}',
        byFocus = {for (final f in ['love', 'work', 'study', 'money']) f: '${j[f]}'};
  final List<String> pos, neg;
  final String now, advice;
  final Map<String, String> byFocus;
}

class CardText {
  CardText(Map<String, dynamic> j)
      : name = '${j['name']}',
        meta = '${j['meta']}',
        kw = List<String>.from(j['kw'] as List? ?? const []),
        up = '${j['up']}',
        rev = '${j['rev']}',
        read = j['read'] == null ? null : Reading(j['read'] as Map<String, dynamic>);
  final String name, meta, up, rev;
  final List<String> kw;
  final Reading? read;
}

class TarotCard {
  TarotCard(Map<String, dynamic> j)
      : id = '${j['id']}',
        suit = '${j['suit']}',
        svg = '${j['svg']}',
        _text = {for (final e in (j['text'] as Map<String, dynamic>).entries) e.key: CardText(e.value as Map<String, dynamic>)};
  final String id, suit, svg;
  final Map<String, CardText> _text;

  /// The card in [lang], or in Vietnamese (the site's own default).
  CardText text(String lang) => _text[lang] ?? _text['vi']!;
}

/// The 78 cards and the site's own words for the native screens, both made
/// from src/ by tool/export_cards.js.
class Deck {
  Deck.fromJson(Map<String, dynamic> cards, this._ui)
      : cards = [for (final c in cards['cards'] as List) TarotCard(c as Map<String, dynamic>)];

  static Future<Deck> load() async => Deck.fromJson(
        jsonDecode(await rootBundle.loadString('assets/cards/cards.json')) as Map<String, dynamic>,
        jsonDecode(await rootBundle.loadString('assets/cards/ui.json')) as Map<String, dynamic>,
      );

  final List<TarotCard> cards;
  final Map<String, dynamic> _ui;

  static const focuses = ['general', 'love', 'work', 'study', 'money'];

  TarotCard? byId(String id) {
    for (final c in cards) {
      if (c.id == id) return c;
    }
    return null;
  }

  Map<String, dynamic> _words(String lang) => (_ui[lang] ?? _ui['vi']) as Map<String, dynamic>;

  /// One of the site's sentences in [lang], its {0} filled the way the site
  /// fills it: keywords joined by "và" in Vietnamese, by commas otherwise; a
  /// focus name in lower case except in German, where nouns keep capitals.
  String ui(String lang, String key, [List<String> args = const []]) {
    final w = _words(lang);
    final s = '${w[key] ?? _words('vi')[key] ?? ''}';
    if (args.isEmpty) return s;
    final l = _ui.containsKey(lang) ? lang : 'vi';
    String v;
    if (key == 'energyLine') {
      v = args.join(l == 'vi' ? ' và ' : ', ');
    } else if (key == 'focusHead') {
      v = l == 'de' ? args.first : args.first.toLowerCase();
    } else {
      v = args.first;
    }
    return s.replaceAll('{0}', v);
  }

  String focusName(String lang, String focus) => '${(_words(lang)['focus'] as Map)[focus]}';
  String navName(String lang, String tab) => '${(_words(lang)['nav'] as Map)[tab]}';

  /// A number from the day and the person, so the same person gets the same
  /// hand all day and a new one tomorrow.
  static int _seed(DateTime day, String seed) {
    final key = '${day.year}-${day.month}-${day.day}|$seed';
    var h = 2166136261;
    for (final c in utf8.encode(key)) {
      h = ((h ^ c) * 16777619) & 0xFFFFFFFF;
    }
    return h;
  }

  /// Seven different cards, face down, for today.
  List<TarotCard> hand(DateTime day, {required String seed}) {
    var x = _seed(day, seed);
    final order = List<int>.generate(cards.length, (i) => i);
    for (var i = order.length - 1; i > 0; i--) {
      x = (x * 1103515245 + 12345) & 0x7FFFFFFF;
      final j = x % (i + 1);
      final t = order[i];
      order[i] = order[j];
      order[j] = t;
    }
    return [for (final i in order.take(7)) cards[i]];
  }

  /// The card of the day: the first card of today's hand.
  TarotCard cardOfDay(DateTime day, {required String seed}) => hand(day, seed: seed).first;
}
