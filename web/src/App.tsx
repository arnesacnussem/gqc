import './App.css';
import { Box } from '@mui/material';
import { Remoter } from './components/remoter/remoter.tsx';

function App() {
    return (
        <>
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
        </>
    );
}

export default App;
