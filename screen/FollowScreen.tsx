import React, {useCallback, useState} from 'react';
import { Text, View, FlatList, RefreshControl } from 'react-native';
import {Button, useTheme, ActivityIndicator} from 'react-native-paper';
import { COLOR } from '@/constant/color';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useFocusEffect} from "@react-navigation/native";
import { Profile } from '@/types/types';
import {get_profiles} from "@/services/profile";
import ProfileCard from '@/components/ProfileCard';

export default function FollowScreen() {
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfiles = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await get_profiles();
      setProfiles(data || []);
    } catch (err: any) {
      const message = err?.message || 'Erreur lors du chargement des profils';
      setProfiles([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfiles();
    }, [fetchProfiles]),
  );

  const renderProfile = ({ item }: { item: Profile }) => {
    return <ProfileCard profile={item} onFollow={() => { /* TODO: follow action */ }} />;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Ionicons name={'musical-notes-outline'} color={COLOR.BLUE} size={24} />
        <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: '500', color: theme.colors.onSurface }}>Artistes à découvrir</Text>
      </View>

      {loading && profiles.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <ActivityIndicator animating size="large" />
        </View>
      ) : profiles.length > 0 ? (
        <FlatList
          data={profiles}
          keyExtractor={(p) => p.id.toString()}
          renderItem={renderProfile}
          contentContainerStyle={{ paddingBottom: 32 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProfiles} />}
        />
      ) : (
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: theme.colors.onSurface, marginBottom: 12 }}>{error ?? "Aucun artiste trouvé."}</Text>
          <Button mode="contained" onPress={() => fetchProfiles()}>Réessayer</Button>
        </View>
      )}
    </View>
  );
}
