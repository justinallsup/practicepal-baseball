import React, { useState } from "react";
import { Linking, Text, View } from "react-native";
import { Button, S } from "./ui";

export default function CoachingVideoLink({ url, provider, kind }: { url: string; provider: string; kind: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <View style={{ gap: 10 }}>
      <Button title={`${kind === "video" ? "Watch" : "Read"} on ${provider}`} onPress={async () => {
        setFailed(false);
        try { await Linking.openURL(url); } catch { setFailed(true); }
      }} />
      {failed ? <Text role="alert" style={S.body}>The video page couldn’t open. You can still follow the practice cues below.</Text> : null}
    </View>
  );
}
