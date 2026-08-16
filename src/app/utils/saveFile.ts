import { isNative } from "./platform";

/**
 * Save a text file so the user actually gets it — on the web AND inside the
 * native app.
 *
 * Why this exists: the usual web trick (Blob + <a download> + click) silently
 * does nothing inside Android's WebView and iOS's WKWebView. In the Capacitor
 * builds we instead write the file to the app's Cache directory and hand it to
 * the OS share sheet, which is the native equivalent of "download" (it lets the
 * user open it in their calendar app, save it to Files, mail it, etc.).
 */
export async function saveTextFile(filename: string, contents: string, mime: string): Promise<boolean> {
  if (isNative()) {
    try {
      const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([
        import("@capacitor/filesystem"),
        import("@capacitor/share"),
      ]);
      await Filesystem.writeFile({
        path: filename,
        data: contents,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      const { uri } = await Filesystem.getUri({ path: filename, directory: Directory.Cache });
      await Share.share({ title: filename, url: uri });
      return true;
    } catch {
      // User dismissed the share sheet, or the plugin is unavailable — fall
      // through to the web path rather than failing silently.
    }
  }

  try {
    const blob = new Blob([contents], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}
