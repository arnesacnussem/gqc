import { Box, BoxProps } from '@mui/material';
import { IRemoterProps } from './remoter.tsx';
import { useAppSelector } from '../../redux/hooks.ts';

export const VideoViewer = (
    props: IRemoterProps & {
        boxProps?: BoxProps;
    },
) => {
    const show = useAppSelector(state => state.remoter[props.id]?.showVideo);
    return (
        <Box
            {...props.boxProps}
            sx={{
                border: '1px dashed',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                maxWidth: '640px',
                ...props.boxProps?.sx,
            }}
        >
            {show && (
                <img
                    src={props.stream_uri}
                    style={{
                        maxWidth: '100%',
                    }}
                    alt={'video stream'}
                />
            )}
        </Box>
    );
};
