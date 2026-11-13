/**
 * Domain models (JSDoc only — this project is plain JavaScript).
 *
 * These typedefs mirror the TypeScript interfaces in the web repo
 * (phaserev/src/types/*.ts) so both apps talk about the same shapes and a
 * future backend can serve one contract. Editors (VS Code) pick these up for
 * autocomplete via `@type {import("@/types/models").Exercise}`.
 *
 * Nothing is exported at runtime; the file exists purely as documentation.
 */

// ─── Auth ──────────────────────────────────────────────────────────────────

/**
 * @typedef {"visitor" | "member" | "admin"} UserRole
 *
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {UserRole} role
 * @property {string} displayName
 * @property {string} [avatarUrl]
 * @property {"essential" | "performance" | "elite"} [tierId]
 */

// ─── Training ──────────────────────────────────────────────────────────────

/**
 * @typedef {"gym" | "calisthenics"} TrainingMode
 * @typedef {"weight" | "reps" | "hold"} TrackingMode
 *   weight → log kg × reps · reps → bodyweight reps only · hold → seconds
 * @typedef {"chest" | "back" | "shoulders" | "arms" | "legs" | "core" | "skills"} MuscleGroup
 * @typedef {"warmup" | "working" | "drop" | "failure" | "superset"} SetType
 *
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} name
 * @property {MuscleGroup} muscleGroup
 * @property {string} equipment
 * @property {TrainingMode} mode
 * @property {string[]} tags              e.g. ["push", "chest"] — used by library filters
 * @property {TrackingMode} trackingMode
 * @property {number} defaultRestSeconds
 * @property {string[]} primaryMuscles
 * @property {string[]} technique         Form cues
 * @property {string[]} commonErrors
 *
 * @typedef {Object} RoutineExercise    One line inside a routine (a "prescription")
 * @property {string} exerciseId
 * @property {number} sets
 * @property {string} repRange          "6–8", "30–45 SEC"
 * @property {string} [rir]             Reps in reserve, e.g. "1–2"
 * @property {number} restSeconds
 * @property {string} [notes]
 * @property {string} [supersetGroup]   Same letter = performed back-to-back
 *
 * @typedef {Object} Routine
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {TrainingMode} mode
 * @property {number} daysPerWeek
 * @property {RoutineExercise[]} exercises
 *
 * @typedef {Object} SessionSet         A set inside a planned/active session
 * @property {number} setNumber
 * @property {SetType} setType
 * @property {string} targetReps
 * @property {number} [targetWeight]
 * @property {number} [targetHoldSeconds]
 * @property {number} [previousWeight]
 * @property {number} [previousReps]
 * @property {number} [previousHoldSeconds]
 * @property {number} [weight]          What the user actually logged
 * @property {number} [reps]
 * @property {number} [holdSeconds]
 * @property {number} [rir]
 * @property {boolean} completed
 *
 * @typedef {Object} SessionExercise
 * @property {string} id                Unique within the session ("se-1")
 * @property {string} exerciseId
 * @property {number} order
 * @property {string} repRange
 * @property {string} [rir]
 * @property {number} restSeconds
 * @property {string} [notes]
 * @property {string} [supersetGroup]
 * @property {SessionSet[]} sets
 *
 * @typedef {Object} WorkoutSession     Today's plan, or the live session once started
 * @property {string} routineId
 * @property {string} name
 * @property {string} focus
 * @property {TrainingMode} mode
 * @property {number} estimatedMinutes
 * @property {SessionExercise[]} exercises
 *
 * @typedef {Object} HistorySet
 * @property {number} [weight]
 * @property {number} [reps]
 * @property {number} [holdSeconds]
 *
 * @typedef {Object} HistoryExercise
 * @property {string} exerciseId
 * @property {HistorySet[]} sets
 *
 * @typedef {Object} WorkoutHistoryEntry  A finished workout (persisted)
 * @property {string} id
 * @property {string} routineId
 * @property {string} name
 * @property {string} performedAt        ISO timestamp (start time)
 * @property {number} durationMin
 * @property {number} sets               Completed sets
 * @property {number} volumeKg           Σ weight × reps
 * @property {number} prs
 * @property {string} [notes]
 * @property {HistoryExercise[]} exercises
 *
 * @typedef {Object} SessionSummary       Shown on the "Session complete" screen
 * @property {string} historyId
 * @property {string} name
 * @property {number} durationMin
 * @property {number} sets
 * @property {number} volumeKg
 * @property {number} prs
 * @property {number | null} volumeDeltaPercent  vs the previous session of the same routine
 * @property {number} streak
 */

// ─── Profile (nutrition, mood, assessment) ─────────────────────────────────

/**
 * @typedef {Object} MacroTarget
 * @property {number} current
 * @property {number} target
 *
 * @typedef {Object} MealLogEntry
 * @property {string} id
 * @property {string} meal
 * @property {string} time
 * @property {number} calories
 * @property {number} protein
 * @property {number} carbs
 * @property {number} fat
 * @property {boolean} logged
 *
 * @typedef {Object} SavedAssessment
 * @property {"metric" | "imperial"} unitSystem
 * @property {number} heightCm
 * @property {number} weightKg
 * @property {number} age
 * @property {number} targetWeightKg
 * @property {string} goalId
 * @property {string} activityId
 * @property {number} bmi
 * @property {string} completedAt       ISO timestamp
 *
 * @typedef {Object} MoodEntry
 * @property {string} date              YYYY-MM-DD
 * @property {string} moodId
 * @property {string} [note]
 *
 * @typedef {Object} UserProfile
 * @property {SavedAssessment | null} assessment
 * @property {{ calories: MacroTarget, protein: MacroTarget, carbs: MacroTarget, fat: MacroTarget,
 *              hydration: { current: number, target: number, unit: string },
 *              mealLog: MealLogEntry[], selectedRegionId: string, date: string }} nutrition
 * @property {{ entries: MoodEntry[] }} mood
 * @property {{ breathingSessions: number, mindfulMinutes: number }} mind
 */

export {};
