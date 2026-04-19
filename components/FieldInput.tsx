import React from 'react';
import { Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  multiline?: boolean;
  height?: number;
  required?: boolean;
  showError?: boolean;
};

export default function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  height,
  required = false,
  showError = false,
}: Props) {
  const theme = useTheme();
  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.colors.outline || '#e6e9ef',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  } as const;

  const errorColor = (theme.colors as any).error || '#f44336';

  return (
    <>
      <Text style={{ marginBottom: 6, color: theme.colors.onSurface, fontWeight: '500' }}>
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.onSurface}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardAppearance={theme.dark ? 'dark' : 'light'}
        style={[
          inputStyle,
          {
            color: theme.colors.onSurface,
            borderColor:
              showError && required && !value ? errorColor : theme.colors.outline || '#e6e9ef',
            height: multiline && height ? height : undefined,
            textAlignVertical: multiline ? 'top' : undefined,
          },
        ]}
        multiline={multiline}
        keyboardType={keyboardType}
      />
      {showError && required && !value && (
        <Text style={{ color: errorColor, marginTop: -8, marginBottom: 8, fontSize: 12 }}>
          Ce champ est obligatoire
        </Text>
      )}
    </>
  );
}
