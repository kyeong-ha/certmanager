// src/features/center/slices/educationCenterSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCenterByUuid, fetchAllEducationSession } from '@/features/center/services/center.api';
import type { EducationCenterSession } from '@/features/center/types/EducationCenterSession.type';
import { EducationCenterCreateForm } from '../types/EducationCenterCreateForm.type';

// 전체 state 타입 정의
interface EducationCenterState {
  sessions: EducationCenterSession[];
  centers: Record<string, EducationCenterSession>; // 대표 세션 (center_name 기준)
  centerDetails: Record<string, EducationCenterCreateForm>; // center_name 기준 상세정보
  centerDetailsByUuid: Record<string, EducationCenterCreateForm>; // uuid 기준 상세정보
  loading: boolean;
  error: string | null;
}

const initialState: EducationCenterState = {
  sessions: [],
  centers: {},
  centerDetails: {},
  centerDetailsByUuid: {},
  loading: false,
  error: null,
};

// 모든 기수 불러오기 (center + session 리스트)
export const fetchSessions = createAsyncThunk<EducationCenterSession[]>(
  'educationCenter/fetchSessions',
  async () => {
    return await fetchAllEducationSession();
  }
);

// 단일 center 상세정보 불러오기
export const fetchCenterDetailByUuid = createAsyncThunk<EducationCenterCreateForm, string>('educationCenter/fetchCenterDetailByUuid', async (uuid) => {
  return await fetchCenterByUuid(uuid);
});

const educationCenterSlice = createSlice({
  name: 'educationCenter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        const sessions = action.payload;
        const centerMap: Record<string, EducationCenterSession> = {};
        const detailMap: Record<string, EducationCenterCreateForm> = {};

        for (const s of sessions) {
          const c = s.education_center as EducationCenterCreateForm;
          const name = c.center_name;

          if (!(name in centerMap)) {
            centerMap[name] = s;
          }

          if (!(name in detailMap)) {
            detailMap[name] = {
              uuid: c.uuid,
              center_name: c.center_name,
              center_tel: c.center_tel ?? '',
              ceo_name: c.ceo_name ?? '',
              ceo_mobile: c.ceo_mobile ?? '',
              manager_name: c.manager_name ?? '',
              manager_mobile: c.manager_mobile ?? '',
              center_address: c.center_address ?? '',
              delivery_address: c.delivery_address ?? '',
              unit_price: c.unit_price ?? '',
              center_session: '', // session은 사용자가 입력
            };
          }
        }

        state.sessions = sessions;
        state.centers = centerMap;
        state.centerDetails = detailMap;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '세션 목록 불러오기 실패';
      })
      .addCase(fetchCenterDetailByUuid.fulfilled, (state, action) => {
        const center = action.payload;
        state.centerDetailsByUuid[center.uuid] = center;
      });
  },
});

export default educationCenterSlice.reducer;