import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nabu_tarot/native/deck.dart';
import 'package:nabu_tarot/native/draw_screen.dart';
import 'package:nabu_tarot/native/today_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

Deck loadDeck() => Deck.fromJson(
      jsonDecode(File('assets/cards/cards.json').readAsStringSync()) as Map<String, dynamic>,
      jsonDecode(File('assets/cards/ui.json').readAsStringSync()) as Map<String, dynamic>,
    );

void main() {
  final deck = loadDeck();
  final day = DateTime(2026, 10, 12, 9);

  Future<TodayStore> store() async {
    final p = await SharedPreferences.getInstance();
    return TodayStore(p, now: () => day);
  }

  setUp(() => SharedPreferences.setMockInitialValues({}));

  Widget wrap(Widget w) => MaterialApp(home: Scaffold(body: w));

  testWidgets('seven cards face down, a tap turns one and gives its reading', (t) async {
    final s = await store();
    await t.pumpWidget(wrap(DrawScreen(deck: deck, lang: 'en', store: s)));
    expect(find.byKey(const Key('facedown')), findsNWidgets(7));
    await t.tap(find.byKey(const Key('facedown')).at(2));
    await t.pumpAndSettle();
    final drawn = deck.hand(day, seed: s.seed).elementAt(2);
    expect(find.text(drawn.text('en').name), findsOneWidget);
    expect(find.text('Energy right now'), findsOneWidget);
    expect(s.drawnToday, drawn.id);
  });

  testWidgets('the card drawn today is shown again, not a new hand', (t) async {
    final s = await store();
    await s.saveDraw('major-0', 'love');
    await t.pumpWidget(wrap(DrawScreen(deck: deck, lang: 'en', store: s)));
    expect(find.byKey(const Key('facedown')), findsNothing);
    expect(find.text('The Fool'), findsOneWidget);
    expect(find.text('If love is on your mind'), findsOneWidget);
  });

  testWidgets('the focus chosen before drawing picks the part of the reading', (t) async {
    final s = await store();
    await t.pumpWidget(wrap(DrawScreen(deck: deck, lang: 'en', store: s)));
    await t.tap(find.text('Money'));
    await t.pump();
    await t.tap(find.byKey(const Key('facedown')).first);
    await t.pumpAndSettle();
    final drawn = deck.hand(day, seed: s.seed).first;
    expect(find.text(drawn.text('en').read!.byFocus['money']!), findsOneWidget);
  });

  test('yesterday\'s draw is not today\'s', () async {
    SharedPreferences.setMockInitialValues({});
    final p = await SharedPreferences.getInstance();
    await TodayStore(p, now: () => DateTime(2026, 10, 11, 22)).saveDraw('major-1', 'general');
    expect(TodayStore(p, now: () => day).drawnToday, isNull);
  });
}
