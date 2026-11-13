/**
 * ProgressPhotosCard — monthly progress photos (Body · supporting data).
 *
 * The website shows placeholders; the app takes real photos: from the camera
 * or the photo library (expo-image-picker), saved into the app's documents
 * folder and listed newest first. Long-press a photo to delete it.
 */
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActionSheetIOS, Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppText, Button, Card, Icon, SectionHeader, SegmentedControl } from "@/components/ui";
import { formatShortDate } from "@/lib/dates";
import { haptics } from "@/lib/haptics";
import { deletePhoto, persistPhoto } from "@/lib/photo-storage";
import { IS_IOS } from "@/lib/platform";
import { useTheme } from "@/providers/ThemeProvider";
import { useTrainingStore } from "@/stores/training-store";
import { radius, spacing } from "@/theme";

const ANGLES = [
  { id: "Front", label: "Front" },
  { id: "Side", label: "Side" },
  { id: "Back", label: "Back" },
];

const PICKER_OPTIONS = { mediaTypes: ["images"], allowsEditing: true, aspect: [3, 4], quality: 0.8 };

export function ProgressPhotosCard() {
  const { colors, isDark } = useTheme();
  const photos = useTrainingStore((state) => state.photos);
  const addProgressPhoto = useTrainingStore((state) => state.addProgressPhoto);
  const removeProgressPhoto = useTrainingStore((state) => state.removeProgressPhoto);
  const [angle, setAngle] = useState("Front");

  const save = async (result) => {
    if (result.canceled || !result.assets?.length) return;
    const uri = await persistPhoto(result.assets[0].uri);
    addProgressPhoto({ uri, angle });
    haptics.success();
  };

  const fromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera access needed", "Allow camera access in Settings to take progress photos.");
      return;
    }
    save(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
  };

  const fromLibrary = async () => save(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));

  const add = () => {
    if (IS_IOS) {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: `Add a ${angle.toLowerCase()} photo`,
          options: ["Take photo", "Choose from library", "Cancel"],
          cancelButtonIndex: 2,
          userInterfaceStyle: isDark ? "dark" : "light",
        },
        (index) => {
          if (index === 0) fromCamera();
          if (index === 1) fromLibrary();
        },
      );
      return;
    }
    Alert.alert(`Add a ${angle.toLowerCase()} photo`, undefined, [
      { text: "Take photo", onPress: fromCamera },
      { text: "Choose from library", onPress: fromLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const confirmDelete = (photo) => {
    if (!photo.uri) return;
    haptics.warning();
    Alert.alert("Delete photo?", "This removes it from your progress timeline.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deletePhoto(photo.uri);
          removeProgressPhoto(photo.id);
        },
      },
    ]);
  };

  return (
    <Card style={styles.card}>
      <SectionHeader title="Progress photos" subtitle="Same light, same angle, once a month" />
      <SegmentedControl options={ANGLES} value={angle} onChange={setAngle} size="sm" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pressable
          onPress={add}
          accessibilityRole="button"
          accessibilityLabel="Add progress photo"
          style={({ pressed }) => [
            styles.slot,
            styles.addSlot,
            { borderColor: colors.accent, backgroundColor: colors.accentSoft },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Icon name="camera" size={22} color="accent" />
          <AppText variant="captionStrong" color="accentStrong">
            Add photo
          </AppText>
        </Pressable>
        {photos.map((photo) => (
          <Pressable
            key={photo.id}
            onLongPress={() => confirmDelete(photo)}
            delayLongPress={350}
            accessibilityLabel={`${photo.angle} photo, ${formatShortDate(photo.date)}`}
            style={styles.slotWrapper}
          >
            {photo.uri ? (
              <Image source={{ uri: photo.uri }} style={styles.slot} contentFit="cover" transition={200} />
            ) : (
              <View
                style={[
                  styles.slot,
                  styles.placeholder,
                  { backgroundColor: colors.surfaceSoft, borderColor: colors.borderStrong },
                ]}
              >
                <Icon name="image" size={20} color="textTertiary" />
                <AppText variant="caption" color="textMuted">
                  {photo.angle}
                </AppText>
              </View>
            )}
            <AppText variant="caption" color="textMuted" align="center">
              {formatShortDate(photo.date)}
              {photo.uri ? ` · ${photo.angle}` : ""}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
      {photos.some((photo) => photo.uri) ? (
        <AppText variant="caption" color="textMuted">
          Long-press a photo to delete it. Photos stay on this device.
        </AppText>
      ) : (
        <Button label="Take your first photo" icon="camera" variant="soft" fullWidth onPress={add} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { gap: spacing.sm, paddingRight: spacing.xs },
  slotWrapper: { gap: spacing.xs },
  slot: { width: 104, aspectRatio: 3 / 4, borderRadius: radius.md },
  addSlot: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  placeholder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
});
