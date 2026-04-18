import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function FollowScreen() {
  return (
    <>
      {(() => {
        const theme = useTheme();
        return (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              backgroundColor: theme.colors.background,
            }}
          ></View>
        );
      })()}
    </>
  );
}
