/* ============================ astrology knowledge ============================
   Planets, houses and aspects as taught in mainstream Western astrology
   (the material a reader meets on astro.com or astro-seek). Plain language. */
const PLANETS = [
  { id: 'sun', g: '☉', name: { vi: 'Mặt Trời', en: 'Sun', de: 'Sonne' }, rules: 'leo',
    vi: 'Cái tôi, sức sống, hướng sống. Cung Mặt Trời là cung bạn hay tự nhận. Mặt Trời đi hết vòng hoàng đạo trong một năm, ở mỗi cung khoảng một tháng.',
    en: 'Ego, vitality, life direction. Your Sun sign is the one you usually name. The Sun goes round the zodiac in a year, about a month in each sign.',
    de: 'Ich, Lebenskraft und bewusste Lebensrichtung. Dein Sonnenzeichen ist das Zeichen, das du normalerweise nennst, wenn du nach deinem Sternzeichen gefragt wirst. Die Sonne durchläuft den Tierkreis in einem Jahr und bleibt ungefähr einen Monat in jedem Zeichen.' },
  { id: 'moo', g: '☽', name: { vi: 'Mặt Trăng', en: 'Moon', de: 'Mond' }, rules: 'can',
    vi: 'Cảm xúc, thói quen, nhu cầu an toàn, mẹ và tuổi thơ. Mặt Trăng đổi cung mỗi hai ngày rưỡi nên cần giờ sinh gần đúng.',
    en: 'Feelings, habits, the need for safety, mother and childhood. The Moon changes sign every two and a half days, so a rough birth time helps.',
    de: 'Gefühle, Gewohnheiten, Sicherheitsbedürfnis sowie Themen rund um Fürsorge und frühe Prägungen. Der Mond wechselt ungefähr alle zweieinhalb Tage das Zeichen, deshalb hilft eine möglichst genaue Geburtszeit bei der Berechnung.' },
  { id: 'mer', g: '☿', name: { vi: 'Sao Thủy', en: 'Mercury', de: 'Merkur' }, rules: 'gem',
    vi: 'Suy nghĩ, nói, viết, học, đi lại ngắn. Luôn ở gần Mặt Trời: cùng cung hoặc cung kế bên.',
    en: 'Thinking, speaking, writing, learning, short trips. Always near the Sun: same sign or the one next to it.',
    de: 'Denken, Sprechen, Schreiben, Lernen und kurze Wege. Merkur bleibt am Himmel immer relativ nah an der Sonne und steht deshalb im Geburtshoroskop höchstens wenige Zeichen von ihr entfernt.' },
  { id: 'ven', g: '♀', name: { vi: 'Sao Kim', en: 'Venus', de: 'Venus' }, rules: 'tau',
    vi: 'Tình yêu, cái đẹp, tiền, điều bạn thích và cách bạn yêu. Sao Kim cho biết bạn bị hút bởi gì.',
    en: 'Love, beauty, money, what you enjoy and how you love. Venus shows what you are drawn to.',
    de: 'Liebe, Schönheit, Genuss, Werte und die Art, wie du Zuneigung zeigst und empfängst. Venus wird außerdem mit Geld, Geschmack und dem verbunden, wozu du dich hingezogen fühlst.' },
  { id: 'mar', g: '♂', name: { vi: 'Sao Hỏa', en: 'Mars', de: 'Mars' }, rules: 'ari',
    vi: 'Hành động, ham muốn, giận, cách bạn theo đuổi và cách bạn cãi nhau.',
    en: 'Action, desire, anger, how you pursue and how you fight.',
    de: 'Handlung, Antrieb, Begehren, Ärger und die Art, wie du etwas verfolgst oder dich in Konflikten behauptest.' },
  { id: 'jup', g: '♃', name: { vi: 'Sao Mộc', en: 'Jupiter', de: 'Jupiter' }, rules: 'sag',
    vi: 'Mở rộng, may mắn, niềm tin, học cao, đi xa. Ở mỗi cung khoảng một năm.',
    en: 'Expansion, luck, belief, higher learning, long journeys. About a year in each sign.',
    de: 'Expansion, Zuversicht, Glaubenssysteme, höhere Bildung und weite Reisen. Jupiter bleibt ungefähr ein Jahr in einem Tierkreiszeichen und wird in der Astrologie oft mit Wachstum und Möglichkeiten verbunden.' },
  { id: 'sat', g: '♄', name: { vi: 'Sao Thổ', en: 'Saturn', de: 'Saturn' }, rules: 'cap',
    vi: 'Giới hạn, kỷ luật, trách nhiệm, bài học khó, thời gian. Ở mỗi cung khoảng hai năm rưỡi. "Sao Thổ trở về" ở tuổi 29 là mốc trưởng thành nổi tiếng.',
    en: 'Limits, discipline, responsibility, hard lessons, time. About two and a half years per sign. The "Saturn return" near age 29 is a famous coming-of-age.',
    de: 'Grenzen, Disziplin, Verantwortung, Zeit und langfristige Lektionen. Saturn bleibt ungefähr zweieinhalb Jahre pro Zeichen. Die sogenannte Saturn-Rückkehr um das 29. Lebensjahr wird astrologisch häufig als Übergang in eine reifere Lebensphase gedeutet.' },
  { id: 'ura', g: '♅', name: { vi: 'Sao Thiên Vương', en: 'Uranus', de: 'Uranus' }, rules: 'aqu',
    vi: 'Đột phá, khác biệt, tự do, công nghệ, bất ngờ. Ở mỗi cung khoảng bảy năm, nên nói về một thế hệ hơn là một người.',
    en: 'Breakthrough, difference, freedom, technology, surprise. About seven years per sign, so it speaks of a generation more than a person.',
    de: 'Umbruch, Unabhängigkeit, Erfindung, Technik und überraschende Veränderungen. Uranus bleibt ungefähr sieben Jahre in einem Zeichen; seine Zeichenstellung wird deshalb eher als Generationsthema als als rein persönliche Eigenschaft gelesen.' },
  { id: 'nep', g: '♆', name: { vi: 'Sao Hải Vương', en: 'Neptune', de: 'Neptun' }, rules: 'pis',
    vi: 'Mơ, tâm linh, nghệ thuật, ảo ảnh, tan biến ranh giới. Khoảng mười bốn năm mỗi cung.',
    en: 'Dreams, spirituality, art, illusion, dissolving boundaries. About fourteen years per sign.',
    de: 'Träume, Spiritualität, Kunst, Idealismus, Illusion und das Auflösen von Grenzen. Neptun bleibt ungefähr vierzehn Jahre in einem Zeichen und wird deshalb ebenfalls stark generationenbezogen gelesen.' },
  { id: 'plu', g: '♇', name: { vi: 'Sao Diêm Vương', en: 'Pluto', de: 'Pluto' }, rules: 'sco',
    vi: 'Chuyển hoá, quyền lực, điều bị chôn, tái sinh. Mười hai đến ba mươi năm mỗi cung.',
    en: 'Transformation, power, what is buried, rebirth. Twelve to thirty years per sign.',
    de: 'Transformation, Macht, verborgene Themen, Krise und Erneuerung. Pluto bewegt sich sehr langsam und bleibt je nach Abschnitt seiner Bahn etwa zwölf bis mehr als dreißig Jahre in einem Zeichen.' }
];

