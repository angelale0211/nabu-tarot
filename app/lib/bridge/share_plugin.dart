import 'dart:async';
import 'dart:convert';

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
    final files = <XFile>[
      for (final f in (args['files'] as List? ?? const []))
        if (f is Map)
          XFile.fromData(base64Decode('${f['data'] ?? ''}'), name: '${f['name'] ?? 'nabu'}', mimeType: '${f['type'] ?? 'application/octet-stream'}'),
    ];
    final text = [args['text'], args['url']].whereType<String>().where((s) => s.isNotEmpty).join(' ');
    final title = args['title'] is String && (args['title'] as String).isNotEmpty ? args['title'] as String : null;
    if (files.isEmpty && text.isEmpty) throw const PluginError('nothing to share');
    final r = await SharePlus.instance.share(ShareParams(
      files: files.isEmpty ? null : files,
      fileNameOverrides: files.isEmpty ? null : [for (final f in files) f.name],
      text: text.isEmpty ? null : text,
      subject: title,
    ));
    if (r.status == ShareResultStatus.dismissed) throw const PluginError('closed', code: 'cancelled');
    return null;
  }
}
