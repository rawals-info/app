"use strict";
// This is a placeholder for an AI service integration
// In a real implementation, this would call an external AI service like GPT-4/Claude
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBloodSugarPatterns = exports.generateExerciseRecommendations = exports.analyzeFoodIntake = void 0;
/**
 * Analyze food items and provide nutritional assessment and recommendations
 * @param foodItems - List of food items with names and nutritional info
 * @param userProfile - User profile with relevant health data
 * @returns Analysis results with recommendations
 */
const analyzeFoodIntake = async (foodItems, userProfile) => {
    try {
        // This is a simulated AI response
        // In a real implementation, this would call an AI API
        // Calculate basic nutritional totals
        let totalCarbs = 0, totalProtein = 0, totalFat = 0, totalSugar = 0, totalCalories = 0;
        let highGlycemicIndex = [];
        let lowNutrientDensity = [];
        // Sample analysis of food items
        for (const item of foodItems) {
            totalCarbs += item.carbs || 0;
            totalProtein += item.protein || 0;
            totalFat += item.fat || 0;
            totalSugar += item.sugar || 0;
            totalCalories += item.calories || 0;
            // Detect potentially problematic foods
            const name = item.name.toLowerCase();
            if (name.includes('soda') || name.includes('candy') || name.includes('cake') ||
                name.includes('sugar') || name.includes('syrup') || name.includes('donut')) {
                highGlycemicIndex.push(item.name);
            }
            if (name.includes('processed') || name.includes('fried') || name.includes('chips')) {
                lowNutrientDensity.push(item.name);
            }
        }
        // Generate analysis
        const analysis = {
            nutritionalSummary: {
                totalCarbs,
                totalProtein,
                totalFat,
                totalSugar,
                totalCalories
            },
            diabeticConcerns: {
                highGlycemicFoods: highGlycemicIndex,
                lowNutrientFoods: lowNutrientDensity,
                mealBalance: totalCarbs > 60 ? 'high_carb' : 'balanced',
                sugarContent: totalSugar > 25 ? 'high' : 'moderate'
            },
            recommendations: []
        };
        // Generate recommendations based on nutritional content
        if (highGlycemicIndex.length > 0) {
            analysis.recommendations.push({
                priority: 'high',
                title: 'High Glycemic Index Foods Detected',
                description: `Your meal contains foods that may cause rapid blood sugar spikes: ${highGlycemicIndex.join(', ')}`,
                suggestedAction: 'Consider replacing these items with lower glycemic index alternatives like whole grains, legumes, or non-starchy vegetables.'
            });
        }
        if (totalCarbs > 60) {
            analysis.recommendations.push({
                priority: 'medium',
                title: 'High Carbohydrate Content',
                description: `This meal contains ${totalCarbs}g of carbohydrates, which may cause blood sugar elevation.`,
                suggestedAction: 'Try to limit carbs to 45-60g per meal. Consider reducing portion sizes or substituting with non-starchy vegetables.'
            });
        }
        if (totalProtein < 15 && totalCalories > 400) {
            analysis.recommendations.push({
                priority: 'medium',
                title: 'Low Protein Content',
                description: 'This meal is relatively low in protein compared to its overall calories.',
                suggestedAction: 'Adding lean protein can help slow digestion and reduce blood sugar spikes. Consider adding eggs, fish, chicken, tofu, or legumes.'
            });
        }
        return analysis;
    }
    catch (error) {
        console.error('AI food analysis error:', error);
        return {
            error: 'Failed to analyze food items',
            nutritionalSummary: {
                totalCarbs: 0,
                totalProtein: 0,
                totalFat: 0,
                totalSugar: 0,
                totalCalories: 0
            },
            diabeticConcerns: {
                highGlycemicFoods: [],
                lowNutrientFoods: [],
                mealBalance: 'balanced',
                sugarContent: 'moderate'
            },
            recommendations: []
        };
    }
};
exports.analyzeFoodIntake = analyzeFoodIntake;
/**
 * Generate personalized exercise recommendations based on user data
 * @param userProfile - User profile with health data
 * @param bloodSugarReadings - Recent blood sugar readings
 * @param exerciseHistory - Past exercise records
 * @returns Personalized exercise recommendations
 */
