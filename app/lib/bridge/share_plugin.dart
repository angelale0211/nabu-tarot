import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:share_plus/share_plus.dart';

import 'plugin.dart';

/// The phone's share sheet, for what the site hands navigator.share on
/// Android (assets/android_bridge.js) - text, a link, or files such as a
/// calendar entry or a picture, which then go to Calendar, Photos or Files.
class SharePlugin implements NativePlugin {
  @override
  String get name => 'Share';

  @override
  Stream<(String, Object?)> get events => const Stream.empty();

  @override
  Future<Object?> call(String method, Map<String, Object?> args) async {
    if (method != 'share') throw PluginError('Share.$method is not in this app');
    // Written to the app's own cache under their real names first: a file made
    // from bytes alone reaches the share sheet without a name, and fails.
    final files = <XFile>[];
    final list = (args['files'] as List? ?? const []).whereType<Map>().toList();
    if (list.isNotEmpty) {
      final dir = await Directory('${Directory.systemTemp.path}/nabu-share-${DateTime.now().microsecondsSinceEpoch}').create(recursive: true);
      for (final f in list) {
        final file = File('${dir.path}/${safeFileName('${f['name'] ?? ''}')}');
        await file.writeAsBytes(base64Decode('${f['data'] ?? ''}'));
        files.add(XFile(file.path, mimeType: '${f['type'] ?? 'application/octet-stream'}'));
      }
    }
    final text = [args['text'], args['url']].whereType<String>().where((s) => s.isNotEmpty).join(' ');
    final title = args['title'] is String && (args['title'] as String).isNotEmpty ? args['title'] as String : null;
    if (files.isEmpty && text.isEmpty) throw const PluginError('nothing to share');
    final r = await SharePlus.instance.share(ShareParams(
      files: files.isEmpty ? null : files,
      text: text.isEmpty ? null : text,
      subject: title,
    ));
    if (r.status == ShareResultStatus.dismissed) throw const PluginError('closed', code: 'cancelled');
    return null;
  }
}

/// A file name the phone accepts: no folders, nothing odd, never empty.
String safeFileName(String name) {
  final n = name.split(RegExp(r'[\\/]')).last.replaceAll(RegExp(r'[^A-Za-z0-9._ -]'), '_').trim();
  return n.isEmpty || n.startsWith('.') ? 'nabu$n' : n;
}
