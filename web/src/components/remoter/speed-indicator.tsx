import {
    Box,
    createTheme,
    Slider,
    ThemeProvider,
    Typography,
} from '@mui/material';
import { ControlOptions } from './car-ifce.ts';

const theme = createTheme({
    components: {
        MuiSlider: {
            styleOverrides: {
                thumb: {
                    display: 'none',
                },
            },
        },
    },
});

export const SpeedIndicator = (props: {
    speed: number;
    realSpeed: number;
    name?: string;
    options: ControlOptions;
}) => {
    const { speed, name, realSpeed, options } = props;
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'default',
                }}
            >
                <Slider
                    value={[0, speed]}
                    orientation={'vertical'}
                    min={-options.speed_steps}
                    max={options.speed_steps}
                    step={1}
                    marks
                    sx={{
                        mt: 2,
                        cursor: 'default',
                    }}
                />

                <Box mt={1}>
                    <Typography variant={'subtitle2'}>{realSpeed}</Typography>
                    {name && <Typography>{name}</Typography>}
                </Box>
            </Box>
        </ThemeProvider>
    );
};
