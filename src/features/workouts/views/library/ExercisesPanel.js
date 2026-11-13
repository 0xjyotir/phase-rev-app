/**
 * ExercisesPanel — Library → Exercises.
 *
 * Gym / Calisthenics switch · search by name or equipment · muscle chips ·
 * favorites filter. (Web: ExerciseLibrary)
 */
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, EmptyState, SegmentedControl, TextField } from "@/components/ui";
import { exercises, matchesMuscleFilter, muscleFilters } from "@/constants/exercises";
import { seedSkills } from "@/constants/training-seed";
import { ExerciseListItem } from "@/features/workouts/components/ExerciseListItem";
import { SkillProgressList } from "@/features/workouts/components/SkillProgressList";
import { SportProgramsCard } from "@/features/workouts/components/SportProgramsCard";
import { capitalize } from "@/lib/format";
import { useTrainingStore } from "@/stores/training-store";
import { spacing } from "@/theme";

const MODES = [
  { id: "gym", label: "Gym" },
  { id: "calisthenics", label: "Calisthenics" },
];

export function ExercisesPanel() {
  const favoriteIds = useTrainingStore((state) => state.favoriteExerciseIds);
  const [mode, setMode] = useState("gym");
  const [muscle, setMuscle] = useState("all");
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter(
      (exercise) =>
        exercise.mode === mode &&
        matchesMuscleFilter(exercise, muscle) &&
        (!favoritesOnly || favoriteIds.includes(exercise.id)) &&
        (!q ||
          exercise.name.toLowerCase().includes(q) ||
          exercise.equipment.toLowerCase().includes(q)),
    );
  }, [mode, muscle, query, favoritesOnly, favoriteIds]);

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMuscle("all"); // filter sets differ per mode
  };

  return (
    <View style={styles.gap}>
      <SegmentedControl options={MODES} value={mode} onChange={changeMode} size="sm" />

      <TextField
        icon="search"
        placeholder="Search by name or equipment"
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
        returnKeyType="search"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        <Chip
          icon="heart"
          label="Favorites"
          selected={favoritesOnly}
          onPress={() => setFavoritesOnly((value) => !value)}
          size="md"
        />
        {muscleFilters[mode].map((filterId) => (
          <Chip
            key={filterId}
            label={filterId === "all" ? "All" : capitalize(filterId)}
            selected={muscle === filterId}
            onPress={() => setMuscle(filterId)}
            size="md"
          />
        ))}
      </ScrollView>

      {results.length === 0 ? (
        <EmptyState
          icon="search"
          title="No exercises match"
          message="Try another muscle group or clear the search."
        />
      ) : (
        <View style={styles.list}>
          {results.map((exercise) => (
            <ExerciseListItem key={exercise.id} exercise={exercise} />
          ))}
        </View>
      )}

      {mode === "calisthenics" ? <SkillProgressList skills={seedSkills} /> : <SportProgramsCard />}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: spacing.lg },
  chips: { gap: spacing.sm, paddingRight: spacing.lg },
  list: { gap: spacing.sm },
});
