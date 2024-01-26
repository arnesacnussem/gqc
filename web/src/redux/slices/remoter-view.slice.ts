import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRemoterProps } from '../../components/remoter/remoter.tsx';

interface SpeedState {
    left: number;
    right: number;
}

interface RemoterViewState {
    speed: SpeedState;
    showVideo?: boolean;
    showExtendedInfo?: boolean;
}

type RemoterViewStateSet = {
    [key: string]: RemoterViewState;
};

interface SetStatePayloadAction<T extends SpeedState | boolean> {
    id: string;
    value: T;
}

export const remoterViewSlice = createSlice({
    initialState: {} as RemoterViewStateSet,
    name: 'remoter-view',
    reducers: {
        setSpeed: (
            state,
            action: PayloadAction<SetStatePayloadAction<SpeedState>>,
        ) => ({
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                speed: action.payload.value,
            },
        }),
        setShowVideo: (
            state,
            action: PayloadAction<SetStatePayloadAction<boolean>>,
        ) => ({
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                showVideo: action.payload.value,
            },
        }),
        setShowExtendedInfo: (
            state,
            action: PayloadAction<SetStatePayloadAction<boolean>>,
        ) => ({
            ...state,
            [action.payload.id]: {
                ...state[action.payload.id],
                showExtendedInfo: action.payload.value,
            },
        }),
        addView: (state, action: PayloadAction<string>) => ({
            ...state,
            [action.payload]: {
                speed: { left: 0, right: 0 },
            },
        }),
        removeView: (state, action: PayloadAction<IRemoterProps>) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [action.payload.id]: _, ...rest } = state;
            return rest;
        },
    },
});

export const RemoterViewActions = remoterViewSlice.actions;
