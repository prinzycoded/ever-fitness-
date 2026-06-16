export const defaultPrograms = [
  { name: '6-Week Transformation', description: 'Complete body transformation with custom meal plan and daily workouts', duration: 6, durationUnit: 'weeks', price: 299, sessionsPerWeek: 5, active: true },
  { name: '12-Week Body Recomposition', description: 'Build muscle and lose fat simultaneously with progressive programming', duration: 12, durationUnit: 'weeks', price: 499, sessionsPerWeek: 4, active: true },
  { name: 'Monthly Maintenance', description: 'Stay on track with weekly check-ins and customized workouts', duration: 1, durationUnit: 'month', price: 149, sessionsPerWeek: 3, active: true },
]

export const defaultWorkingHours = [
  { day: 'Monday', start: '09:00', end: '12:00' },
  { day: 'Monday', start: '14:00', end: '17:00' },
  { day: 'Wednesday', start: '09:00', end: '12:00' },
  { day: 'Wednesday', start: '14:00', end: '17:00' },
  { day: 'Friday', start: '09:00', end: '13:00' },
]

export const defaultAutomationRules = [
  { trigger: 'payment_received', action: 'send_welcome_email', active: true },
  { trigger: 'payment_received', action: 'create_onboarding_session', active: true },
  { trigger: 'booking_confirmed', action: 'notify_coach', active: true },
]

export const defaultExercises = [
  { id: 'ex1', name: 'Barbell Bench Press', category: 'chest', equipment: 'barbell', targetMuscles: ['Chest', 'Triceps', 'Shoulders'], description: 'Lie on a flat bench, lower the bar to your chest, and press up.' },
  { id: 'ex2', name: 'Barbell Squat', category: 'legs', equipment: 'barbell', targetMuscles: ['Quads', 'Glutes', 'Core'], description: 'Stand with bar on traps, bend knees to 90 degrees, stand back up.' },
  { id: 'ex3', name: 'Pull-ups', category: 'back', equipment: 'bodyweight', targetMuscles: ['Lats', 'Biceps', 'Core'], description: 'Hang from bar, pull yourself up until chin over bar.' },
  { id: 'ex4', name: 'Overhead Press', category: 'shoulders', equipment: 'dumbbell', targetMuscles: ['Shoulders', 'Triceps', 'Core'], description: 'Press weights overhead from shoulder height.' },
  { id: 'ex5', name: 'Deadlift', category: 'back', equipment: 'barbell', targetMuscles: ['Hamstrings', 'Glutes', 'Back', 'Core'], description: 'Hinge at hips, pull bar from floor to standing position.' },
  { id: 'ex6', name: 'Dumbbell Rows', category: 'back', equipment: 'dumbbell', targetMuscles: ['Lats', 'Rhomboids', 'Biceps'], description: 'Bent over with dumbbell, pull to hip.' },
]

export const defaultTrainingPlan = {
  name: '6-Week Transformation',
  clientName: 'General',
  weeks: [
    {
      weekNumber: 1, name: 'Foundation Week',
      days: [
        { dayNumber: 1, focus: 'Upper Body', exercises: [{ name: 'Bench Press', sets: 4, reps: 8, weight: 0 }, { name: 'Dumbbell Rows', sets: 3, reps: 10, weight: 0 }] },
        { dayNumber: 2, focus: 'Lower Body', exercises: [{ name: 'Squats', sets: 4, reps: 8, weight: 0 }] },
        { dayNumber: 3, focus: 'Rest', exercises: [] },
        { dayNumber: 4, focus: 'Push', exercises: [{ name: 'Overhead Press', sets: 3, reps: 10, weight: 0 }] },
        { dayNumber: 5, focus: 'Pull', exercises: [{ name: 'Pull-ups', sets: 3, reps: 8, weight: 0 }] },
      ],
    },
    {
      weekNumber: 2, name: 'Progression Week',
      days: [
        { dayNumber: 1, focus: 'Upper Body', exercises: [{ name: 'Bench Press', sets: 4, reps: 6, weight: 0 }] },
        { dayNumber: 2, focus: 'Lower Body', exercises: [{ name: 'Deadlifts', sets: 4, reps: 6, weight: 0 }] },
      ],
    },
  ],
}

export const defaultTrainingExercises = [
  { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 50, instructions: 'Lie on a flat bench with feet on the floor. Grip the bar slightly wider than shoulder-width. Lower the bar to your chest, then press up explosively.', restTime: 90 },
  { name: 'Dumbbell Rows', sets: 3, reps: 10, weight: 20, instructions: 'Place one knee and hand on a bench. Keep back straight. Pull the dumbbell to your hip, squeezing your back muscles. Lower with control.', restTime: 60 },
  { name: 'Overhead Press', sets: 3, reps: 10, weight: 30, instructions: 'Stand with feet shoulder-width apart. Press the barbell from shoulders to overhead. Keep core tight and avoid arching your back.', restTime: 75 },
  { name: 'Pull-ups', sets: 3, reps: 8, weight: 0, instructions: 'Grip the bar palms forward, slightly wider than shoulders. Pull yourself up until chin clears the bar. Lower with control.', restTime: 90 },
]

export const defaultChecklistTasks = [
  { id: 't1', title: 'Warm-up: Light cardio & dynamic stretches', duration: '10 min', completed: false, category: 'warmup' },
  { id: 't2', title: 'Barbell Squats', duration: '15 min', completed: false, sets: 4, reps: 8, weight: '60kg', category: 'main' },
  { id: 't3', title: 'Bench Press', duration: '15 min', completed: false, sets: 4, reps: 8, weight: '50kg', category: 'main' },
  { id: 't4', title: 'Dumbbell Rows', duration: '12 min', completed: false, sets: 3, reps: 10, weight: '20kg', category: 'main' },
  { id: 't5', title: 'Plank Hold', duration: '3 min', completed: false, sets: 3, reps: '45s hold', category: 'accessory' },
  { id: 't6', title: 'Cool-down: Stretching', duration: '10 min', completed: false, category: 'cooldown' },
]
