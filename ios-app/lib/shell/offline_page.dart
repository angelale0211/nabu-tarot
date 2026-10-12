import 'dart:io';

import 'package:flutter/material.dart';

const _words = {
  'vi': ('Không có kết nối.', 'Thử lại'),
  'en': ('No connection.', 'Try again'),
  'de': ('Keine Verbindung.', 'Noch einmal'),
};

/// The phone's language if the site speaks it, Vietnamese otherwise
/// (the site's own default).
String offlineLang(String locale) {
  final l = locale.split(RegExp('[_-]')).first.toLowerCase();
  return _words.containsKey(l) ? l : 'vi';
}

/// Shown instead of a blank page when the site cannot be reached.
class OfflinePage extends StatelessWidget {
  const OfflinePage({super.key, required this.onRetry});
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final w = _words[offlineLang(Platform.localeName)]!;
    return Container(
      color: const Color(0xFFFBEEF2),
      alignment: Alignment.center,
      padding: const EdgeInsets.all(32),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Image.asset('assets/badge.png', width: 120, height: 120),
        const SizedBox(height: 24),
        Text(w.$1, textAlign: TextAlign.center, style: const TextStyle(fontSize: 18, color: Color(0xFF3B2A5E))),
        const SizedBox(height: 20),
        FilledButton(
          style: FilledButton.styleFrom(backgroundColor: const Color(0xFF3D2A6E), minimumSize: const Size(160, 48)),
          onPressed: onRetry,
          child: Text(w.$2),
        ),
      ]),
    );
  }
}
