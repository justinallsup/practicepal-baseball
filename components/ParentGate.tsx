import React, { useState } from "react";
import { View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { ShieldCheck } from "lucide-react-native";
import { Screen, Heading, Card, Field, Button, C, S } from "./ui";
export default function ParentGate({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false),
    [answer, setAnswer] = useState(""),
    [error, setError] = useState(false);
  const [numbers, setNumbers] = useState([7, 8]);
  useFocusEffect(
    React.useCallback(() => {
      setOpen(false);
      setAnswer("");
      setError(false);
      setNumbers([
        6 + Math.floor(Math.random() * 7),
        6 + Math.floor(Math.random() * 7),
      ]);
    }, []),
  );
  if (open) return <>{children}</>;
  return (
    <Screen>
      <Heading
        eyebrow="PARENT SPACE"
        title="For the grown-ups."
        detail="Manage goals, approve rewards, and look after your family’s records."
      />
      <Card style={{ maxWidth: 520, width: "100%", alignSelf: "center" }}>
        <ShieldCheck size={36} color={C.green} />
        <Text style={S.h2}>A quick grown-up check</Text>
        <Text style={S.body}>Ask a parent or guardian to continue.</Text>
        <Field
          label={`What is ${numbers[0]} × ${numbers[1]}?`}
          value={answer}
          onChangeText={setAnswer}
          keyboardType="number-pad"
          onSubmitEditing={() => {
            if (Number(answer) === numbers[0] * numbers[1]) setOpen(true);
            else setError(true);
          }}
        />
        {error && (
          <Text style={S.error} role="alert">
            Please try that answer again.
          </Text>
        )}
        <Button
          title="Open parent space"
          onPress={() => {
            if (Number(answer) === numbers[0] * numbers[1]) setOpen(true);
            else setError(true);
          }}
        />
        <Text style={S.small}>
          This check discourages accidental changes. It is not a password or
          secure account lock.
        </Text>
      </Card>
    </Screen>
  );
}
