import { IRemoterProps } from './remoter.tsx';
import { Dialog, DialogContent, Typography } from '@mui/material';

export const BasicInfo = (props: IRemoterProps) => {
    return (
        <div>
            <div>{props.id}</div>
        </div>
    );
};

export const ExtendedInfo = (
    props: IRemoterProps & {
        open?: boolean;
        onClose: () => void;
    },
) => {
    return (
        <Dialog open={props.open || false} onClose={props.onClose}>
            <DialogContent>
                <Typography>id: {props.id}</Typography>
                <Typography>stream_uri: {props.stream_uri}</Typography>
                <Typography>control_uri: {props.control_uri}</Typography>
            </DialogContent>
        </Dialog>
    );
};
