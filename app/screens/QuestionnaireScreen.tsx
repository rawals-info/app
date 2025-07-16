import React, { FC, useState, useEffect } from 'react'
import { View, Pressable, ViewStyle, TextStyle, StatusBar, Platform, Alert, ScrollView, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'
import type { ThemedStyle } from '@/theme/types'
import { api } from '@/services/api'
import { setHasOnboarded } from '@/utils/persistence'
import { layout, shadowElevation } from '@/theme/styleHelpers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getCachedCategory, saveCachedCategory, CachedCategory } from '@/utils/questionCache'

// Question category types from backend
type CategoryType = 'non_patient' | 'at_risk' | 'patient'

// Question response types
type ResponseType = 'mcq' | 'numeric' | 'yes_no'

interface Question {
  id: string
  questionText: string
  responseType: ResponseType
  options?: string[] | null
  order: number
}

interface QuestionnaireCategory {
  slug: CategoryType
  affirmationText: string
  questions: Question[]
}

export const QuestionnaireScreen: FC<{ navigation?: any; route?: any }> = ({ navigation, route }) => {
  const { themed, theme } = useAppTheme()
  const [category, setCategory] = useState<QuestionnaireCategory | null>(null)
  const [cachedLoaded, setCachedLoaded] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Map from goal to category
  const goalToCategoryMap: Record<string, CategoryType> = {
    'prevent': 'non_patient',
    'monitor': 'at_risk',
    'diagnosed': 'patient'
  }

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      const selectedGoal = route?.params?.goal || await AsyncStorage.getItem('pendingGoal') || 'prevent'
      const categorySlug = goalToCategoryMap[selectedGoal]
      // Try cache first
      const cached = await getCachedCategory(categorySlug as CategoryType)
      if (cached && isMounted) {
        setCategory(cached as any)
        setCachedLoaded(true)
        setLoading(false)
      }
      // Always fetch network to refresh
      try {
        const result = await api.getQuestions(categorySlug)
        if (result.kind === 'ok' && result.data?.success) {
          const fresh = result.data.data as CachedCategory
          // Compare updatedAt
          if (!cached || new Date(fresh.updatedAt).getTime() > new Date(cached.updatedAt).getTime()) {
            await saveCachedCategory(categorySlug as CategoryType, fresh)
            if (isMounted) setCategory(fresh as any)
          }
        }
      } catch (e) {
        console.log('Network fetch failed, using cache if available')
      } finally {
        if (isMounted && !cachedLoaded) setLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [route?.params?.goal])

  const handleBack = () => {
    if (!navigation) {
      Alert.alert('Navigation Error', 'Navigation prop is undefined')
      return
    }
    
    if (navigation.canGoBack?.()) {
      navigation.goBack()
    } else {
      try {
        navigation.navigate('OnboardingGoal')
      } catch (error) {
        navigation.replace('OnboardingGoal')
      }
    }
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async () => {
    if (!category) return
    
    // Validate all questions are answered
    const unansweredQuestions = category.questions.filter(q => !answers[q.id])
    if (unansweredQuestions.length > 0) {
      Alert.alert('Please answer all questions before continuing.')
      return
    }
    
    setSubmitting(true)
    
    try {
      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, answerValue]) => ({
        questionId,
        answerValue
      }))
      
      // Submit summary request
      const selectedGoal = route?.params?.goal || await AsyncStorage.getItem('pendingGoal') || 'prevent'
      const summaryResp = await api.getSummary({ goal: selectedGoal, answers: formattedAnswers });
      const summaryData = summaryResp.kind === 'ok' && summaryResp.data?.success ? summaryResp.data.data : { title: 'Thank you!', summary: 'We will personalise your plan next.' };

      // Mark onboarding complete
      await setHasOnboarded();
      
      navigation?.navigate?.('Summary', { ...summaryData, goal: selectedGoal });
    } catch (error) {
      console.error('Error submitting answers:', error)
      Alert.alert('Error', 'Failed to submit answers. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Render different input types based on question type
  const renderQuestionInput = (question: Question) => {
    switch (question.responseType) {
      case 'mcq':
        return (
          <View style={$optionsContainer}>
            {question.options?.map((option, index) => {
              const isSelected = answers[question.id] === option
              
              return (
                <Pressable
                  key={index}
                  style={[
                    $optionButton,
                    isSelected && { backgroundColor: '#2AA199', borderColor: '#2AA199' }
                  ]}
                  onPress={() => handleAnswerChange(question.id, option)}
                >
                  <Text 
                    style={[
                      $optionText,
                      isSelected && { color: '#FFFFFF' }
                    ]}
                    text={option}
                  />
                </Pressable>
              )
            })}
          </View>
        )
        
      case 'numeric':
        return (
          <View style={$numericInputContainer}>
            <TextInput
              style={$numericInput}
              value={answers[question.id] || ''}
              onChangeText={(value) => handleAnswerChange(question.id, value)}
              keyboardType="numeric"
              placeholder="Enter value"
              placeholderTextColor="#999"
            />
          </View>
        )
        
      case 'yes_no':
        return (
          <View style={$yesNoContainer}>
            <Pressable
              style={[
                $yesNoButton,
                answers[question.id] === 'Yes' && { backgroundColor: '#2AA199', borderColor: '#2AA199' }
              ]}
              onPress={() => handleAnswerChange(question.id, 'Yes')}
            >
              <Text 
                style={[
                  $yesNoText,
                  answers[question.id] === 'Yes' && { color: '#FFFFFF' }
                ]}
                text="Yes"
              />
            </Pressable>
            <Pressable
              style={[
                $yesNoButton,
                answers[question.id] === 'No' && { backgroundColor: '#2AA199', borderColor: '#2AA199' }
              ]}
              onPress={() => handleAnswerChange(question.id, 'No')}
            >
              <Text 
                style={[
                  $yesNoText,
                  answers[question.id] === 'No' && { color: '#FFFFFF' }
                ]}
                text="No"
              />
            </Pressable>
          </View>
        )
        
      default:
        return null
    }
  }

  if (loading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        <View style={$loadingContainer}>
          <Text text="Loading questions..." />
        </View>
      </Screen>
    )
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={$container}>
        {/* Back button */}
        <Pressable 
          style={$backButton} 
          onPress={handleBack} 
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color="#2AA199" />
        </Pressable>
        
        {/* Main content container */}
        <View style={$mainContainer}>
          {/* Affirmation text */}
          {category && (
            <View style={$affirmationContainer}>
              <Text 
                preset="body"
                weight="medium" 
                text={category.affirmationText} 
                style={themed($affirmationText)} 
              />
            </View>
          )}
          
          {/* Questions */}
          <ScrollView 
            style={$questionsScrollView}
            contentContainerStyle={$questionsContainer}
            showsVerticalScrollIndicator={false}
          >
            {category?.questions.map((question, index) => (
              <View key={question.id} style={$questionCard}>
                <Text 
                  preset="body"
                  weight="medium" 
                  text={`${index + 1}. ${question.questionText}`} 
                  style={$questionText} 
                />
                {renderQuestionInput(question)}
              </View>
            ))}
          </ScrollView>
        </View>
        
        {/* Footer with button */}
        <View style={$footer}>
          <Button
            text="Continue"
            preset="primary"
            disabled={submitting || !category || Object.keys(answers).length < (category?.questions.length || 0)}
            style={$continueButton}
            onPress={handleSubmit}
          />
        </View>
      </Screen>
    </>
  )
}

// Styles
const $container: ViewStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  justifyContent: 'space-between',
}

