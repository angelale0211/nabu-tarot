import 'dart:convert';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';

/// ios/TodayWidget/lunar.json is made by tool/make_lunar_table.js from the
/// site's own src/lunar.js. Checked here against dates known independently.
void main() {
  final t = jsonDecode(File('ios/TodayWidget/lunar.json').readAsStringSync()) as Map<String, dynamic>;
  final days = t['days'] as List;
  List<dynamic> on(String iso) => days[DateTime.parse(iso).difference(DateTime.parse(t['from'] as String)).inDays] as List;

  test('the table covers 2026 to the end of 2031, one row a day', () {
    expect(t['from'], '2026-01-01');
    expect(days.length, DateTime(2032, 1, 1).difference(DateTime(2026, 1, 1)).inDays);
  });

  test('Tết falls on the Vietnamese dates', () {
    // [day, month, leap, yearCanChi, animalIndex, moonPhaseIndex]
    expect(on('2026-02-17').sublist(0, 4), [1, 1, 0, 'Bính Ngọ']);
    expect(on('2027-02-06').sublist(0, 4), [1, 1, 0, 'Đinh Mùi']);
    expect(on('2028-01-26').sublist(0, 4), [1, 1, 0, 'Mậu Thân']);
    expect(on('2026-02-16')[1], 12); // the last day of the Ất Tỵ year
    expect(on('2026-02-16')[3], 'Ất Tỵ');
  });

  test('the leap month of 2028 is marked', () {
    // 2028 has a leap fifth month (tháng 5 nhuận), 2028-06-23 .. 2028-07-21.
    expect(on('2028-07-01')[1], 5);
    expect(on('2028-07-01')[2], 1);
  });

  test('the animal and moon phase indices are in range', () {
    for (final d in days) {
      expect((d as List)[4], inInclusiveRange(0, 11));
      expect(d[5], inInclusiveRange(0, 7));
    }
    expect(on('2026-02-17')[4], 6); // the Horse
  });
}
