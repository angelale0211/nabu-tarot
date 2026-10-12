import 'dart:convert';

import 'package:flutter/services.dart';

const _animals = {
  'vi': ['Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn', 'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'],
  'en': ['Rat', 'Buffalo', 'Tiger', 'Cat', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'],
  'de': ['Ratte', 'Büffel', 'Tiger', 'Katze', 'Drache', 'Schlange', 'Pferd', 'Ziege', 'Affe', 'Hahn', 'Hund', 'Schwein'],
};
const _moons = {
  'vi': ['Trăng non', 'Trăng lưỡi liềm đầu tháng', 'Bán nguyệt đầu tháng', 'Trăng khuyết đầu tháng', 'Trăng tròn', 'Trăng khuyết cuối tháng', 'Bán nguyệt cuối tháng', 'Trăng lưỡi liềm cuối tháng'],
  'en': ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'],
  'de': ['Neumond', 'Zunehmende Sichel', 'Erstes Viertel', 'Zunehmender Mond', 'Vollmond', 'Abnehmender Mond', 'Letztes Viertel', 'Abnehmende Sichel'],
};
const _moonIcons = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];

class LunarDay {
  const LunarDay(this.day, this.month, this.leap, this.yearName, this.animal, this.moon);
  final int day, month, animal, moon;
  final bool leap;
  final String yearName;

  String line(String lang) {
    final l = _animals.containsKey(lang) ? lang : 'vi';
    final a = _animals[l]![animal];
    switch (l) {
      case 'en':
        return 'Lunar $day/$month${leap ? ' (leap)' : ''} · Year of the $a';
      case 'de':
        return 'Mondkalender $day.$month.${leap ? ' (Schaltmonat)' : ''} · Jahr: $a';
      default:
        return 'Âm lịch $day/$month${leap ? ' nhuận' : ''} · năm $yearName ($a)';
    }
  }

  String moonLine(String lang) => '${_moonIcons[moon]} ${(_moons[lang] ?? _moons['vi']!)[moon]}';
}

/// The Vietnamese lunar calendar, from assets/lunar.json (made from the
/// site's src/lunar.js by tool/make_lunar_table.js, 2026-2031).
class Lunar {
  Lunar.fromJson(Map<String, dynamic> j)
      : _from = DateTime.parse('${j['from']}'),
        _days = j['days'] as List;

  static Future<Lunar> load() async =>
      Lunar.fromJson(jsonDecode(await rootBundle.loadString('assets/lunar.json')) as Map<String, dynamic>);

  final DateTime _from;
  final List _days;

  LunarDay? of(DateTime date) {
    final i = DateTime.utc(date.year, date.month, date.day).difference(DateTime.utc(_from.year, _from.month, _from.day)).inDays;
    if (i < 0 || i >= _days.length) return null;
    final r = _days[i] as List;
    return LunarDay(r[0] as int, r[1] as int, r[2] == 1, '${r[3]}', r[4] as int, r[5] as int);
  }
}
