package app.nabutarot.nabu_tarot

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import io.flutter.embedding.android.FlutterFragmentActivity

// Edge to edge on every Android version, as Android 15 does by default: the
// app draws behind the status and navigation bars and keeps its content clear
// of them itself (lib/shell/app_page.dart).
class MainActivity : FlutterFragmentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
    }
}
