import {
    Box,
    BoxProps,
    Button,
    ButtonProps,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import {
    InfoOutlined,
    KeyboardArrowDown,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    KeyboardArrowUp,
    RotateLeft,
    RotateRight,
    StopOutlined,
    Visibility,
    VisibilityOff,
} from '@mui/icons-material';
import { CtrlFuncLP, useControl } from './car-ifce.ts';
import { memo } from 'react';
import { useLongPress } from 'use-long-press';
import { IRemoterProps } from './remoter.tsx';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { RemoterViewActions } from '../../redux/slices/remoter-view.slice.ts';
import { SpeedIndicator } from './speed-indicator.tsx';

const theme = createTheme({
    components: {
        MuiButton: {
            defaultProps: {
                variant: 'contained',
                color: 'primary',
            },
            styleOverrides: {
                root: {
                    width: '64px',
                    height: '64px',
                    margin: '8px',
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fontSize: '30px',
                },
            },
        },
    },
});

const LongPressButton = (
    props: {
        ctl: CtrlFuncLP;
    } & ButtonProps,
) => {
    const { ctl, ...rest } = props;
    const lp = useLongPress(
        event => {
            event.preventDefault();
        },
        {
            onStart: ctl.start,
            onCancel: ctl.stop,
            onFinish: ctl.stop,
            threshold: 0,
        },
    )();
    return <Button {...rest} {...lp} />;
};

export const Control = memo(
    (
        props: IRemoterProps & {
            boxProps?: BoxProps;
        },
    ) => {
        const {
            control: ctl,
            speed,
            convertedSpeed,
            options,
        } = useControl({
            uri: props.control_uri,
            speed_min: 75,
            speed_max: 100,
            speed_steps: 5,
        });
        const dispatch = useAppDispatch();
        const showVideo = useAppSelector(
            state => state.remoter[props.id]?.showVideo,
        );
        return (
            <ThemeProvider theme={theme}>
                <Box
                    {...props.boxProps}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...props.boxProps?.sx,
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                        }}
                    >
                        <SpeedIndicator
                            realSpeed={convertedSpeed.left}
                            speed={speed.left}
                            options={options}
                            name={'L'}
                        />
                    </Box>
                    <Box display={'grid'}>
                        <Box>
                            <LongPressButton ctl={ctl.rotateLeft}>
                                <RotateLeft />
                            </LongPressButton>
                            <Button onClick={ctl.speedUp}>
                                <KeyboardArrowUp />
                            </Button>
                            <LongPressButton ctl={ctl.rotateRight}>
                                <RotateRight />
                            </LongPressButton>
                        </Box>
                        <Box>
                            <LongPressButton ctl={ctl.turnLeft}>
                                <KeyboardArrowLeft />
                            </LongPressButton>
                            <Button onClick={ctl.stop}>
                                <StopOutlined />
                            </Button>
                            <LongPressButton ctl={ctl.turnRight}>
                                <KeyboardArrowRight />
                            </LongPressButton>
                        </Box>
                        <Box>
                            <Button
                                onClick={() =>
                                    dispatch(
                                        RemoterViewActions.setShowExtendedInfo({
                                            id: props.id,
                                            value: true,
                                        }),
                                    )
                                }
                            >
                                <InfoOutlined />
                            </Button>
                            <Button onClick={ctl.speedDown}>
                                <KeyboardArrowDown />
                            </Button>
                            <Button
                                onClick={() =>
                                    dispatch(
                                        RemoterViewActions.setShowVideo({
                                            id: props.id,
                                            value: !showVideo,
                                        }),
                                    )
                                }
                                color={showVideo ? 'warning' : 'error'}
                            >
                                {showVideo ? <Visibility /> : <VisibilityOff />}
                            </Button>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            height: '100%',
                        }}
                    >
                        <SpeedIndicator
                            realSpeed={convertedSpeed.right}
                            speed={speed.right}
                            options={options}
                            name={'R'}
                        />
                    </Box>
                </Box>
            </ThemeProvider>
        );
    },
);
