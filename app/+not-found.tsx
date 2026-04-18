import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function NotFoundScreen() {
  const theme = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Link href="/(tabs)/agenda" style={[styles.button, { color: theme.colors.primary }]}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
  },
});
