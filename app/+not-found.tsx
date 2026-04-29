import { View } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <Link
          href="/login"
          style={{ fontSize: 20, textDecorationLine: 'underline', color: theme.colors.primary }}
        >
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}
