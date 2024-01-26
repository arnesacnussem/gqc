import { VideoViewer } from './video-viewer.tsx';
import { Box } from '@mui/material';
import { Control } from './control.tsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { useEffect } from 'react';
import { RemoterViewActions } from '../../redux/slices/remoter-view.slice.ts';
import { BasicInfo, ExtendedInfo } from './info.tsx';

export interface IRemoterProps {
    id: string;
    stream_uri: string;
    control_uri: string;
}

export const Remoter = (props: IRemoterProps) => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state.remoter[props.id]);
    useEffect(() => {
        dispatch(RemoterViewActions.addView(props.id));
        return () => {
            dispatch(RemoterViewActions.removeView(props));
        };
    }, [dispatch, props]);
    return state ? (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
                m: 2,
            }}
        >
            <VideoViewer
                {...props}
                boxProps={{
                    sx: {
                        flexGrow: 1,
                    },
                }}
            />
            <Control {...props} />
            <BasicInfo {...props} />
            <ExtendedInfo
                {...props}
                open={state.showExtendedInfo}
                onClose={() =>
                    dispatch(
                        RemoterViewActions.setShowExtendedInfo({
                            id: props.id,
                            value: false,
                        }),
                    )
                }
            />
        </Box>
    ) : null;
};
