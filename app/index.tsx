import { Redirect } from 'expo-router'
import { useStore } from '../lib/store'

export default function Root() {
  const onboardingComplete = useStore(s => s.onboardingComplete)
  if (!onboardingComplete) return <Redirect href="/onboarding" />
  return <Redirect href="/(home)" />
}
