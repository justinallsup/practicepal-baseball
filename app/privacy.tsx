import React from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Heading, Card, Button, S } from "../components/ui";
export default function Privacy() {
  return (
    <Screen>
      <Heading
        eyebrow="PRIVACY & DATA"
        title="Your family’s records."
        detail="Web release · Updated October 20, 2026"
      />
      <Card>
        <Text style={S.h2}>A parent-led practice journal</Text>
        <Text style={S.body}>
          PracticePal is designed for parents and guardians to set up and manage
          a player’s practice routine. Use a nickname. We don’t ask for a
          child’s full name, birth date, school, address, email, photos, or
          location.
        </Text>
      </Card>
      <Card>
        <Text style={S.h2}>What stays on your device</Text>
        <Text style={S.body}>
          The player nickname, practice goals, logs, timer sessions, feelings,
          benchmarks, points, chosen reward goals, reward requests, and app preferences are stored in
          this browser’s local storage or the native app’s device storage. This
          release has no cloud accounts, public profiles, chat, advertising
          trackers, or cross-device sync. Other people with access to this
          browser can access these records.
        </Text>
      </Card>
      <Card>
        <Text style={S.h2}>Website hosting</Text>
        <Text style={S.body}>
          Vercel hosts this website and processes network information needed to
          deliver and protect it, such as IP address, browser information,
          request paths, and timestamps. Practice records are not intentionally
          sent to a PracticePal backend. No optional analytics or advertising
          SDK is enabled in this release.
        </Text>
      </Card>
      <Card>
        <Text style={S.h2}>External coaching videos</Text>
        <Text style={S.body}>
          Drill guides include links to videos on independent providers’ websites.
          No external video player or thumbnail loads while you browse PracticePal.
          Opening a video leaves PracticePal; the provider may use cookies,
          advertising, or analytics under its own policies. We do not include your
          player nickname or practice records in these links. Watch with an adult.
        </Text>
      </Card>
      <Card>
        <Text style={S.h2}>Export and deletion</Text>
        <Text style={S.body}>
          In Parent, choose Export practice records for a copy, or Delete local
          data to erase this app’s player and records on this device. Clearing
          your browser’s site data also erases them. We cannot recover erased
          local data. Exports remain wherever you save or share them; delete
          those copies separately. Importing an export is not currently
          supported.
        </Text>
      </Card>
      <Card>
        <Text style={S.h2}>Notifications and payments</Text>
        <Text style={S.body}>
          The web version does not send push notifications. Native reminders
          require device permission and can be disabled in Parent or device
          settings. No real-money payments or paid subscriptions are enabled.
          Reward points have no cash value and rewards are arranged by families.
        </Text>
      </Card>
      <Button title="Back to PracticePal" onPress={() => router.replace("/")} />
    </Screen>
  );
}
