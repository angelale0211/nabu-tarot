import 'dart:math';

import 'package:shared_preferences/shared_preferences.dart';

/// What the native screens remember on the phone: who this phone is (a
/// random seed, so each phone gets its own hand) and today's draw.
class TodayStore {
  TodayStore(this._p, {DateTime Function()? now}) : _now = now ?? DateTime.now;
  final SharedPreferences _p;
  final DateTime Function() _now;

  static const _kSeed = 'nabu.seed', _kDay = 'nabu.draw.day', _kCard = 'nabu.draw.card', _kFocus = 'nabu.draw.focus';

  DateTime get now => _now();
  String get _today {
    final d = _now();
    return '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
  }

  String get seed {
    var s = _p.getString(_kSeed);
    if (s == null) {
      final r = Random.secure();
      s = List.generate(16, (_) => r.nextInt(16).toRadixString(16)).join();
      _p.setString(_kSeed, s);
    }
    return s;
  }

  /// The id of the card drawn today, or null.
  String? get drawnToday => _p.getString(_kDay) == _today ? _p.getString(_kCard) : null;
  String get focusToday => (_p.getString(_kDay) == _today ? _p.getString(_kFocus) : null) ?? 'general';

  Future<void> saveDraw(String cardId, String focus) async {
    await _p.setString(_kDay, _today);
    await _p.setString(_kCard, cardId);
    await _p.setString(_kFocus, focus);
  }
}