const HOUSES = [
  { n: 1, vi: ['Bản thân', 'Vẻ ngoài, ấn tượng đầu, cách bạn bước vào đời. Cung Mọc nằm ở đây.'], en: ['Self', 'Appearance, first impression, how you enter the world. The Rising sign sits here.'], de: ['Selbst', 'Erscheinung, erster Eindruck und die Art, wie du in die Welt trittst. Der Aszendent beginnt hier.'] },
  { n: 2, vi: ['Tiền và giá trị', 'Thu nhập, đồ đạc, điều bạn coi trọng, lòng tự trọng.'], en: ['Money and values', 'Income, possessions, what you value, self-worth.'], de: ['Geld und Werte', 'Einkommen, Besitz, persönliche Werte und Selbstwert.'] },
  { n: 3, vi: ['Giao tiếp', 'Nói, viết, học phổ thông, anh chị em, hàng xóm, đi lại gần.'], en: ['Communication', 'Speaking, writing, school, siblings, neighbours, short trips.'], de: ['Kommunikation', 'Sprechen, Schreiben, Lernen, Geschwister, Nachbarschaft und kurze Wege.'] },
  { n: 4, vi: ['Nhà và gốc rễ', 'Gia đình, nơi ở, cha mẹ, tuổi thơ, đời sống riêng tư.'], en: ['Home and roots', 'Family, home, parents, childhood, private life.'], de: ['Zuhause und Wurzeln', 'Familie, Zuhause, Herkunft, frühe Prägungen und privates Leben.'] },
  { n: 5, vi: ['Niềm vui và sáng tạo', 'Yêu đương, con cái, nghệ thuật, chơi, may rủi.'], en: ['Joy and creativity', 'Romance, children, art, play, chance.'], de: ['Freude und Kreativität', 'Romantik, Kinder, Kunst, Spiel, Selbstausdruck und Vergnügen.'] },
  { n: 6, vi: ['Công việc hằng ngày và sức khỏe', 'Thói quen, việc hàng ngày, đồng nghiệp, thể chất.'], en: ['Daily work and health', 'Routines, everyday work, colleagues, the body.'], de: ['Alltag, Arbeit und Gesundheit', 'Routinen, tägliche Arbeit, Kolleginnen und Kollegen, Gewohnheiten und der Umgang mit dem Körper.'] },
  { n: 7, vi: ['Đối tác', 'Hôn nhân, hợp tác, đối thủ công khai, cách bạn ở trong mối quan hệ một-một.'], en: ['Partnership', 'Marriage, business partners, open rivals, how you are in one-to-one bonds.'], de: ['Partnerschaft', 'Ehe, enge Partnerschaften, geschäftliche Verbindungen und offene Gegenspieler; wie du dich in Beziehungen auf Augenhöhe verhältst.'] },
  { n: 8, vi: ['Chia sẻ và chuyển hoá', 'Tiền chung, thừa kế, nợ, tình dục, khủng hoảng, tái sinh.'], en: ['Sharing and transformation', 'Shared money, inheritance, debt, sex, crisis, rebirth.'], de: ['Teilen und Transformation', 'Gemeinsame Finanzen, Erbschaften, Schulden, Intimität, Krisen und tiefgreifende Veränderung.'] },
  { n: 9, vi: ['Chân trời xa', 'Đại học, triết lý, tôn giáo, nước ngoài, xuất bản.'], en: ['Far horizons', 'University, philosophy, religion, foreign places, publishing.'], de: ['Weite Horizonte', 'Hochschulbildung, Philosophie, Religion, Ausland, lange Reisen und Publizieren.'] },
  { n: 10, vi: ['Sự nghiệp', 'Danh tiếng, chức vị, mục tiêu công khai, cha hoặc người dẫn dắt.'], en: ['Career', 'Reputation, status, public goals, father or mentor figure.'], de: ['Beruf und Öffentlichkeit', 'Karriere, Ruf, Status, öffentliche Ziele sowie Autoritäts- oder Mentorfiguren.'] },
  { n: 11, vi: ['Bạn bè và cộng đồng', 'Nhóm, mạng lưới, ước mơ dài hạn, hoạt động xã hội.'], en: ['Friends and community', 'Groups, networks, long-term hopes, social causes.'], de: ['Freunde und Gemeinschaft', 'Gruppen, Netzwerke, langfristige Hoffnungen und gesellschaftliche Anliegen.'] },
  { n: 12, vi: ['Bên trong', 'Tiềm thức, cô đơn, bí mật, tâm linh, điều bạn tự giấu mình.'], en: ['The inner world', 'Unconscious, solitude, secrets, spirituality, what you hide from yourself.'], de: ['Innere Welt', 'Unbewusstes, Rückzug, Geheimnisse, Spiritualität und Themen, die du vor dir selbst schwer erkennst.'] }
];

