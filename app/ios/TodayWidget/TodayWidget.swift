import SwiftUI
import WidgetKit

/// "Today" on the home screen: the date, the Vietnamese lunar date with the
/// year's animal, the moon phase, and a tap that opens Draw in the app
/// (nabutarot://pick). The lunar dates come from lunar.json, made from the
/// site's own src/lunar.js (app/tool/make_lunar_table.js), so the widget
/// and the app always agree.

private enum Lang: String { case vi, en, de }

private let lang: Lang = {
  let code = (Locale.preferredLanguages.first ?? "vi").prefix(2)
  return Lang(rawValue: String(code)) ?? .vi
}()

private let animals: [Lang: [String]] = [
  .vi: ["Chuột", "Trâu", "Hổ", "Mèo", "Rồng", "Rắn", "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"],
  .en: ["Rat", "Buffalo", "Tiger", "Cat", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"],
  .de: ["Ratte", "Büffel", "Tiger", "Katze", "Drache", "Schlange", "Pferd", "Ziege", "Affe", "Hahn", "Hund", "Schwein"],
]
private let moons: [Lang: [String]] = [
  .vi: ["Trăng non", "Trăng lưỡi liềm đầu tháng", "Bán nguyệt đầu tháng", "Trăng khuyết đầu tháng", "Trăng tròn", "Trăng khuyết cuối tháng", "Bán nguyệt cuối tháng", "Trăng lưỡi liềm cuối tháng"],
  .en: ["New Moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full Moon", "Waning gibbous", "Last quarter", "Waning crescent"],
  .de: ["Neumond", "Zunehmende Sichel", "Erstes Viertel", "Zunehmender Mond", "Vollmond", "Abnehmender Mond", "Letztes Viertel", "Abnehmende Sichel"],
]
private let moonIcons = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
private let cta: [Lang: String] = [.vi: "Rút bài hôm nay", .en: "Draw today's card", .de: "Heute eine Karte ziehen"]

struct LunarDay {
  let day: Int, month: Int, leap: Bool, yearName: String, animal: Int, moon: Int

  var line: String {
    let a = animals[lang]![animal]
    switch lang {
    case .vi: return "Âm lịch \(day)/\(month)\(leap ? " nhuận" : "") · năm \(yearName) (\(a))"
    case .en: return "Lunar \(day)/\(month)\(leap ? " (leap)" : "") · Year of the \(a)"
    case .de: return "Mondkalender \(day).\(month).\(leap ? " (Schaltmonat)" : "") · Jahr: \(a)"
    }
  }
  var moonLine: String { moonIcons[moon] + " " + moons[lang]![moon] }
}

enum LunarTable {
  private static let loaded: (from: Date, days: [[Any]])? = {
    guard let url = Bundle.main.url(forResource: "lunar", withExtension: "json"),
          let data = try? Data(contentsOf: url),
          let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
          let fromS = obj["from"] as? String, let days = obj["days"] as? [[Any]] else { return nil }
    let f = DateFormatter()
    f.calendar = Calendar(identifier: .gregorian)
    f.timeZone = .current
    f.dateFormat = "yyyy-MM-dd"
    guard let from = f.date(from: fromS) else { return nil }
    return (from, days)
  }()

  /// The Vietnamese lunar date of this phone's calendar day, as the app shows it.
  static func day(_ date: Date) -> LunarDay? {
    guard let t = loaded else { return nil }
    let cal = Calendar(identifier: .gregorian)
    guard let i = cal.dateComponents([.day], from: cal.startOfDay(for: t.from), to: cal.startOfDay(for: date)).day,
          i >= 0, i < t.days.count else { return nil }
    let r = t.days[i]
    guard r.count >= 6, let d = r[0] as? Int, let m = r[1] as? Int, let l = r[2] as? Int, let y = r[3] as? String,
          let a = r[4] as? Int, let mo = r[5] as? Int else { return nil }
    return LunarDay(day: d, month: m, leap: l == 1, yearName: y, animal: a, moon: mo)
  }
}

struct DayEntry: TimelineEntry {
  let date: Date
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> DayEntry { DayEntry(date: Date()) }
  func getSnapshot(in context: Context, completion: @escaping (DayEntry) -> Void) { completion(DayEntry(date: Date())) }
  func getTimeline(in context: Context, completion: @escaping (Timeline<DayEntry>) -> Void) {
    let cal = Calendar.current
    let now = Date()
    let midnight = cal.startOfDay(for: cal.date(byAdding: .day, value: 1, to: now)!)
    completion(Timeline(entries: [DayEntry(date: now), DayEntry(date: midnight)], policy: .after(midnight)))
  }
}

private let ink = Color(red: 0.231, green: 0.165, blue: 0.369)   // #3B2A5E
private let gold = Color(red: 0.898, green: 0.745, blue: 0.369)  // #E5BE5E
private let ground = Color(red: 0.984, green: 0.933, blue: 0.949) // #FBEEF2

struct TodayView: View {
  let entry: DayEntry
  @Environment(\.widgetFamily) var family

  var body: some View {
    let l = LunarTable.day(entry.date)
    VStack(alignment: .leading, spacing: 4) {
      Text(entry.date, format: .dateTime.weekday(.wide).day().month(.wide).locale(Locale(identifier: lang.rawValue)))
        .font(.system(size: family == .systemSmall ? 13 : 15, weight: .semibold)).foregroundColor(ink).lineLimit(2)
      if let l = l {
        Text(l.line).font(.system(size: 12)).foregroundColor(ink.opacity(0.85)).lineLimit(2)
        Text(l.moonLine).font(.system(size: 12)).foregroundColor(ink.opacity(0.85)).lineLimit(1)
      }
      Spacer(minLength: 0)
      Text(cta[lang]!).font(.system(size: 12, weight: .semibold)).foregroundColor(ink)
        .padding(.horizontal, 10).padding(.vertical, 5)
        .background(Capsule().fill(gold.opacity(0.55)))
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    .widgetURL(URL(string: "nabutarot://pick"))
    .modifier(GroundModifier())
  }
}

private struct GroundModifier: ViewModifier {
  func body(content: Content) -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      content.containerBackground(ground, for: .widget)
    } else {
      content.padding().background(ground)
    }
  }
}

@main
struct TodayWidget: Widget {
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: "NabuToday", provider: Provider()) { entry in
      TodayView(entry: entry)
    }
    .configurationDisplayName("Nabu Tarot")
    .description(lang == .vi ? "Hôm nay theo âm lịch và mặt trăng." : lang == .de ? "Heute nach Mondkalender und Mond." : "Today by the lunar calendar and the moon.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
