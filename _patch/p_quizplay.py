# -*- coding: utf-8 -*-
"""quiz-play.js, section 29.5: three appearance-based questions replaced in
VI/EN, then the German column for all nine lessons."""
import io, sys

p = 'src/quiz-play.js'
s = io.open(p, encoding='utf-8').read()
errors = []


def sub1(old, new):
    global s
    if s.count(old) != 1:
        errors.append('COUNT %d :: %s' % (s.count(old), old[:110])); return
    s = s.replace(old, new)


# ---------- lesson 3, question 1 ----------
sub1("q: { vi: 'Người mang tính chất của Cơ thường được mô tả thế nào?', en: 'How are people of the Hearts suit usually described?' },\n"
     "      a: [{ vi: 'Da sáng, tóc sáng, tính ấm áp', en: 'Fair, light-haired, warm-natured' }, { vi: 'Tóc sẫm, kín đáo, nghiêm', en: 'Dark-haired, reserved, serious' }, { vi: 'Tóc nâu, cởi mở, năng động', en: 'Brown-haired, open, energetic' }, { vi: 'Tóc hung, nhanh nhẹn', en: 'Red-haired and quick' }],\n"
     "      why: { vi: 'Cơ là chất ấm: người của Cơ được tả là sáng và dễ gần.', en: 'Hearts is the warm suit: its people are described as fair and easy to be near.' } }",
     "q: { vi: 'Át Cơ thường gợi tới điều gì?', en: 'What does the Ace of Hearts traditionally suggest?' },\n"
     "      a: [{ vi: 'Một khởi đầu về tình cảm, mái ấm hoặc chuyện của trái tim', en: 'An emotional beginning, home or a new matter of the heart' }, { vi: 'Một kết thúc dứt khoát', en: 'A final ending' }, { vi: 'Một chuyện pháp lý', en: 'A legal dispute' }, { vi: 'Một chuyến đi vì công việc', en: 'A journey for work' }],\n"
     "      why: { vi: 'Át mở đầu chất Cơ: cảm xúc, mái ấm và những điều thuộc về tình cảm bắt đầu hoặc được chú ý trở lại.', en: 'The Ace opens the Hearts suit: feelings, home and relationship matters begin or receive fresh attention.' } }")

# ---------- lesson 5, question 3 ----------
sub1("q: { vi: 'Người mang tính chất của Chuồn thường được mô tả thế nào?', en: 'How are people of the Clubs suit usually described?' },\n"
     "      a: [{ vi: 'Tóc nâu, cởi mở, năng động', en: 'Brown-haired, open, energetic' }, { vi: 'Tóc sẫm, kín đáo', en: 'Dark-haired and reserved' }, { vi: 'Da rất sáng, nhanh nhẹn', en: 'Very fair and quick' }, { vi: 'Tóc sáng, ấm áp', en: 'Light-haired and warm' }],\n"
     "      why: { vi: 'Chuồn là chất của lửa, nên người của Chuồn được tả là sôi nổi và dễ bắt chuyện.', en: 'Clubs is the fire suit, so its people are described as lively and easy to talk to.' } }",
     "q: { vi: 'Khi một trải bài có nhiều lá Chuồn, điều đó thường gợi tới điều gì?', en: 'What can a spread with many Clubs suggest?' },\n"
     "      a: [{ vi: 'Hành động, công việc hoặc sự việc đang chuyển động', en: 'That action, work or movement is a major theme' }, { vi: 'Người hỏi chắc chắn sắp giàu', en: 'That the querent is certain to become rich' }, { vi: 'Phải xào lại bộ bài', en: 'That the deck must be reshuffled' }, { vi: 'Câu hỏi đã đặt sai', en: 'That the question was asked incorrectly' }],\n"
     "      why: { vi: 'Nhiều lá Chuồn hướng câu chuyện về hành động, công việc, các mối liên hệ và những điều đang bắt đầu chuyển động.', en: 'Many Clubs point the reading towards action, work, contacts and things beginning to move.' } }")

# ---------- lesson 7, question 5 ----------
sub1("q: { vi: 'Người mang tính chất của Bích thường được mô tả thế nào?', en: 'How are people of the Spades suit usually described?' },\n"
     "      a: [{ vi: 'Tóc sẫm, kín đáo, nghiêm', en: 'Dark-haired, reserved, serious' }, { vi: 'Tóc sáng, ấm áp', en: 'Light-haired and warm' }, { vi: 'Tóc nâu, cởi mở', en: 'Brown-haired and open' }, { vi: 'Tóc hung, nhanh nhẹn', en: 'Red-haired and quick' }],\n"
     "      why: { vi: 'Bích là chất khí và là chất nghiêm nhất, nên người của Bích được tả là sẫm màu và kín tiếng. Đây là cách mô tả cổ, dùng để nhận ra người, không phải để phán xét.', en: 'Spades is the air suit and the most serious, so its people are described as dark and reserved. This is an old way of identifying a person, not of judging one.' } }",
     "q: { vi: 'Vì sao nên đọc lá hình theo vai trò và bối cảnh thay vì màu tóc hay màu da?', en: 'Why is it better to read court cards through role and context rather than hair or skin colour?' },\n"
     "      a: [{ vi: 'Vì những quy ước ngoại hình cũ không đáng tin và cũng không cần thiết; vai trò, hành vi và bối cảnh hữu ích hơn', en: 'Because old appearance correspondences are neither reliable nor necessary; role, behaviour and context are more useful' }, { vi: 'Vì lá hình không bao giờ chỉ người thật', en: 'Because court cards can never represent real people' }, { vi: 'Vì chỉ con số trên lá mới có ý nghĩa', en: 'Because only the number matters' }, { vi: 'Vì mọi lá hình đều có cùng một nghĩa', en: 'Because every court card means the same thing' }],\n"
     "      why: { vi: 'Một số hệ thống bói bài cũ từng gắn lá hình với ngoại hình, nhưng cách này không đáng tin và dễ lỗi thời. Vai trò, cách hành xử và các lá xung quanh cho bạn nhiều thông tin hơn.', en: 'Some older cartomancy systems used appearance correspondences, but they are not reliable and age badly. Role, behaviour and surrounding cards give you more useful information.' } }")

if errors:
    sys.stderr.write('\n'.join(errors) + '\n'); sys.exit(1)

if 'QUIZ_PLAY_DE' in s:
    sys.stderr.write('German block already present\n'); sys.exit(1)
s = s.rstrip('\n') + '\n' + io.open('_patch/quiz_play_de.js', encoding='utf-8').read()

io.open(p, 'w', encoding='utf-8', newline='').write(s)
print('quiz-play.js: 3 VI/EN questions replaced, German appended')
