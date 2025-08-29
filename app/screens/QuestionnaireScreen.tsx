import React, { FC, useState, useEffect } from 'react'
import { View, Pressable, ViewStyle, TextStyle, StatusBar, Platform, Alert, ScrollView, TextInput, Image, ImageStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { Screen } from '@/components/Screen'
import { Text } from '@/components/Text'
import { Button } from '@/components/Button'
import { useAppTheme } from '@/theme/context'
import type { ThemedStyle } from '@/theme/types'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'
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
  const { setIsOnboarded } = useAuth()
  const [category, setCategory] = useState<QuestionnaireCategory | null>(null)
  const [cachedLoaded, setCachedLoaded] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  // Map from goal to category
  const goalToCategoryMap: Record<string, CategoryType> = {
    'prevent': 'non_patient',
    'monitor': 'at_risk',
    'diagnosed': 'patient',
    'caregiver': 'non_patient' // Placeholder - will use non_patient questions for now
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
          
          // Deduplicate questions by ID (safety measure)
          const uniqueQuestions = fresh.questions?.filter((question, index, arr) => 
            arr.findIndex(q => q.id === question.id) === index
          ) || []
          
          const deduped = { ...fresh, questions: uniqueQuestions }
          
          // Compare updatedAt
          if (!cached || new Date(fresh.updatedAt).getTime() > new Date(cached.updatedAt).getTime()) {
            await saveCachedCategory(categorySlug as CategoryType, deduped)
            if (isMounted) setCategory(deduped as any)
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

      // Mark onboarding as in progress locally
      // Complete onboarding will be called after user signup in Summary screen
      // setIsOnboarded(true) - moved to Summary screen
      
      navigation?.navigate?.('UserInfo', { ...summaryData, goal: selectedGoal });
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
          <View style={$mcqContainer}>
            {question.options?.map((option, index) => {
              const isSelected = answers[question.id] === option
              
              return (
                <Pressable
                  key={index}
                  style={[
                    $mcqOptionButton,
                    isSelected && { backgroundColor: '#10B981', borderColor: '#10B981' }
                  ]}
                  onPress={() => handleAnswerChange(question.id, option)}
                >
                  <Text 
                    style={[
                      $mcqOptionText,
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
                answers[question.id] === 'Yes' && { backgroundColor: '#10B981', borderColor: '#10B981' }
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
                answers[question.id] === 'No' && { backgroundColor: '#10B981', borderColor: '#10B981' }
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
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </Pressable>
        
        {/* Main content with scroll */}
        <ScrollView 
          style={$scrollView}
          contentContainerStyle={$scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with illustration */}
          <View style={$headerSection}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop&crop=center' }}
              style={$doctorImage}
              resizeMode="cover"
            />
                      <Text 
            preset="headline"
            text="Additional Details" 
            style={$headerTitle} 
          />
          <Text text="Step 2 of 4" style={$stepText} />
          <View style={$progressBar}>
            <View style={[$progressFill, { width: '50%' }]} />
          </View>
          <Text 
            preset="body"
            text="To personalize your experience, please provide a few more details about your lifestyle and health history." 
            style={$headerSubtitle} 
          />
          </View>

          {/* Affirmation text */}
          {category && category.affirmationText && (
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
          <View style={$questionsContainer}>
            {category?.questions.map((question, index) => (
              <View key={`${question.id}-${index}`} style={$questionSection}>
                <Text 
                  preset="body"
                  weight="medium" 
                  text={question.questionText} 
                  style={$questionTitle} 
                />
                {renderQuestionInput(question)}
              </View>
            ))}
          </View>
        </ScrollView>
        
        {/* Footer with button */}
        <View style={$footer}>
          <Button
            text="Submit"
            preset="primary"
            disabled={submitting || !category || Object.keys(answers).length < (category?.questions.length || 0)}
            style={$submitButton}
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

const $scrollView: ViewStyle = {
  flex: 1,
}

const $scrollContent: ViewStyle = {
  paddingHorizontal: 24,
  paddingTop: 60, // Space for back button
}

const $headerSection: ViewStyle = {
  alignItems: 'center',
  marginBottom: 24,
  paddingVertical: 16,
}

const $doctorImage: ImageStyle = {
  width: 100,
  height: 100,
  borderRadius: 50,
  marginBottom: 16,
}

const $headerTitle: TextStyle = {
  fontSize: 24,
  fontWeight: '600',
  color: '#1F2937',
  textAlign: 'center',
  marginBottom: 8,
}

const $stepText: TextStyle = {
  fontSize: 14,
  color: '#6B7280',
  textAlign: 'center',
  marginBottom: 16,
}

const $progressBar: ViewStyle = {
  height: 4,
  backgroundColor: '#E5E7EB',
  borderRadius: 2,
  overflow: 'hidden',
  marginBottom: 16,
  width: '80%',
  alignSelf: 'center',
}

const $progressFill: ViewStyle = {
  height: '100%',
  backgroundColor: '#1F2937',
  borderRadius: 2,
}

const $headerSubtitle: TextStyle = {
  fontSize: 16,
  color: '#6B7280',
  textAlign: 'center',
  lineHeight: 24,
  paddingHorizontal: 16,
}

const $affirmationContainer: ViewStyle = {
  paddingVertical: 12,
  paddingHorizontal: 16,
  backgroundColor: '#F3F4F6',
  borderRadius: 8,
  borderLeftWidth: 3,
  borderLeftColor: '#374151',
  marginBottom: 16,
}

const $affirmationText: ThemedStyle<TextStyle> = () => ({
  textAlign: 'center',
  fontSize: 16,
  lineHeight: 22,
  fontWeight: '500',
  fontStyle: 'italic',
  color: '#374151',
})

const $questionsContainer: ViewStyle = {
  paddingBottom: 100, // Space for fixed button
}

const $questionSection: ViewStyle = {
  marginBottom: 24,
}

const $questionTitle: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  color: '#1F2937',
  marginBottom: 12,
  lineHeight: 22,
}

const $backButton: ViewStyle = {
  position: 'absolute',
  top: Platform.OS === 'android' ? StatusBar.currentHeight || 0 + 16 : 16,
  left: 24,
  zIndex: 10,
  width: 44,
  height: 44,
  borderRadius: 22,
  ...layout.center,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  ...shadowElevation(2),
}

const $mcqContainer: ViewStyle = {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 8,
}

const $mcqOptionButton: ViewStyle = {
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  backgroundColor: '#FFFFFF',
  minWidth: 60,
  alignItems: 'center',
  ...shadowElevation(1),
}

const $mcqOptionText: TextStyle = {
  fontSize: 14,
  color: '#374151',
  fontWeight: '500',
}

const $numericInputContainer: ViewStyle = {
  marginTop: 8,
}

const $numericInput: TextStyle = {
  height: 48,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 14,
  backgroundColor: '#FFFFFF',
  color: '#374151',
  ...shadowElevation(1),
}

const $yesNoContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 12,
  marginTop: 8,
}

const $yesNoButton: ViewStyle = {
  flex: 1,
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: '#E5E7EB',
  backgroundColor: '#FFFFFF',
  alignItems: 'center',
  ...shadowElevation(1),
}

const $yesNoText: TextStyle = {
  fontSize: 16,
  color: '#374151',
  fontWeight: '500',
}

const $footer: ViewStyle = {
  paddingVertical: 20,
  paddingHorizontal: 24,
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#E5E7EB',
}

const $submitButton: ViewStyle = {
  height: 56,
  backgroundColor: '#000000',
  borderRadius: 12,
  ...shadowElevation(3),
} 