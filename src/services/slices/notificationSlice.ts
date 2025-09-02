import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export type ThresholdRule = { id: string; metric: string; operator: ">" | "<" | ">=" | "<="; value: number; enabled: boolean }
export type DeviceRule = { offline: { enabled: boolean; afterMs: number }; thresholds: ThresholdRule[] }
export type NotificationsConfig = { global: { adminEmails: string[]; dailySummary: boolean }; byDevice: Record<string, DeviceRule> }

type NotificationsState = {
  config: NotificationsConfig | null
  paramId: string | null
  status: 'idle' | 'ready'
}

const initialState: NotificationsState = { config: null, paramId: null, status: 'idle' }

const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setConfig(state, action: PayloadAction<NotificationsConfig>) {
      state.config = action.payload
      state.status = 'ready'
    },
    setParamId(state, action: PayloadAction<string | null>) {
      state.paramId = action.payload
    },
    setDailySummary(state, action: PayloadAction<boolean>) {
      if (!state.config) return
      state.config.global.dailySummary = action.payload
    },
    addAdminEmail(state, action: PayloadAction<string>) {
      if (!state.config) return
      const e = action.payload.trim()
      if (!e) return
      if (!state.config.global.adminEmails.includes(e)) state.config.global.adminEmails.push(e)
    },
    removeAdminEmail(state, action: PayloadAction<string>) {
      if (!state.config) return
      state.config.global.adminEmails = state.config.global.adminEmails.filter(x => x !== action.payload)
    },
    setOffline(state, action: PayloadAction<{ id: string; enabled: boolean }>) {
      if (!state.config) return
      const r = state.config.byDevice[action.payload.id]
      if (!r) return
      r.offline.enabled = action.payload.enabled
    },
    setOfflineAfter(state, action: PayloadAction<{ id: string; afterMs: number }>) {
      if (!state.config) return
      const r = state.config.byDevice[action.payload.id]
      if (!r) return
      r.offline.afterMs = action.payload.afterMs
    },
    addThreshold(state, action: PayloadAction<{ id: string; newRule: ThresholdRule }>) {
      if (!state.config) return
      const r = state.config.byDevice[action.payload.id]
      if (!r) return
      r.thresholds.push(action.payload.newRule)
    },
    updateThreshold(state, action: PayloadAction<{ id: string; ruleId: string; patch: Partial<ThresholdRule> }>) {
      if (!state.config) return
      const r = state.config.byDevice[action.payload.id]
      if (!r) return
      const i = r.thresholds.findIndex(t => t.id === action.payload.ruleId)
      if (i === -1) return
      r.thresholds[i] = { ...r.thresholds[i], ...action.payload.patch } as ThresholdRule
    },
    removeThreshold(state, action: PayloadAction<{ id: string; ruleId: string }>) {
      if (!state.config) return
      const r = state.config.byDevice[action.payload.id]
      if (!r) return
      r.thresholds = r.thresholds.filter(t => t.id !== action.payload.ruleId)
    },
    resetConfig(state, action: PayloadAction<NotificationsConfig>) {
      state.config = action.payload
    },
  }
})

export const {
  setConfig, setParamId, setDailySummary,
  addAdminEmail, removeAdminEmail,
  setOffline, setOfflineAfter,
  addThreshold, updateThreshold, removeThreshold,
  resetConfig
} = slice.actions

export default slice.reducer

export type { NotificationsState }
