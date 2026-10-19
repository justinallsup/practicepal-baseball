import React, { useState } from "react";
import { Image, Linking, Text, View } from "react-native";
import { Button, S } from "./ui";

// Native opens the first-party MP4 with the device's supported player.
// The web-specific component provides inline controls without a native dependency.
export default function DrillVideoPlayer({
  source,
  title,
}: {
  source: string;
  title: string;
}) {
  const [error, setError] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      <Image
        source={{ uri: `${source}.jpg` }}
        accessibilityLabel={`${title} illustrated preview`}
        style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 16 }}
      />
      <Button
        title="Open animated guide"
        onPress={async () => {
          try {
            await Linking.openURL(`${source}.mp4`);
          } catch {
            setError(true);
          }
        }}
      />
      <Text style={S.small}>
        Opens in your device’s video player. Internet connection required.
      </Text>
      {error ? (
        <Text role="alert" style={S.body}>
          The video couldn’t open. Follow the steps below instead.
        </Text>
      ) : null}
    </View>
  );
}