const ASPECTS = [
  { g: '☌', deg: '0°', name: { vi: 'Hợp', en: 'Conjunction', de: 'Konjunktion' }, vi: 'Hai hành tinh đứng cùng chỗ. Năng lượng trộn vào nhau, mạnh lên, không tốt không xấu.', en: 'Two planets in the same place. Energies blend and intensify; neither good nor bad.', de: 'Zwei Planeten stehen sehr nah beieinander. Ihre Energien verbinden und verstärken sich; das ist nicht automatisch gut oder schlecht.' },
  { g: '☍', deg: '180°', name: { vi: 'Đối', en: 'Opposition', de: 'Opposition' }, vi: 'Đối diện nhau. Kéo về hai phía; bài học là cân bằng, thường qua người khác.', en: 'Facing each other. A pull in two directions; the lesson is balance, often through other people.', de: 'Zwei Planeten stehen sich gegenüber. Das kann sich wie ein Zug in zwei Richtungen anfühlen; astrologisch liegt die Aufgabe häufig im Ausgleich, oft über Beziehungen oder Gegenüber.' },
  { g: '△', deg: '120°', name: { vi: 'Tam hợp', en: 'Trine', de: 'Trigon' }, vi: 'Cùng nguyên tố. Dễ dàng, tự nhiên, tài năng sẵn có. Dễ đến mức hay bị coi thường.', en: 'Same element. Easy, natural, a built-in talent. So easy it is often taken for granted.', de: 'Ein harmonischer Winkel, häufig zwischen Zeichen desselben Elements. Er wird mit natürlichem Fluss und vorhandenen Talenten verbunden — manchmal so selbstverständlich, dass man sie übersieht.' },
  { g: '□', deg: '90°', name: { vi: 'Vuông', en: 'Square', de: 'Quadrat' }, vi: 'Căng thẳng, ma sát. Khó chịu nhưng tạo động lực; nhiều thành tựu lớn đến từ góc vuông.', en: 'Tension, friction. Uncomfortable but motivating; many big achievements come from squares.', de: 'Spannung und Reibung. Der Winkel kann unbequem wirken, wird astrologisch aber auch mit starkem Entwicklungsdruck und Motivation verbunden.' },
  { g: '⚹', deg: '60°', name: { vi: 'Lục hợp', en: 'Sextile', de: 'Sextil' }, vi: 'Cơ hội. Dễ nhưng cần bạn chủ động mới thành.', en: 'Opportunity. Easy, but you have to act for it to come true.', de: 'Eine unterstützende Gelegenheit. Die Verbindung gilt als relativ leicht, entfaltet sich aber meist stärker, wenn du selbst aktiv damit arbeitest.' }
];

