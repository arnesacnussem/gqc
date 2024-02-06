import './App.css';
import { Box } from '@mui/material';
import { Remoter } from './components/remoter/remoter.tsx';
import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

function App() {
    const { search } = useLocation();
    const ip = useMemo(() => new URLSearchParams(search).get('ip'), [search]);
    if (ip) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'start',
                    m: 2,
                }}
            >
                <Remoter
                    id={ip}
                    stream_uri={`http://${ip}:81`}
                    control_uri={`http://${ip}/car`}
                />
            </Box>
        );
    }
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'start',
                m: 2,
            }}
        >
            <Remoter
                id={'192.168.4.1'}
                stream_uri={'http://192.168.4.1:81'}
                control_uri={'http://192.168.4.1/car'}
            />
        </Box>
    );
}

export default App;
