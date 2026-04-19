import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLOR } from '@/constant/color';

type Point = { x: number; y: number };

type Props = {
  children?: React.ReactNode;
  onClick?: () => void | Promise<void>;
  colors?: readonly [string, string, ...string[]];
  start?: Point;
  end?: Point;
  style?: any;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
};

export default function GradientButton({
  children,
  onClick,
  colors = [COLOR.BLUE, COLOR.PURPLE] as const,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  loading = false,
  disabled = false,
  label,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={() => {
        if (!isDisabled && onClick) onClick();
      }}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          alignSelf: 'flex-start',
          opacity: pressed ? 0.85 : 1,
          width: 36,
          height: 36,
          marginRight: 8,
          marginBottom: 5,
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 40,
          minWidth: 40,
          opacity: isDisabled ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : label ? (
          <Text style={{ color: '#fff', fontWeight: '600' }}>{label}</Text>
        ) : (
          children
        )}
      </LinearGradient>
    </Pressable>
  );
}