/* Moon phase from a reference new moon (2000-01-06 18:14 UTC), mean synodic
   month 29.530588 days. Accurate to within a day, enough for a daily note. */
function moonPhase(date) {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - ref) / 86400000;
  const age = ((days % 29.530588) + 29.530588) % 29.530588;
  const idx = Math.floor((age / 29.530588) * 8 + 0.5) % 8;
  return { age: age, idx: idx };
}
const MOON_NAMES = {
  vi: ['Trăng non', 'Trăng lưỡi liềm đầu tháng', 'Bán nguyệt đầu tháng', 'Trăng khuyết đầu tháng', 'Trăng tròn', 'Trăng khuyết cuối tháng', 'Bán nguyệt cuối tháng', 'Trăng lưỡi liềm cuối tháng'],
  en: ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'],
  de: ['Neumond', 'Zunehmende Sichel', 'Erstes Viertel', 'Zunehmender Mond', 'Vollmond', 'Abnehmender Mond', 'Letztes Viertel', 'Abnehmende Sichel']
};
const MOON_ICONS = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
/* One short reading per phase: what the sky is doing, and what the phase is
   usually used for. */
const MOON_TEXT = {
  vi: [
    'Mặt Trăng đi qua giữa Trái Đất và Mặt Trời, nên bầu trời gần như không có trăng. Đây là lúc mọi thứ bắt đầu từ con số không, hợp để bạn đặt một ý định mới và viết ra điều mình muốn.',
    'Một vành sáng mảnh vừa hiện ra sau khi trời tối. Ý định của bạn đã nhú lên thành việc cụ thể, và đây là lúc làm bước đầu tiên dù nó còn nhỏ.',
    'Một nửa mặt trăng sáng, một nửa còn tối. Đây thường là lúc gặp trở ngại đầu tiên, và bạn cần quyết định giữ hay đổi cách làm.',
    'Trăng đã sáng hơn nửa và đang lớn dần về phía tròn. Đây là lúc bạn chỉnh sửa, làm cho tốt hơn và kiên nhẫn với phần việc còn dở.',
    'Trăng sáng trọn vẹn và nằm đối diện Mặt Trời. Mọi chuyện hiện rõ nhất lúc này, cả điều bạn vui lẫn điều bạn đã né tránh. Đây là lúc để nhìn thẳng và để biết ơn.',
    'Trăng bắt đầu khuyết dần sau đêm tròn. Đây là lúc chia sẻ điều bạn học được và trả lại những gì không còn thuộc về mình.',
    'Lại một nửa sáng một nửa tối, nhưng lần này trăng đang nhỏ lại. Đây là lúc buông một thói quen, một mối quan hệ hay một kỳ vọng đã hết hạn.',
    'Vành trăng cuối cùng trước khi trời tối hẳn. Đây là lúc nghỉ ngơi, ngủ nhiều hơn và để lòng mình trống ra trước một vòng mới.'
  ],
  en: [
    'The Moon passes between the Earth and the Sun, so the sky holds almost no moon at all. Everything starts from nothing here, which makes it the moment to set an intention and write down what you want.',
    'A thin rim of light appears again after dark. Your intention has surfaced as something concrete, and this is when you take the first step, however small.',
    'Half the face is lit and half is still dark. This is usually where the first obstacle arrives, and where you decide whether to hold your course or change it.',
    'More than half is lit and the Moon is filling towards full. This is the time to refine, to improve what you have and to stay patient with what is unfinished.',
    'The Moon is fully lit, opposite the Sun. Everything shows most clearly now, what delights you and what you have been avoiding alike. A time to look straight at things, and to be grateful.',
    'The Moon begins to thin after the full night. This is the time to pass on what you learned and to give back what is no longer yours to carry.',
    'Half lit and half dark again, but shrinking this time. This is the moment to let go of a habit, a tie or an expectation that has run out.',
    'The last rim of light before the dark. This is the time to rest, to sleep more, and to empty yourself before the next round begins.'
  ],
  de: [
    'Der Mond steht zwischen Erde und Sonne, sodass von seiner beleuchteten Seite fast nichts zu sehen ist. Symbolisch beginnt hier ein neuer Zyklus — ein guter Moment, um eine neue Absicht zu setzen und aufzuschreiben, was du beginnen möchtest.',
    'Nach der Dunkelheit erscheint wieder eine schmale Lichtkante. Deine Absicht bekommt erste konkrete Form; jetzt passt ein kleiner erster Schritt besser als ein perfekter Plan.',
    'Eine Hälfte ist beleuchtet, die andere dunkel. Diese Phase wird oft mit dem ersten Widerstand verbunden: Du prüfst, ob du deinen Kurs hältst oder etwas an deiner Vorgehensweise änderst.',
    'Mehr als die Hälfte ist beleuchtet und der Mond wächst weiter zum Vollmond. Jetzt geht es um Verfeinern, Verbessern und darum, mit Unfertigem geduldig weiterzuarbeiten.',
    'Der Mond ist vollständig beleuchtet und steht der Sonne gegenüber. Symbolisch wird diese Phase mit Sichtbarkeit und Erkenntnis verbunden: mit dem, was Freude macht, ebenso wie mit dem, was du bisher lieber übersehen hast. Ein guter Moment zum ehrlichen Zurückblicken und für Dankbarkeit.',
    'Nach dem Vollmond nimmt das sichtbare Licht wieder ab. Diese Phase wird gern genutzt, um Gelerntes weiterzugeben und Dinge abzugeben, die du nicht länger tragen möchtest.',
    'Wieder ist nur eine Hälfte beleuchtet, diesmal auf dem Weg zur Dunkelheit. Symbolisch passt diese Phase zum Loslassen einer Gewohnheit, Bindung oder Erwartung, die nicht mehr zu dir passt.',
    'Die letzte schmale Sichel vor dem nächsten Neumond. Jetzt darf es ruhiger werden: ausruhen, mehr schlafen, abschließen und innerlich Platz für den nächsten Zyklus schaffen.'
  ]
};

/* Heavenly stems and earthly branches for the lunar year. */
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const canChi = (year) => CAN[((year - 4) % 10 + 10) % 10] + ' ' + CHI[((year - 4) % 12 + 12) % 12];
