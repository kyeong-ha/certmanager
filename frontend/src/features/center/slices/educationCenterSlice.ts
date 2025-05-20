// src/features/center/slices/educationCenterSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCenterByUuid, fetchAllEducationSession } from '@/features/center/services/center.api';
import type { EducationCenterSummary, EducationCenterDetail } from '@/features/center/types/EducationCenter.type';
import type { EducationCenterSessionSummary } from '@/features/center/types/EducationCenterSession.type';


// 전체 state 타입 정의
interface EducationCenterState {
  sessions: EducationCenterSessionSummary[]; // 모든 교육기수 목록
  centersByName: Record<string, EducationCenterSummary>; // center_name 기준 교육기관 요약 정보 (대표 session 포함)
  // centerDetails: Record<string, EducationCenterDetail>; // center_name 기준 상세정보
  centerDetailsByUuid: Record<string, EducationCenterDetail>; // uuid 기준 상세정보
  loading: boolean;
  error: string | null;
}

const initialState: EducationCenterState = {
  sessions: [],
  centersByName: {} as Record<string, EducationCenterSummary>,
  centerDetailsByUuid: {},
  loading: false,
  error: null,
};

// 모든 기수 불러오기 (center + session 리스트)
export const fetchSessions = createAsyncThunk<EducationCenterSessionSummary[]>(
  'educationCenter/fetchSessions',
  async () => {
    return await fetchAllEducationSession();
  }
);

// 단일 center 상세정보 불러오기
export const fetchCenterDetailByUuid = createAsyncThunk<EducationCenterDetail, string>('educationCenter/fetchCenterDetailByUuid', async (uuid) => {
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
      // fetchSessions 성공 시
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
        action.payload.forEach(session => {
          const name = session.education_center.center_name;
          const center = session.education_center;
          if (!state.centersByName[name]) {
            state.centersByName[name] = { ...center, center_session_list: [session] };
          } else {
            state.centersByName[name].center_session_list?.push(session);
          }
        });
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? '세션 목록 불러오기 실패';
      })
      // fetchCenterDetailByUuid 성공 시
      .addCase(fetchCenterDetailByUuid.fulfilled, (state, action) => {
        state.centerDetailsByUuid[action.payload.uuid] = action.payload;
      });
  },
});

export default educationCenterSlice.reducer;