const $loadingContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}

const $mainContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: 24,
  justifyContent: 'flex-start',
}

const $affirmationContainer: ViewStyle = {
  paddingTop: 16,
  paddingBottom: 16,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(0,0,0,0.05)',
  marginBottom: 16,
}

const $affirmationText: ThemedStyle<TextStyle> = () => ({
  textAlign: 'center',
  fontSize: 18,
  lineHeight: 24,
  fontWeight: '500',
  fontStyle: 'italic',
  color: '#2AA199',
})

const $questionsScrollView: ViewStyle = {
  flex: 1,
}

const $questionsContainer: ViewStyle = {
  paddingBottom: 24,
}

const $questionCard: ViewStyle = {
  marginBottom: 20,
  padding: 16,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.1)',
  ...shadowElevation(2),
}

const $questionText: TextStyle = {
  fontSize: 16,
  lineHeight: 22,
  marginBottom: 16,
  color: '#000000',
}

const $backButton: ViewStyle = {
  position: 'absolute',
  top: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  left: 24,
  zIndex: 10,
  width: 40,
  height: 40,
  borderRadius: 20,
  ...layout.center,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  ...shadowElevation(2),
}

const $optionsContainer: ViewStyle = {
  marginTop: 8,
}

const $optionButton: ViewStyle = {
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#CCCCCC',
  marginBottom: 8,
  backgroundColor: '#F8F8F8',
}

const $optionText: TextStyle = {
  fontSize: 14,
  color: '#333333',
}

const $numericInputContainer: ViewStyle = {
  marginTop: 8,
}

const $numericInput: TextStyle = {
  height: 48,
  borderWidth: 1,
  borderColor: '#CCCCCC',
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 16,
}

const $yesNoContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
}

const $yesNoButton: ViewStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#CCCCCC',
  marginHorizontal: 4,
  backgroundColor: '#F8F8F8',
  alignItems: 'center',
}

const $yesNoText: TextStyle = {
  fontSize: 14,
  color: '#333333',
  fontWeight: '500',
}

const $footer: ViewStyle = {
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderTopWidth: 1,
  borderTopColor: 'rgba(0,0,0,0.05)',
  backgroundColor: '#FFFFFF',
}

const $continueButton: ViewStyle = {
  height: 48,
} 