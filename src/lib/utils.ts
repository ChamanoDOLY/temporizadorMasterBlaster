import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Funções para persistência no localStorage
type TimerData = {
  workTime: number
  leisureTime: number
  isWorkRunning: boolean
  isLeisureRunning: boolean
}

const TIMER_STORAGE_KEY = 'workLeisureTimerData'

export function saveTimerData(data: TimerData) {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error)
  }
}

export function loadTimerData(): TimerData | null {
  try {
    const data = localStorage.getItem(TIMER_STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error)
    return null
  }
}

export function clearTimerData() {
  try {
    localStorage.removeItem(TIMER_STORAGE_KEY)
  } catch (error) {
    console.error('Erro ao limpar dados do localStorage:', error)
  }
}
