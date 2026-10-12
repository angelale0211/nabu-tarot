import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'shell/web_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark);
  runApp(const NabuApp());
}

class NabuApp extends StatelessWidget {
  const NabuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Nabu Tarot',
      debugShowCheckedModeBanner: false,
      home: WebShell(),
    );
  }
}
