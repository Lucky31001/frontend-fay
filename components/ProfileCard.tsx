import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Card, Avatar, Button, useTheme } from 'react-native-paper';
import { Profile } from '@/types/types';
import { API_BASE_URL } from '@/utils/config';

type Props = {
  profile: Profile;
  onFollow?: (id: number) => void;
  onPress?: () => void;
};

export default function ProfileCard({ profile, onFollow, onPress }: Props) {
  const theme = useTheme();

  const imageUri = profile.image
  const imageSource = imageUri ? { uri: imageUri } : undefined;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Card style={{ marginBottom: 8, borderRadius: 10, overflow: 'hidden', backgroundColor: theme.colors.surface }} elevation={1}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          {imageSource ? (
            <Avatar.Image size={48} source={imageSource} />
          ) : (
            <Avatar.Icon size={48} icon="account" />
          )}

          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: '700', fontSize: 14, color: theme.colors.onSurface }}>{profile.name}</Text>
            {profile.event_type?.name ? (
              <Text style={{ color: theme.colors.onSurface, opacity: 0.7, fontSize: 12 }}>{profile.event_type?.name}</Text>
            ) : null}
            {profile.description ? (
              <Text numberOfLines={2} style={{ marginTop: 6, color: theme.colors.onSurface, opacity: 0.75, fontSize: 12 }}>
                {profile.description}
              </Text>
            ) : null}
          </View>

          {/*<View style={{ marginLeft: 8 }}>*/}
          {/*  <Button compact mode="contained" onPress={() => onFollow && onFollow(profile.id)}>*/}
          {/*    Suivre*/}
          {/*  </Button>*/}
          {/*</View>*/}
        </View>
      </Card>
    </TouchableOpacity>
  );
}


