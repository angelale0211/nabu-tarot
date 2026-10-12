import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/native/cards_screen.dart';
import 'package:nabu_tarot/native/deck.dart';
import 'package:nabu_tarot/native/lunar.dart';
import 'package:nabu_tarot/native/today_screen.dart';
import 'package:nabu_tarot/native/today_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  final deck = Deck.fromJson(
    jsonDecode(File('assets/cards/cards.json').readAsStringSync()) as Map<String, dynamic>,
    jsonDecode(File('assets/cards/ui.json').readAsStringSync()) as Map<String, dynamic>,
  );
  final lunar = Lunar.fromJson(jsonDecode(File('assets/lunar.json').readAsStringSync()) as Map<String, dynamic>);
  Widget wrap(Widget w) => MaterialApp(home: Scaffold(body: w));

  group('lunar', () {
    test('Tết 2026 is the first day of the first month, year Bính Ngọ, the Horse', () {
      final d = lunar.of(DateTime(2026, 2, 17))!;
      expect([d.day, d.month, d.leap, d.yearName, d.animal], [1, 1, false, 'Bính Ngọ', 6]);
    });
    test('outside the table there is no lunar date, not a wrong one', () {
      expect(lunar.of(DateTime(2025, 12, 31)), isNull);
      expect(lunar.of(DateTime(2032, 1, 1)), isNull);
    });
    test('the line reads in each language', () {
      final d = lunar.of(DateTime(2026, 2, 17))!;
      expect(d.line('vi'), 'Âm lịch 1/1 · năm Bính Ngọ (Ngựa)');
      expect(d.line('en'), 'Lunar 1/1 · Year of the Horse');
      expect(d.line('de'), 'Mondkalender 1.1. · Jahr: Pferd');
    });
  });

  group('cards library', () {
    testWidgets('lists the deck and finds a card by name', (t) async {
      await t.pumpWidget(wrap(CardsScreen(deck: deck, lang: 'en')));
      expect(find.text('The Fool'), findsOneWidget);
      await t.enterText(find.byType(TextField), 'tower');
      await t.pump();
      expect(find.text('The Tower'), findsOneWidget);
      expect(find.text('The Fool'), findsNothing);
    });

    testWidgets('a card opens with its upright and reversed meaning', (t) async {
      await t.pumpWidget(wrap(CardsScreen(deck: deck, lang: 'en')));
      await t.tap(find.text('The Fool'));
      await t.pumpAndSettle();
      final fool = deck.byId('major-0')!.text('en');
      expect(find.text(fool.up), findsOneWidget);
      expect(find.text(fool.rev), findsOneWidget);
    });
  });

  group('today', () {
    setUp(() => SharedPreferences.setMockInitialValues({}));

    testWidgets('shows the lunar line and asks to draw when nothing is drawn yet', (t) async {
      final s = TodayStore(await SharedPreferences.getInstance(), now: () => DateTime(2026, 2, 17, 8));
      var drew = 0;
      await t.pumpWidget(wrap(TodayScreen(deck: deck, lunar: lunar, lang: 'en', store: s, onDraw: () => drew++, onOpen: (_) {})));
      expect(find.text('Lunar 1/1 · Year of the Horse'), findsOneWidget);
      await t.tap(find.byKey(const Key('today-draw')));
      expect(drew, 1);
    });

    testWidgets('shows today\'s card once drawn, and opens Lifestyle and Book on the site', (t) async {
      final s = TodayStore(await SharedPreferences.getInstance(), now: () => DateTime(2026, 2, 17, 8));
      await s.saveDraw('major-0', 'general');
      final opened = <String>[];
      await t.pumpWidget(wrap(TodayScreen(deck: deck, lunar: lunar, lang: 'en', store: s, onDraw: () {}, onOpen: opened.add)));
      expect(find.text('The Fool'), findsOneWidget);
      await t.tap(find.byKey(const Key('open-play')));
      await t.tap(find.byKey(const Key('open-book')));
      expect(opened, ['play', 'book']);
    });
  });
}
