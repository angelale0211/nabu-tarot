package app.nabutarot.nabu_tarot

import android.os.Bundle
import androidx.core.view.WindowCompat
import io.flutter.embedding.android.FlutterFragmentActivity

// Edge to edge on every Android version, as Android 15 does by default: the
// app draws behind the status and navigation bars (see-through, set in the
// themes) and the page keeps clear of them (lib/shell/host.dart _watchInsets).
// No bar colours from code: Android 15 deprecated that (proguard-rules.pro).
class MainActivity : FlutterFragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        super.onCreate(savedInstanceState)
    }
}
