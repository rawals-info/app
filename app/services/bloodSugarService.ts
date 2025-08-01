import { api } from "./api"

export interface BloodSugarReading {
  id?: string
  value: number
  unit: "mg/dL" | "mmol/L"
  readingDateTime: string
  readingType: "fasting" | "before_meal" | "after_meal" | "before_exercise" | "after_exercise" | "bedtime" | "random" | "continuous_monitor"
  entryMethod: "manual" | "device" | "api"
  deviceInfo?: any
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface HbA1cReading {
  id?: string
  value: number
  unit: "percent"
  takenAt: string
  source: "manual" | "lab_report"
  createdAt?: string
  updatedAt?: string
}

export interface BloodSugarStats {
  count: number
  average: number
  min: number
  max: number
  inTargetRange: number
  belowTarget: number
  aboveTarget: number
  byReadingType: Record<string, any>
  byDay: Record<string, any>
}

class BloodSugarService {
  // Blood Sugar Readings
  async createReading(reading: Omit<BloodSugarReading, "id" | "createdAt" | "updatedAt">) {
    const response = await api.apisauce.post("/api/blood-sugar", reading)
    return response.data
  }

  async getReadings(params?: {
    startDate?: string
    endDate?: string
    readingType?: string
    limit?: number
    offset?: number
  }) {
    const response = await api.apisauce.get("/api/blood-sugar", {}, { params })
    return response.data
  }

  async getReadingById(id: string) {
    const response = await api.apisauce.get(`/api/blood-sugar/${id}`)
    return response.data
  }

  async updateReading(id: string, reading: Partial<BloodSugarReading>) {
    const response = await api.apisauce.put(`/api/blood-sugar/${id}`, reading)
    return response.data
  }

  async deleteReading(id: string) {
    const response = await api.apisauce.delete(`/api/blood-sugar/${id}`)
    return response.data
  }

  async getStatistics(period: "24hours" | "7days" | "30days" | "90days" = "7days") {
    const response = await api.apisauce.get("/api/blood-sugar/statistics", {}, { params: { period } })
    return response.data
  }

  // HbA1c Readings
  async createHbA1cReading(reading: Omit<HbA1cReading, "id" | "createdAt" | "updatedAt">) {
    const response = await api.apisauce.post("/api/hba1c", reading)
    return response.data
  }

  async getHbA1cReadings(params?: {
    startDate?: string
    endDate?: string
    limit?: number
    offset?: number
  }) {
    const response = await api.apisauce.get("/api/hba1c", {}, { params })
    return response.data
  }

  async getHbA1cById(id: string) {
    const response = await api.apisauce.get(`/api/hba1c/${id}`)
    return response.data
  }

  async updateHbA1cReading(id: string, reading: Partial<HbA1cReading>) {
    const response = await api.apisauce.put(`/api/hba1c/${id}`, reading)
    return response.data
  }

  async deleteHbA1cReading(id: string) {
    const response = await api.apisauce.delete(`/api/hba1c/${id}`)
    return response.data
  }

  // Utility methods
  convertUnit(value: number, fromUnit: "mg/dL" | "mmol/L", toUnit: "mg/dL" | "mmol/L"): number {
    if (fromUnit === toUnit) return value
    
    if (fromUnit === "mg/dL" && toUnit === "mmol/L") {
      return value / 18
    }
    
    if (fromUnit === "mmol/L" && toUnit === "mg/dL") {
      return value * 18
    }
    
    return value
  }

  isValueInRange(value: number, type: "glucose" | "hba1c"): {
    isNormal: boolean
    isWarning: boolean
    message?: string
  } {
    if (type === "glucose") {
      if (value < 70) {
        return { isNormal: false, isWarning: true, message: "Low blood sugar" }
      }
      if (value > 180) {
        return { isNormal: false, isWarning: true, message: "High blood sugar" }
      }
      return { isNormal: true, isWarning: false }
    }
    
    if (type === "hba1c") {
      if (value < 5.7) {
        return { isNormal: true, isWarning: false }
      }
      if (value >= 5.7 && value <= 6.4) {
        return { isNormal: false, isWarning: true, message: "Prediabetes range" }
      }
      if (value >= 6.5) {
        return { isNormal: false, isWarning: true, message: "Diabetes range" }
      }
    }
    
    return { isNormal: true, isWarning: false }
  }
}

export const bloodSugarService = new BloodSugarService() 