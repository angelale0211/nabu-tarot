import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/native/deck.dart';

void main() {
  final deck = Deck.fromJson(
    jsonDecode(File('assets/cards/cards.json').readAsStringSync()) as Map<String, dynamic>,
    jsonDecode(File('assets/cards/ui.json').readAsStringSync()) as Map<String, dynamic>,
  );

  test('the whole deck, 22 majors and 56 minors, in three languages', () {
    expect(deck.cards.length, 78);
    expect(deck.cards.where((c) => c.suit == 'major').length, 22);
    for (final l in ['vi', 'en', 'de']) {
      expect(deck.cards.every((c) => c.text(l).name.isNotEmpty), true, reason: l);
      expect(deck.cards.every((c) => c.text(l).read != null), true, reason: l);
    }
  });

  test('a card is found by id and speaks the language asked, Vietnamese otherwise', () {
    final fool = deck.byId('major-0')!;
    expect(fool.text('en').name, 'The Fool');
    expect(fool.text('de').name, 'Der Narr');
    expect(fool.text('fr').name, fool.text('vi').name);
    expect(fool.svg, startsWith('<svg'));
    expect(fool.svg, isNot(contains('var(')));
  });

  test('the site\'s own words fill their blanks', () {
    expect(deck.ui('en', 'energyLine', ['openness', 'courage']), 'Right now you carry this energy: openness, courage.');
    expect(deck.ui('vi', 'energyLine', ['a', 'b']), 'Hai từ khóa của bạn lúc này: a và b.');
    expect(deck.ui('en', 'focusHead', ['Love']), 'If love is on your mind');
    expect(deck.ui('de', 'focusHead', ['Liebe']), 'Wenn dich das Thema „Liebe“ beschäftigt');
    expect(deck.ui('fr', 'pickTitle'), deck.ui('vi', 'pickTitle'));
  });

  test('the five focuses, in order, named in each language', () {
    expect(Deck.focuses, ['general', 'love', 'work', 'study', 'money']);
    expect(deck.focusName('de', 'money'), 'Geld');
  });

  group('one card a day', () {
    test('the same day gives the same card back; the next day may differ', () {
      final day1 = DateTime(2026, 10, 12, 9);
      final a = deck.cardOfDay(day1, seed: 'u1');
      expect(deck.cardOfDay(DateTime(2026, 10, 12, 23, 59), seed: 'u1').id, a.id);
      final week = {for (var d = 0; d < 7; d++) deck.cardOfDay(day1.add(Duration(days: d)), seed: 'u1').id};
      expect(week.length, greaterThan(1));
    });

    test('a hand of seven is seven different cards', () {
      final hand = deck.hand(DateTime(2026, 10, 12), seed: 'x');
      expect(hand.length, 7);
      expect(hand.map((c) => c.id).toSet().length, 7);
    });
  });
}
