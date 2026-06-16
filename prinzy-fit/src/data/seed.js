import { db, ref, set, get } from '../firebase'
import { defaultPrograms, defaultWorkingHours, defaultAutomationRules, defaultExercises, defaultTrainingPlan } from './seedData'

export async function seedFirebase(force = false) {
  const paths = [
    { path: 'programs', data: defaultPrograms, keyed: true },
    { path: 'workingHours', data: defaultWorkingHours, keyed: false },
    { path: 'automationRules', data: defaultAutomationRules, keyed: true },
    { path: 'exercises', data: defaultExercises, keyed: true },
    { path: 'trainingPlans', data: [defaultTrainingPlan], keyed: true },
  ]

  for (const { path, data, keyed } of paths) {
    const snap = await get(ref(db, path))
    if (!snap.exists() || force) {
      if (keyed) {
        for (const item of data) {
          const id = item.id || `${path.slice(0, -1)}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
          await set(ref(db, `${path}/${id}`), { ...item })
        }
      } else {
        await set(ref(db, path), data)
      }
    }
  }
}
