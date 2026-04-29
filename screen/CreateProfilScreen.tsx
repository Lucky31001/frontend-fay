import {
    View,
    Text,
    Pressable,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme, IconButton, Button } from 'react-native-paper';
import FieldInput from '@/components/FieldInput';
import * as ImagePicker from 'expo-image-picker';
import EventTypeSelector from '@/components/EventTypeSelector';
import LocationPicker from '@/components/LocationPicker';
import CustomCalendar from '@/components/CustomCalendar';
import {create_profile} from "@/services/profile";

export default function CreateProfilScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [image, setImage] = useState<{ uri: string; name?: string; type?: string } | null>(null);

    const resetState = () => {
        setImage(null);
        setName('');
        setDescription('');
        setSelectedTypes([]);
        setSubmitted(false);
        setLoading(false);
    };

    const onSubmit = async () => {
        setSubmitted(true);
        if (
            !image ||
            !name ||
            !location ||
            selectedTypes.length === 0
        ) {
            return;
        }

        try {
            setLoading(true);
            let data;
            if (image) {
                const form = new FormData();
                form.append('name', name);
                form.append('description', description);
                selectedTypes.forEach((type) => form.append('event_type', type));

                const uriParts = image.uri.split('/');
                const fileName = image.name || uriParts[uriParts.length - 1];
                const fileType =
                    image.type || (fileName.includes('.') ? `image/${fileName.split('.').pop()}` : 'image');
                // @ts-ignore FormData file
                form.append('image', { uri: image.uri, name: fileName, type: fileType });

                data = await create_profile(form);
            } else {
                const payload = {
                    name,
                    location,
                    description,
                    event_type: selectedTypes,
                };
                data = await create_profile(payload);
            }
            if (data) {
                resetState();
                Alert.alert('Succès', "Le profile a été créé avec succès");
                router.replace('/(tabs)/agenda');
            }
        } catch (err: any) {
            setLoading(false);
            Alert.alert('Erreur', err?.message || "Impossible de créer le profile");
        }
    };

    const pickImage = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== 'granted') {
                Alert.alert('Permission refusée', "Autorisez l'accès à la galerie pour ajouter une image.");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 1],
                quality: 0.8,
            });
            const canceled = (result as any).canceled ?? (result as any).cancelled ?? false;
            if (!canceled) {
                const uri = (result as any).uri ?? (result as any)?.assets?.[0]?.uri;
                if (uri) setImage({ uri, name: uri.split('/').pop() });
            }
        } catch {
            console.error('Error picking image');
        }
    };

    const theme = useTheme();

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{
                        padding: 16,
                        flexGrow: 1,
                        backgroundColor: theme.colors.background,
                    }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View>
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ marginBottom: 6, color: theme.colors.onSurface, fontWeight: '500' }}>
                                Image *
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Button mode="outlined" onPress={pickImage}>
                                    Choisir une image
                                </Button>
                                {image && (
                                    <Image
                                        source={{ uri: image.uri }}
                                        style={{ width: 64, height: 64, borderRadius: 8, marginLeft: 12 }}
                                    />
                                )}
                                {submitted && !image && (
                                    <Text style={{ color: theme.colors.error, marginTop: 6 }}>Ce champ est obligatoire</Text>
                                )}
                            </View>
                        </View>
                        <FieldInput
                            label="Nom"
                            value={name}
                            onChangeText={setName}
                            placeholder="Jane doe"
                            required
                            showError={submitted}
                        />
                        <FieldInput
                            label="description"
                            value={description}
                            onChangeText={setDescription}
                            placeholder="J'adore les fleure et le heavy metal"
                            multiline
                            height={100}
                            showError={submitted}
                        />
                        <View style={{ marginBottom: 12 }}>
                            <Text style={{ marginBottom: 6, color: theme.colors.onSurface, fontWeight: '500' }}>
                                Type d’événement
                            </Text>
                            <EventTypeSelector
                                value={selectedTypes}
                                onChange={setSelectedTypes}
                                showError={submitted}
                            />
                        </View>
                        <Text style={{ color: theme.colors.onSurface, fontWeight: '400' }}>
                            Champs nécessaire : *
                        </Text>
                        <Pressable
                            onPress={onSubmit}
                            disabled={loading}
                            accessibilityRole="button"
                            style={({ pressed }) => ({
                                backgroundColor: theme.colors.primary,
                                paddingVertical: 12,
                                borderRadius: 8,
                                alignItems: 'center',
                                marginBottom: 12,
                                opacity: loading ? 0.8 : pressed ? 0.85 : 1,
                                marginTop: 8,
                                flexDirection: 'row',
                                justifyContent: 'center',
                            })}
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color={(theme.colors as any).onPrimary || '#fff'}
                                    accessibilityLabel="loading"
                                />
                            ) : (
                                <Text style={{ color: theme.colors.onPrimary || '#fff', fontWeight: '600' }}>
                                    Créé mon profile créateur
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
