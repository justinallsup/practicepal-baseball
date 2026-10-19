import React, { useEffect, useRef, useState } from "react";
import { Image, View, Text } from "react-native";
import { Button, Chip, S } from "./ui";

export default function DrillVideoPlayer({
  source,
  title,
}: {
  source: string;
  title: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState(1);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const player = video.current;
    // A closed guide must stop immediately, including native full-screen playback.
    return () => {
      player?.pause();
    };
  }, []);

  async function play() {
    const player = video.current;
    if (!player) return;
    if (ended) player.currentTime = 0;
    try {
      await player.play();
      setMessage("");
    } catch {
      setMessage(
        "Use the video’s play control to start, or follow the steps below.",
      );
    }
  }

  return (
    <View style={{ gap: 12 }}>
      {failed ? (
        <>
          <Image
            source={{ uri: `${source}.jpg` }}
            accessibilityLabel={`${title} illustrated preview`}
            style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 16 }}
          />
          <Text role="alert" style={S.body}>
            This guide couldn’t load. You can still use the illustrated preview
            and the step-by-step instructions below.
          </Text>
        </>
      ) : (
        <>
          <video
            ref={video}
            aria-label={`${title} animated guide`}
            src={`${source}.mp4`}
            poster={`${source}.jpg`}
            controls
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            onPlay={() => {
              setPlaying(true);
              setEnded(false);
            }}
            onPause={() => setPlaying(false)}
            onRateChange={(event) => setSpeed(event.currentTarget.playbackRate)}
            onEnded={() => {
              setPlaying(false);
              setEnded(true);
            }}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#102F29",
              borderRadius: 16,
              display: "block",
            }}
          >
            <track
              kind="captions"
              src={`${source}.vtt`}
              srcLang="en"
              label="English"
            />
          </video>
          <View style={[S.row, { gap: 10 }]}>
            <Button
              secondary
              title={
                playing ? "Pause guide" : ended ? "Replay guide" : "Play guide"
              }
              onPress={() => (playing ? video.current?.pause() : void play())}
            />
            {[1, 0.5].map((rate) => (
              <Chip
                key={rate}
                title={rate === 1 ? "Normal speed" : "Slow motion"}
                selected={speed === rate}
                onPress={() => {
                  if (video.current) video.current.playbackRate = rate;
                  setSpeed(rate);
                }}
              />
            ))}
          </View>
        </>
      )}
      {message ? (
        <Text role="status" style={S.small}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}
