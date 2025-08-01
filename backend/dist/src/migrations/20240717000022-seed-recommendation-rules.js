"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
const uuid_1 = require("uuid");
async function up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('recommendation_rules', [
        // Non-patient 12 combinations
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '0', dailyWalking: '0-30', familyHistory: 'no' }),
            title: 'Off to a Careful Start',
            summary: 'You avoid sugary drinks – excellent! Adding just 10 minutes of daily walking can further reduce your risk. Let\'s build on this strong foundation.',
            order: 1,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '0', dailyWalking: '0-30', familyHistory: 'yes' }),
            title: 'Good Base With Some Risk',
            summary: 'Your sugar-free habit is great! While family history increases risk, 30 mins of daily activity can help offset it. We’ll focus on protective habits.',
            order: 2,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '0', dailyWalking: '30+', familyHistory: 'no' }),
            title: 'Health Champion!',
            summary: 'Perfect combo: no sugary drinks and regular movement! You’re in the top 10% for prevention. Let’s find even more ways to optimize your health.',
            order: 3,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '0', dailyWalking: '30+', familyHistory: 'yes' }),
            title: 'Well-Managed Risk',
            summary: 'You’re doing everything right! Family history means we should monitor annually, but your habits put you in great shape. Keep leading this healthy lifestyle!',
            order: 4,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '1-2', dailyWalking: '0-30', familyHistory: 'no' }),
            title: 'Room for Small Tweaks',
            summary: 'Your moderate sugar intake is okay, but adding short walks could significantly boost your protection. Try replacing one sugary drink with herbal tea this week.',
            order: 5,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '1-2', dailyWalking: '0-30', familyHistory: 'yes' }),
            title: 'Balanced But Could Improve',
            summary: 'With family history, reducing to 1 sugary drink/day and walking 15 mins daily would make a big difference. Small changes add up – we’ll help!',
            order: 6,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '1-2', dailyWalking: '30+', familyHistory: 'no' }),
            title: 'Active Lifestyle Pays Off',
            summary: 'Your activity helps balance occasional treats! Try tracking drinks for a week – you might naturally reduce them further. Your body will thank you.',
            order: 7,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '1-2', dailyWalking: '30+', familyHistory: 'yes' }),
            title: 'Protective Habits Forming',
            summary: 'Your exercise helps compensate for both genetics and moderate sugar intake. Swapping to sugar-free alternatives could be your next easy win.',
            order: 8,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '3+', dailyWalking: '0-30', familyHistory: 'no' }),
            title: 'Time for Healthier Choices',
            summary: 'Reducing sugary drinks to 1–2/day would quickly lower your risk. Let’s start with simple swaps – how about flavored sparkling water instead?',
            order: 9,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '3+', dailyWalking: '0-30', familyHistory: 'yes' }),
            title: 'Important Changes Needed',
            summary: 'With family history and current habits, your risk is elevated. Cutting sugar drinks in half and adding short walks would make a dramatic difference.',
            order: 10,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '3+', dailyWalking: '30+', familyHistory: 'no' }),
            title: 'Active But Sugar-Sensitive',
            summary: 'Your activity helps, but 3+ sugary drinks daily still raises risk. Try reducing gradually – even one less per week makes progress.',
            order: 11,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'non_patient',
            conditions: JSON.stringify({ sugaryDrinks: '3+', dailyWalking: '30+', familyHistory: 'yes' }),
            title: 'Urgent Lifestyle Adjustment',
            summary: 'Despite being active, your sugar intake and family history create significant risk. Let’s create a step-by-step plan to reduce drinks and protect your health.',
            order: 12,
            created_at: now,
            updated_at: now
        },
        // At-risk example rule
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Never', postMealFatigue: 'No', fastingGlucose: '<100' }),
            title: 'Potential Hidden Risks',
            summary: 'While your fasting glucose is normal, not checking regularly means you might miss important spikes. Weekly checks would give us valuable insights.',
            order: 1,
            created_at: now,
            updated_at: now
        },
        // Patient (Diagnosed) 13 combinations
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '<3 months', carbMeals: '0-1', onMedication: 'Yes' }),
            title: 'Well-Controlled',
            summary: 'Great job keeping carbs low and staying on top of tests! Your discipline is paying off – let’s explore maintaining this with less medication.',
            order: 1,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '<3 months', carbMeals: '0-1', onMedication: 'No' }),
            title: 'Diet Success Story',
            summary: 'You’re managing well through diet alone! Your recent HbA1c and low-carb choices show what’s possible through lifestyle.',
            order: 2,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '<3 months', carbMeals: '2-3', onMedication: 'Yes' }),
            title: 'Medication Helper',
            summary: 'Your medications are working, but reducing to 1–2 carb-heavy meals daily could help lower your dosage over time.',
            order: 3,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '<3 months', carbMeals: '2-3', onMedication: 'No' }),
            title: 'Tightening Needed',
            summary: 'Your recent HbA1c shows room for improvement. Cutting just one carb-heavy meal daily could make a noticeable difference.',
            order: 4,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '<3 months', carbMeals: '4+', onMedication: 'Yes' }),
            title: 'Medication Backup',
            summary: 'Your medications are compensating for high carb intake. Reducing carbs would make them more effective and might lower needed dosage.',
            order: 5,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '<3 months', carbMeals: '4+', onMedication: 'No' }),
            title: 'Urgent Changes',
            summary: 'With high carb intake and no medication, your body needs support. Let’s create a step-by-step reduction plan together.',
            order: 6,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '3-6 months', carbMeals: '0-1', onMedication: 'Yes' }),
            title: 'Stable but Stale',
            summary: 'Good control, but it’s been 3–6 months since your last HbA1c. More frequent checks would help fine-tune your regimen.',
            order: 7,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '3-6 months', carbMeals: '0-1', onMedication: 'No' }),
            title: 'Natural Manager',
            summary: 'You’re controlling diabetes naturally! An updated HbA1c would show if we can maintain this without medication.',
            order: 8,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '3-6 months', carbMeals: '2-3', onMedication: 'Yes' }),
            title: 'Routine Check Needed',
            summary: 'Your moderate carb intake works with meds, but an updated HbA1c would confirm everything’s on track.',
            order: 9,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '3-6 months', carbMeals: '2-3', onMedication: 'No' }),
            title: 'Precision Opportunity',
            summary: 'Without recent tests, we’re guessing about your control. Let’s get an HbA1c and optimize your carb limits.',
            order: 10,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '3-6 months', carbMeals: '4+', onMedication: 'Yes' }),
            title: 'Medication Overworked',
            summary: 'Your meds are carrying a heavy load. Reducing carbs would help them work better and protect your pancreas.',
            order: 11,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '3-6 months', carbMeals: '4+', onMedication: 'No' }),
            title: 'Danger Zone',
            summary: 'High carbs without medication or recent tests is risky. Let’s make safety our first priority with professional guidance.',
            order: 12,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'patient',
            conditions: JSON.stringify({ lastHbA1c: '>6 months', carbMeals: 'Any', onMedication: 'Any' }),
            title: 'Data Blackout',
            summary: 'Without recent HbA1c tests, we’re flying blind. Your first step is getting tested – we’ll help prepare for the doctor visit.',
            order: 13,
            created_at: now,
            updated_at: now
        },
        // At-risk 12 combinations
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Never', postMealFatigue: 'No', fastingGlucose: '<100' }),
            title: 'Potential Hidden Risks',
            summary: 'While your fasting glucose is normal, not checking regularly means you might miss important spikes. Weekly checks would give us valuable insights.',
            order: 1,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Never', postMealFatigue: 'No', fastingGlucose: '100-125' }),
            title: 'Silent Progression',
            summary: 'Your elevated fasting glucose suggests prediabetes, though you don’t notice symptoms. Catching this early means we can likely reverse it with simple changes.',
            order: 2,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Never', postMealFatigue: 'Yes', fastingGlucose: '<100' }),
            title: 'Mystery Fatigue',
            summary: 'Your fatigue after meals is worth investigating – it might signal glucose spikes we’re not seeing. Let’s start tracking after meals.',
            order: 3,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Never', postMealFatigue: 'Yes', fastingGlucose: '100-125' }),
            title: 'Warning Signs Present',
            summary: 'With fatigue and elevated glucose, your body is signaling for help. The good news? Early intervention can prevent diabetes in 80% of cases.',
            order: 4,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Occasionally', postMealFatigue: 'No', fastingGlucose: '<100' }),
            title: 'Spot Checks Help',
            summary: 'Your occasional checks show good numbers – let’s make them weekly to catch any patterns. Prevention is easier than reversal!',
            order: 5,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Occasionally', postMealFatigue: 'No', fastingGlucose: '100-125' }),
            title: 'Borderline Needs Action',
            summary: 'Your glucose is borderline high when checked. Adding morning checks and cutting evening carbs could quickly improve this.',
            order: 6,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Occasionally', postMealFatigue: 'Yes', fastingGlucose: '<100' }),
            title: 'Meal-Time Matters',
            summary: 'Your fatigue suggests meal-related spikes despite normal fasting glucose. Tracking after meals will reveal hidden patterns.',
            order: 7,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Occasionally', postMealFatigue: 'Yes', fastingGlucose: '100-125' }),
            title: 'Clear Intervention Zone',
            summary: 'All signs point to early metabolic changes. With consistent tracking and meal adjustments, we can likely normalize your levels.',
            order: 8,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Weekly', postMealFatigue: 'No', fastingGlucose: '<100' }),
            title: 'Vigilant Maintainer',
            summary: 'Your regular checks show good control! Let’s optimize further by testing different meals’ effects.',
            order: 9,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Weekly', postMealFatigue: 'No', fastingGlucose: '100-125' }),
            title: 'Data-Driven Improvement',
            summary: 'Your testing habit is perfect – now we’ll use this data to tweak your diet and lower those borderline numbers.',
            order: 10,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Weekly', postMealFatigue: 'Yes', fastingGlucose: '<100' }),
            title: 'Meal Sensitivity',
            summary: 'You’re disciplined about checking but still get fatigue. This suggests specific food triggers we can identify and manage.',
            order: 11,
            created_at: now,
            updated_at: now
        },
        {
            id: (0, uuid_1.v4)(),
            category_slug: 'at_risk',
            conditions: JSON.stringify({ sugarChecks: 'Weekly', postMealFatigue: 'Yes', fastingGlucose: '100-125' }),
            title: 'Prevention in Progress',
            summary: 'Your awareness puts you ahead of most! Now let’s turn these weekly checks into an action plan to reverse early signs.',
            order: 12,
            created_at: now,
            updated_at: now
        }
    ]);
}
async function down(queryInterface) {
    await queryInterface.bulkDelete('recommendation_rules', {});
}
