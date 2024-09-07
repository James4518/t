import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMomentRes } from '@/network/features/moment/type';
import { ILabel, ILabelnitialState } from './type';
import { getLabelMoments, getLabels } from '@/network/features/label';
import { IBasePageParams, IRes } from '@/network/features/interface';
import { IThunkState } from '@/store/type';

const initialState: ILabelnitialState = {
  labels: [],
  labelMoments: {}
};
export const LabelSlice = createSlice({
  name: 'moment',
  initialState,
  reducers: {
    changeLabelsAction(state, { payload }) {
      state.labels = payload;
    },
    changeLabelMomentsAction(state, { payload }) {
      const { labelId, moments } = payload;
      if (state.labelMoments[labelId]) {
        state.labelMoments[labelId] = [
          ...state.labelMoments[labelId],
          ...moments
        ];
      } else {
        state.labelMoments[labelId] = moments;
      }
    }
  }
});

export const fetchLabelsAction = createAsyncThunk<
  IRes<ILabel[]>,
  IBasePageParams,
  IThunkState
>('label/labels', async ({ offset = 0, size = 10 }, { dispatch }) => {
  const res = await getLabels(offset, size);
  dispatch(changeLabelsAction(res.data));
  return res;
});
export const fetchLabelMomentsAction = createAsyncThunk<
  IRes<ILabel[]>,
  string,
  IThunkState
>('label/labelMoments', async (labelName, { getState, dispatch }) => {
  const state = getState();
  const label = state.label.labels.find((label) => label.name === labelName)!;
  const res = await getLabelMoments(labelName);
  dispatch(changeLabelMomentsAction({ labelId: label.id, moments: res.data }));
  return res;
});

export const { changeLabelsAction, changeLabelMomentsAction } =
  LabelSlice.actions;
export default LabelSlice.reducer;