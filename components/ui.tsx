import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
  useWindowDimensions,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowUpRight, Check, Star } from "lucide-react-native";
import Svg, { Path, Circle } from "react-native-svg";

export const C = {
  navy: "#102F29",
  red: "#21644C",
  cream: "#F4F3ED",
  white: "#FFFFFF",
  muted: "#63716B",
  line: "#E1E6DE",
  green: "#21644C",
  pale: "#E8EFE5",
  gold: "#956B25",
  lime: "#E8C77A",
  dark: "#0B211D",
  electric: "#D4F66A",
  coral: "#FF8A64",
  violet: "#D8CCFF",
};
export const F = Platform.OS === "web" ? "Manrope" : undefined;
export const D = Platform.OS === "web" ? "BarlowCondensed" : undefined;
export const S = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.cream },
  content: {
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
    padding: 28,
    paddingBottom: 48,
    gap: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 18 },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    padding: 24,
    gap: 14,
    shadowColor: "#143B25",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.025,
    shadowRadius: 14,
  },
  hero: {
    backgroundColor: C.navy,
    borderRadius: 24,
    padding: 28,
    gap: 18,
    overflow: "hidden",
  },
  eyebrow: {
    fontFamily: F,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: C.red,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: D,
    fontSize: 44,
    lineHeight: 46,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: C.navy,
  },
  display: {
    fontFamily: D,
    fontSize: 68,
    lineHeight: 65,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: -0.5,
    color: C.navy,
  },
  h2: {
    fontFamily: F,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.7,
    color: C.navy,
  },
  h3: {
    fontFamily: F,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
    color: C.navy,
  },
  body: { fontFamily: F, fontSize: 14, lineHeight: 23, color: C.muted },
  small: { fontFamily: F, fontSize: 11, lineHeight: 18, color: C.muted },
  white: { color: C.white },
  light: { color: "#CFDCD1" },
  input: {
    fontFamily: F,
    borderWidth: 1,
    borderColor: "#CDD7CD",
    borderRadius: 12,
    backgroundColor: "#FBFCF8",
    padding: 15,
    fontSize: 15,
    minHeight: 52,
    color: C.navy,
  },
  pill: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    paddingVertical: 12,
    paddingHorizontal: 18,
    minHeight: 44,
    borderRadius: 30,
  },
  chosen: { backgroundColor: C.navy, borderColor: C.navy },
  error: { fontFamily: F, color: "#A42E25", fontSize: 14, lineHeight: 21 },
  rule: { height: 1, backgroundColor: C.line },
});
export function Screen({ children }: React.PropsWithChildren) {
  const small = useWindowDimensions().width < 600;
  return (
    <SafeAreaView style={S.page} edges={["top", "left", "right"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          S.content,
          small && { padding: 18, paddingBottom: 32, gap: 22 },
        ]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <View style={[S.row, { gap: 10 }]}>
      <View
        style={{
          width: 39,
          height: 44,
          backgroundColor: light ? C.lime : C.navy,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: "-5deg" }],
        }}
      >
        <Svg width={27} height={27} viewBox="0 0 32 32">
          <Path
            d="M16 3 L29 10 V23 L16 30 3 23 V10Z"
            stroke={light ? C.navy : C.lime}
            strokeWidth="1.5"
            fill="none"
          />
          <Path
            d="M11 22V10h7a4 4 0 010 8h-7"
            fill="none"
            stroke={light ? C.navy : C.white}
            strokeWidth="3"
          />
        </Svg>
      </View>
      <View>
        <Text
          style={{
            fontFamily: F,
            color: light ? C.white : C.navy,
            fontSize: 20,
            fontWeight: "800",
            letterSpacing: -1,
          }}
        >
          PracticePal
        </Text>
        <Text
          style={[
            S.eyebrow,
            {
              fontSize: 8,
              letterSpacing: 3,
              color: light ? "#C5D6C8" : C.muted,
            },
          ]}
        >
          BASEBALL CLUB
        </Text>
      </View>
    </View>
  );
}
export function Heading({
  eyebrow,
  title,
  detail,
}: {
  eyebrow: string;
  title: string;
  detail?: string;
}) {
  return (
    <View style={{ gap: 8 }}>
      <View style={[S.row, { gap: 8 }]}>
        <View style={{ width: 20, height: 2, backgroundColor: C.gold }} />
        <Text style={S.eyebrow}>{eyebrow}</Text>
      </View>
      <Text role="heading" aria-level={1} style={S.title}>
        {title}
      </Text>
      {detail && <Text style={[S.body, { maxWidth: 660 }]}>{detail}</Text>}
    </View>
  );
}
export function Card({
  children,
  style,
}: React.PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[S.card, style]}>{children}</View>;
}
export function Button({
  title,
  onPress,
  secondary,
  disabled,
  testID,
  gold = false,
  accessibilityLabel,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  testID?: string;
  gold?: boolean;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 50,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: gold ? C.lime : secondary ? C.white : C.green,
        borderWidth: 1,
        borderColor: gold ? C.lime : secondary ? C.line : C.green,
        opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ translateY: pressed ? 1 : 0 }],
      })}
    >
      <Text
        style={{
          fontFamily: F,
          color: gold || secondary ? C.navy : C.white,
          fontSize: 12,
          fontWeight: "800",
          textAlign: "center",
          flexShrink: 1,
        }}
      >
        {title}
      </Text>
      {!disabled && (
        <ArrowUpRight size={16} color={gold || secondary ? C.navy : C.white} />
      )}
    </Pressable>
  );
}
export function Chip({
  title,
  selected,
  onPress,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[S.pill, selected && S.chosen]}
    >
      <Text style={[S.small, { fontWeight: "800" }, selected && S.white]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={S.h3}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#647682"
        {...props}
        style={[S.input, props.style]}
      />
    </View>
  );
}
export function Stat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <View style={{ flex: 1, minWidth: 86, gap: 4 }}>
      <Text
        style={{
          fontFamily: D,
          fontSize: 44,
          lineHeight: 49,
          fontWeight: "700",
          color: C.navy,
        }}
      >
        {value}
      </Text>
      <Text style={S.small}>{label}</Text>
    </View>
  );
}
