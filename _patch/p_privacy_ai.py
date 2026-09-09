# -*- coding: utf-8 -*-
"""privacy.json: say what the app actually does with an AI question.

The policy named Google Gemini. The shipped configuration does not use it:
CONFIG.geminiKey is empty, so questions go to CONFIG.aiEndpoint — Nabu's own
Cloudflare Worker — and worker/src/index.ts answers them with Anthropic's
Claude. That makes three statements wrong: the provider, the list of third
parties, and what leaves the phone with the question. All three are corrected
here in Vietnamese, English and German.

Checked against the source, not assumed:
  src/config.js        aiEndpoint set, geminiKey empty
  src/ai.js:348        the request body: lang, question, context, kind,
                       last six turns, profile { name, sign }; plus the
                       Firebase token in the Authorization header
  worker/src/index.ts  Anthropic claude-opus-5 (Cloudflare Llama with no key)
  worker/src/limit.ts  counts per person in KV; the answer cached 24h under a
                       SHA-256 of the request, so the question text is not kept
"""
import io, json, sys

P = 'privacy.json'
p = json.load(io.open(P, encoding='utf-8'))
errors = []

NEW = {
    4: {  # Nabu AI
        'vi': 'Khi bạn hỏi Nabu AI, câu hỏi của bạn được gửi tới máy chủ riêng của Nabu, đặt tại Cloudflare. Cùng câu hỏi có nội dung bạn đang xem, ví dụ một lá bài hay một bài học, tên hiển thị của bạn, cung hoàng đạo của bạn, và tối đa sáu tin nhắn gần nhất trong cuộc trò chuyện đó. Nếu bạn đã đăng nhập, một mã đăng nhập cũng được gửi kèm để máy chủ đếm số câu hỏi của từng người. Máy chủ chuyển những thông tin này cho Anthropic, công ty làm ra Claude, và Claude viết câu trả lời. App không gửi địa chỉ email, tin nhắn của bạn với Nabu, hay lịch hẹn của bạn. Câu trả lời của AI có thể sai; với chuyện quan trọng, bạn hãy đặt lịch với Nabu. Bạn có thể báo cáo một câu trả lời không phù hợp bằng nút ⚑ cạnh câu trả lời đó.',
        'en': 'When you ask Nabu AI, your question is sent to Nabu’s own server, hosted at Cloudflare. It goes with the content you are looking at, for example a card or a lesson, your display name, your star sign, and up to the last six messages in that conversation. If you are signed in, a login token goes with it so the server can count each person’s questions. The server passes this to Anthropic, the company behind Claude, and Claude writes the answer. The app does not send your email address, your messages with Nabu, or your bookings. AI answers can be wrong; for anything important, book a reading with Nabu. You can report an inappropriate answer with the ⚑ button next to it.',
        'de': 'Wenn du Nabu AI etwas fragst, geht deine Frage an Nabus eigenen Server bei Cloudflare. Mitgesendet werden der Inhalt, den du gerade ansiehst – zum Beispiel eine Karte oder eine Lektion –, dein Anzeigename, dein Sternzeichen und bis zu sechs der letzten Nachrichten aus diesem Gespräch. Wenn du angemeldet bist, geht ein Anmelde-Token mit, damit der Server die Fragen pro Person zählen kann. Der Server gibt das an Anthropic weiter, die Firma hinter Claude, und Claude schreibt die Antwort. Die App sendet dabei weder deine E-Mail-Adresse noch deine Nachrichten an Nabu oder deine Buchungen. KI-Antworten können falsch sein; bei wichtigen persönlichen Themen kannst du eine Legung bei Nabu buchen. Unpassende Antworten kannst du über die Taste ⚑ neben der Antwort melden.',
    },
    7: {  # What the app does not do
        'vi': 'Không quảng cáo. Không bán hay cho thuê dữ liệu của bạn. Không theo dõi bạn trên trang khác. Không lưu số thẻ hay thông tin thanh toán: việc chuyển khoản diễn ra ngoài app. Ba công ty tham gia với vai trò hạ tầng kỹ thuật: Google (Firebase) giữ tài khoản, tin nhắn và lịch hẹn; Cloudflare chạy máy chủ nhận câu hỏi cho Nabu AI; Anthropic viết câu trả lời của Nabu AI. Ngoài ba công ty này, không bên thứ ba nào nhận dữ liệu của bạn.',
        'en': 'No ads. Your data is never sold or rented. No tracking across other sites. No card numbers or payment details are stored: bank transfers happen outside the app. Three companies are involved as technical infrastructure: Google (Firebase) holds accounts, messages and bookings; Cloudflare runs the server that receives Nabu AI questions; Anthropic writes the Nabu AI answers. Beyond these three, no third party receives your data.',
        'de': 'Keine Werbung. Deine Daten werden weder verkauft noch vermietet. Kein Tracking über andere Websites hinweg. Karten- oder Zahlungsdaten werden nicht gespeichert; Überweisungen finden außerhalb der App statt. Drei Unternehmen sind als technische Infrastruktur beteiligt: Google (Firebase) speichert Konten, Nachrichten und Buchungen; Cloudflare betreibt den Server, der die Fragen an Nabu AI entgegennimmt; Anthropic schreibt die Antworten von Nabu AI. Darüber hinaus erhalten keine weiteren Drittanbieter deine Daten.',
    },
    8: {  # Where and how long
        'vi': 'Dữ liệu tài khoản, tin nhắn và lịch hẹn nằm trên máy chủ Google Cloud (Firebase) và được giữ cho tới khi bạn xóa tài khoản. Máy chủ của Nabu tại Cloudflare giữ số lượt hỏi của từng người, để giới hạn số câu hỏi mỗi ngày, và giữ lại bản sao câu trả lời trong 24 giờ để trả lời nhanh hơn cho cùng một câu hỏi. Nội dung câu hỏi của bạn không được lưu ở đó. Bản nháp và cài đặt trên máy nằm ở điện thoại của bạn.',
        'en': 'Account data, messages and bookings live on Google Cloud servers (Firebase) and are kept until you delete your account. Nabu’s server at Cloudflare keeps a count of how many questions each person has asked, to hold the daily limit, and keeps a copy of an answer for 24 hours so the same question can be answered faster. The text of your question is not stored there. Drafts and settings stay on your phone.',
        'de': 'Kontodaten, Nachrichten und Buchungen liegen auf Google-Cloud-Servern über Firebase und werden bis zur Löschung deines Kontos gespeichert. Nabus Server bei Cloudflare zählt, wie viele Fragen jede Person gestellt hat, um das Tageslimit einzuhalten, und behält eine Antwort 24 Stunden lang, damit dieselbe Frage schneller beantwortet werden kann. Der Text deiner Frage wird dort nicht gespeichert. Entwürfe und lokale Einstellungen bleiben auf deinem Gerät.',
    },
}

for i, texts in NEW.items():
    sec = p['sections'][i]
    if 'Gemini' not in sec['p']['en'] and i == 4:
        errors.append('section 4 no longer mentions Gemini; check before rerunning')
    for lg, text in texts.items():
        sec['p'][lg] = text

io.open(P, 'w', encoding='utf-8', newline='\n').write(
    json.dumps(p, ensure_ascii=False, indent=1) + '\n')

if errors:
    sys.stderr.write('\n'.join(errors) + '\n')
    sys.exit(1)
print('privacy.json: Nabu AI, third parties and retention corrected in VI/EN/DE')
