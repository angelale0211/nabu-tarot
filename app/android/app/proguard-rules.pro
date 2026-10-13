# Android 15 deprecated colouring the system bars from code; Play flags any app
# that still contains such calls (Flutter's embedding and androidx have them for
# older Android). The app is edge to edge with see-through bars set in its
# themes (res/values*/styles.xml), so these calls are removed from the build.
-assumenosideeffects class android.view.Window {
    public void setStatusBarColor(int);
    public void setNavigationBarColor(int);
    public void setNavigationBarDividerColor(int);
}
