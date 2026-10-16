import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CircleDot, ArrowUpRight } from "lucide-react-native";

export const C = {
  navy: "#122B39",
  red: "#B84332",
  cream: "#F6F4EF",
  white: "#FFFFFF",
  muted: "#536775",
  line: "#DFE4E3",
  green: "#236752",
  pale: "#EAF1EC",
  gold: "#A36D20",
};
export const S = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.cream },
  content: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    padding: 24,
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
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  card: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 22,
    padding: 24,
    gap: 14,
  },
  hero: { backgroundColor: C.navy, borderRadius: 24, padding: 28, gap: 18 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: C.red,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1,
    color: C.navy,
  },
  h2: { fontSize: 22, fontWeight: "700", letterSpacing: -0.5, color: C.navy },
  h3: { fontSize: 17, fontWeight: "700", color: C.navy },
  body: { fontSize: 15, lineHeight: 23, color: C.muted },
  small: { fontSize: 12, lineHeight: 19, color: C.muted },
  white: { color: C.white },
  light: { color: "#C5D3D9" },
  input: {
    borderWidth: 1,
    borderColor: "#B8C6CA",
    borderRadius: 12,
    backgroundColor: C.white,
    padding: 14,
    fontSize: 16,
    minHeight: 50,
    color: C.navy,
  },
  pill: {
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 12,
  },
  chosen: { backgroundColor: C.navy, borderColor: C.navy },
  error: { color: "#A42E25", fontSize: 14, lineHeight: 21 },
  rule: { height: 1, backgroundColor: C.line },
});
export function Screen({ children }: React.PropsWithChildren) {
  return (
    <SafeAreaView style={S.page} edges={["top", "left", "right"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={S.content}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export function Brand() {
  return (
    <View style={S.row}>
      <CircleDot size={27} color={C.red} />
      <Text
        style={{
          color: C.navy,
          fontSize: 20,
          fontWeight: "800",
          letterSpacing: -0.6,
        }}
      >
        PracticePal<Text style={{ fontWeight: "400" }}> Baseball</Text>
      </Text>
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
      <Text style={S.eyebrow}>{eyebrow}</Text>
      <Text role="heading" aria-level={1} style={S.title}>
        {title}
      </Text>
      {detail && <Text style={S.body}>{detail}</Text>}
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
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 50,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: secondary ? C.white : C.red,
        borderWidth: 1,
        borderColor: secondary ? C.line : C.red,
        opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <Text
        style={{
          color: secondary ? C.navy : C.white,
          fontSize: 15,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
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
      <Text style={[S.small, { fontWeight: "700" }, selected && S.white]}>
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
    <View style={{ flex: 1, minWidth: 86, gap: 5 }}>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "800",
          color: C.navy,
          letterSpacing: -1,
        }}
      >
        {value}
      </Text>
      <Text style={S.small}>{label}</Text>
    </View>
  );
}