const generateExerciseRecommendations = async (userProfile, bloodSugarReadings, exerciseHistory) => {
    try {
        // This is a simulated AI response
        // In a real implementation, this would call an AI API
        // Analyze blood sugar patterns
        const highReadings = bloodSugarReadings.filter(r => r.value > (userProfile.targetBloodSugarMax || 180));
        const hasHighBloodSugar = highReadings.length > 0;
        // Check exercise history
        const recentExercise = exerciseHistory.length > 0;
        const exerciseTypes = new Set(exerciseHistory.map(e => e.exerciseType));
        const recommendations = {
            suggestedExercises: [],
            intensity: userProfile.diabetesType === 'type1' ? 'moderate' : 'moderate_to_high',
            duration: '30-45 minutes',
            frequency: '4-5 times per week',
            warnings: [],
            tips: []
        };
        // Generate exercise recommendations
        if (hasHighBloodSugar) {
            recommendations.suggestedExercises.push({ name: 'Walking', benefits: 'Gentle on joints, helps lower blood sugar', duration: '30 minutes' }, { name: 'Cycling', benefits: 'Low-impact cardio, improves insulin sensitivity', duration: '20-30 minutes' });
            recommendations.tips.push('For elevated blood sugar, moderate exercise can help bring levels down', 'Check your blood sugar before and after exercise to understand how your body responds');
            recommendations.warnings.push('If blood sugar is above 240 mg/dL, check for ketones before exercising');
        }
        else {
            recommendations.suggestedExercises.push({ name: 'Strength Training', benefits: 'Builds muscle, improves insulin sensitivity', duration: '20-30 minutes' }, { name: 'Swimming', benefits: 'Full-body workout, gentle on joints', duration: '30 minutes' }, { name: 'Yoga', benefits: 'Reduces stress, improves flexibility and balance', duration: '30 minutes' });
            recommendations.tips.push('Mix cardio and strength training for optimal blood sugar management', 'Even short exercise sessions of 10 minutes can provide benefits');
        }
        // Add variety if doing the same exercises
        if (exerciseTypes.size < 3 && recentExercise) {
            recommendations.tips.push('Consider adding variety to your exercise routine to work different muscle groups');
            recommendations.suggestedExercises.push({ name: 'Rowing', benefits: 'Full-body workout, builds endurance and strength', duration: '20 minutes' }, { name: 'Dancing', benefits: 'Fun cardio that improves coordination', duration: '30 minutes' });
        }
        return recommendations;
    }
    catch (error) {
        console.error('AI exercise recommendation error:', error);
        return {
            error: 'Failed to generate exercise recommendations',
            suggestedExercises: [],
            warnings: [],
            tips: ['Regular physical activity can help manage blood sugar levels']
        };
    }
};
exports.generateExerciseRecommendations = generateExerciseRecommendations;
/**
 * Analyze blood sugar patterns and provide recommendations
 * @param readings - Blood sugar readings
 * @param userProfile - User profile
 * @returns Analysis with insights and recommendations
 */
