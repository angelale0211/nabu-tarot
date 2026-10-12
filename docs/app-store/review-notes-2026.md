# App Store submission: Nabu Tarot 1.1.0 (Flutter build)

Two parts: the note to paste into App Store Connect, and the owner's checklist.

## 1. Notes for App Review (paste into App Store Connect → the version → App Review Information → Notes)

> Nabu Tarot is the app of one tarot reader, Nabu, and the people she reads for. It is not a template fortune-telling app: its content is her own work, in Vietnamese, English and German.
>
> What it contains:
> - Readings and posts Nabu writes herself, published to the app's home feed.
> - Bookings with Nabu in person: the person picks a time from her real calendar, Nabu confirms or proposes a new time, and the two exchange messages in the app.
> - Courses Nabu wrote (Tarot, Lenormand, playing cards) with lessons, quizzes and practice exercises, sold as in-app purchases.
> - Lifestyle (tab "Lifestyle"): a diary, what to wear each month, a companion to dress, and the Vietnamese lunar calendar with today's lunar date and moon phase.
>
> What this version adds natively on iPhone:
> - Sign in with Apple, beside Google and email.
> - In-app purchases through StoreKit 2 for the courses and plans.
> - Push notifications: when Nabu answers a message, when she confirms or moves a booking, and a morning reminder to draw the day’s card. Permission is asked only after the person has signed in, and all of them stop when notifications are turned off in Settings.
> - A home-screen widget showing today's date, the Vietnamese lunar date and the moon phase. Tapping it opens Draw.
> - An offline screen when there is no connection.
>
> The sign-in details for review are in the fields above. To see the courses: Learn → Tarot. To see bookings and messages: Profile → Bookings / Messages. To add the widget: long-press the home screen → + → Nabu Tarot.
>
> Readings in the app are for reflection and entertainment and are presented as such in the app's terms.

## 2. Owner checklist

1. **Build.** Wait for the green Codemagic build of `feature/ios-flutter`; it appears in App Store Connect → TestFlight within ~15 minutes after processing.
2. **Test on your iPhone** (TestFlight app): sign in with Apple, buy a course with a sandbox tester, allow notifications, add the widget, turn on airplane mode once to see the offline screen.
3. **Screenshots** (6.7" iPhone, e.g. 15/16 Pro Max; 6.1" is generated from them if you choose so). Take them on the TestFlight build:
   1. Home with Nabu's posts
   2. Draw a card, a card drawn
   3. A course lesson (Learn → Tarot)
   4. Booking: choosing a time with Nabu
   5. Lifestyle tab
   6. The home-screen widget beside the app icon
4. **The version.** App Store Connect → Nabu Tarot → (+) iOS version **1.1.0** → select the TestFlight build → paste the note above. The demo account entered with the earlier submission is carried over in *Sign-In Information*; check it still signs in.
5. **The appeal already open.** If Apple has answered it, reply in that same Resolution Center thread: "We have submitted version 1.1.0 (build <number>), which adds native features (Sign in with Apple, StoreKit, push notifications, a home-screen widget) to an app whose content is written by one reader." If it is still open, submit 1.1.0 anyway and mention the build number there.
