import { Text } from "react-native";
import { router } from "expo-router";
import { Screen, Heading, Card, Button, S } from "../../components/ui";
export default function Billing() {
  return (
    <Screen>
      <Heading eyebrow="KEEP BUILDING" title="PracticePal is free to use." />
      <Card>
        <Text style={S.body}>
          Practice tracking, training plans, rewards, and benchmarks are
          available now. No card or subscription is required. Payments are not
          enabled in this release.
        </Text>
        <Button
          title="Back to practice"
          onPress={() => router.replace("/(home)")}
        />
      </Card>
    </Screen>
  );
}