const analyzeBloodSugarPatterns = async (readings, userProfile) => {
    try {
        // This is a simulated AI response
        // In a real implementation, this would call an AI API
        if (readings.length < 5) {
            return {
                message: 'Insufficient data for meaningful analysis',
                recommendations: [
                    {
                        title: 'Log More Readings',
                        description: 'Record your blood sugar regularly to enable pattern detection',
                        priority: 'medium'
                    }
                ]
            };
        }
        // Basic statistics
        const values = readings.map(r => r.value);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const targetMin = userProfile.targetBloodSugarMin || 70;
        const targetMax = userProfile.targetBloodSugarMax || 180;
        // Pattern detection (simplified)
        const highReadings = readings.filter(r => r.value > targetMax);
        const lowReadings = readings.filter(r => r.value < targetMin);
        const highReadingPercentage = (highReadings.length / readings.length) * 100;
        const lowReadingPercentage = (lowReadings.length / readings.length) * 100;
        // Time-based patterns (simplified)
        const morningReadings = readings.filter(r => {
            const hour = new Date(r.readingDateTime).getHours();
            return hour >= 5 && hour <= 9;
        });
        const eveningReadings = readings.filter(r => {
            const hour = new Date(r.readingDateTime).getHours();
            return hour >= 18 && hour <= 22;
        });
        const morningAvg = morningReadings.length > 0
            ? morningReadings.reduce((sum, r) => sum + r.value, 0) / morningReadings.length
            : 0;
        const eveningAvg = eveningReadings.length > 0
            ? eveningReadings.reduce((sum, r) => sum + r.value, 0) / eveningReadings.length
            : 0;
        // Generate insights and recommendations
        const insights = [];
        const recommendations = [];
        // Overall control
        if (avg < targetMin) {
            insights.push('Your average blood sugar is below your target range, indicating potential hypoglycemia risk.');
            recommendations.push({
                title: 'Low Blood Sugar Alert',
                description: `Your average reading of ${avg.toFixed(1)} is below your target minimum of ${targetMin}.`,
                priority: 'high',
                suggestedAction: 'Consider consulting your healthcare provider to adjust your treatment plan.'
            });
        }
        else if (avg > targetMax) {
            insights.push('Your average blood sugar is above your target range, indicating potential hyperglycemia.');
            recommendations.push({
                title: 'High Blood Sugar Alert',
                description: `Your average reading of ${avg.toFixed(1)} is above your target maximum of ${targetMax}.`,
                priority: 'high',
                suggestedAction: 'Review your diet, exercise, and medication. Consider consulting your healthcare provider.'
            });
        }
        else {
            insights.push(`Your average blood sugar of ${avg.toFixed(1)} is within your target range of ${targetMin}-${targetMax}.`);
        }
        // Pattern-specific insights
        if (highReadingPercentage > 30) {
            insights.push(`${highReadingPercentage.toFixed(1)}% of your readings are above your target maximum.`);
            recommendations.push({
                title: 'Frequent High Readings',
                description: 'You have a significant number of high blood sugar readings.',
                priority: 'medium',
                suggestedAction: 'Try to identify triggers by noting what you eat and your activity levels before high readings.'
            });
        }
        if (lowReadingPercentage > 15) {
            insights.push(`${lowReadingPercentage.toFixed(1)}% of your readings are below your target minimum.`);
            recommendations.push({
                title: 'Frequent Low Readings',
                description: 'You have several low blood sugar readings, which can be dangerous.',
                priority: 'high',
                suggestedAction: 'Ensure you have fast-acting carbohydrates available. Discuss with your healthcare provider.'
            });
        }
        // Time-based insights
        if (morningAvg > 0 && eveningAvg > 0 && morningAvg > eveningAvg + 20) {
            insights.push(`Your morning readings (avg: ${morningAvg.toFixed(1)}) tend to be higher than evening readings (avg: ${eveningAvg.toFixed(1)}).`);
            recommendations.push({
                title: 'Dawn Phenomenon Detected',
                description: 'Your blood sugar appears to be higher in the morning, which might be due to the dawn phenomenon.',
                priority: 'medium',
                suggestedAction: 'Consider adjusting your evening meal, bedtime snack, or medication timing after consulting your healthcare provider.'
            });
        }
        return {
            statistics: {
                average: avg,
                minimum: min,
                maximum: max,
                timeInRange: 100 - (highReadingPercentage + lowReadingPercentage)
            },
            insights,
            recommendations
        };
    }
    catch (error) {
        console.error('AI blood sugar analysis error:', error);
        return {
            error: 'Failed to analyze blood sugar patterns',
            recommendations: []
        };
    }
};
exports.analyzeBloodSugarPatterns = analyzeBloodSugarPatterns;
