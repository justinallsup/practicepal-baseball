import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Polygon,
} from "react-native-svg";
import {
  Award,
  Star,
  Flame,
  Trophy,
  ShieldCheck,
  Gamepad2,
  Utensils,
  Trees,
  Target,
} from "lucide-react-native";
import { C, D, F, S } from "./ui";
export const battingPhoto = require("../assets/editorial/batting-golden-hour.jpg");
export const glovePhoto = require("../assets/editorial/glove-detail.jpg");
export function PhotoPanel({
  children,
  style,
  glove = false,
  strong = false,
}: React.PropsWithChildren<{
  style?: ViewStyle;
  glove?: boolean;
  strong?: boolean;
}>) {
  return (
    <View
      style={[
        { backgroundColor: C.dark, borderRadius: 24, overflow: "hidden" },
        style,
      ]}
    >
      <ImageBackground
        source={glove ? glovePhoto : battingPhoto}
        testID={glove ? "glove-photo" : "batting-photo"}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        imageStyle={{ width: "100%", height: "100%" }}
        accessible={false}
      />
      <LinearGradient
        colors={
          strong
            ? ["rgba(8,29,23,.62)", "rgba(8,29,23,.12)", "rgba(8,29,23,.94)"]
            : ["rgba(8,29,23,.93)", "rgba(8,29,23,.58)", "rgba(8,29,23,.10)"]
        }
        start={{ x: 0, y: strong ? 0 : 0.5 }}
        end={{ x: strong ? 0 : 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
export function Ring({
  value,
  total,
  size = 136,
  dark = false,
}: {
  value: number;
  total: number;
  size?: number;
  dark?: boolean;
}) {
  const radius = 52,
    circ = 2 * Math.PI * radius;
  return (
    <View
      accessibilityLabel={`${value} of ${total} practice days completed`}
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={StyleSheet.absoluteFill}
      >
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke={dark ? "#2C4B3D" : "#E9EDE4"}
          strokeWidth="8"
          fill="none"
        />
        <Circle
          cx="60"
          cy="60"
          r={radius}
          stroke={dark ? C.lime : C.green}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={
            circ * (1 - Math.min(value / Math.max(total, 1), 1))
          }
          strokeLinecap="round"
          rotation="-90"
          origin="60,60"
        />
      </Svg>
      <Text
        style={{
          fontFamily: D,
          fontSize: size * 0.33,
          lineHeight: size * 0.38,
          color: dark ? C.white : C.navy,
          fontWeight: "700",
        }}
      >
        {value}
        <Text
          style={{ fontSize: size * 0.18, color: dark ? "#B6CDBD" : C.muted }}
        >
          {" "}
          / {total}
        </Text>
      </Text>
      <Text
        style={[
          S.eyebrow,
          { fontSize: 8, letterSpacing: 1.5, color: dark ? C.lime : C.muted },
        ]}
      >
        DAYS THIS WEEK
      </Text>
    </View>
  );
}
export function Medal({
  index = 0,
  earned = true,
  size = 84,
}: {
  index?: number;
  earned?: boolean;
  size?: number;
}) {
  const Icon = [Star, Trophy, Flame, Target, Award, ShieldCheck][index % 6];
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient
            id={`medal-${index}-${earned}`}
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <Stop offset="0" stopColor={earned ? "#F6DEA1" : "#F1F2EC"} />
            <Stop offset="1" stopColor={earned ? "#BF8A35" : "#CDD6C9"} />
          </SvgGradient>
        </Defs>
        <Path
          d="M28 62 L21 96 40 86 51 98 56 68 M48 70 L62 98 69 84 87 88 71 58"
          fill={earned ? "#28533C" : "#B6C4B2"}
        />
        <Polygon
          points="50,3 63,11 78,13 85,28 96,40 93,56 96,70 81,80 71,94 55,91 40,96 28,84 13,80 10,64 3,50 12,36 14,20 31,15"
          fill={`url(#medal-${index}-${earned})`}
        />
        <Circle
          cx="50"
          cy="48"
          r="30"
          stroke={earned ? "#FFF0CA" : "#FFF"}
          strokeWidth="1"
          fill="none"
        />
        <Circle cx="50" cy="48" r="25" fill={earned ? "#DBB965" : "#DCE3D6"} />
      </Svg>
      <View style={{ zIndex: 1 }}>
        <Icon
          size={size * 0.34}
          color={earned ? "#694819" : "#708269"}
          strokeWidth={1.6}
        />
      </View>
    </View>
  );
}
export function RewardArt({ index }: { index: number }) {
  const Icon = [Gamepad2, Utensils, Target, Trees][index % 4];
  const colors = [
    ["#E6EDDB", "#C5D6B4"],
    ["#F5EAD2", "#DEC595"],
    ["#D8E8E1", "#A2C2B0"],
    ["#E7E8D6", "#C1C7A0"],
  ];
  return (
    <LinearGradient
      colors={colors[index % 4] as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        height: 150,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: 85,
          borderWidth: 1,
          borderColor: "#FFFFFF66",
          right: -30,
          top: -45,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: "#FFFFFF66",
          left: -65,
          bottom: -130,
        }}
      />
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 28,
          backgroundColor: "#FFFFFF77",
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: "-8deg" }],
        }}
      >
        <Icon size={47} color={C.navy} strokeWidth={1.4} />
      </View>
      <Star
        size={15}
        color={C.gold}
        style={{ position: "absolute", right: 50, top: 26 }}
      />
    </LinearGradient>
  );
}
export function SectionTitle({
  label,
  title,
}: {
  label: string;
  title: string;
}) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={S.eyebrow}>{label}</Text>
      <Text style={S.h2}>{title}</Text>
    </View>
  );
}
