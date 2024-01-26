import { useCallback, useEffect, useMemo, useState } from 'react';

export interface ControlOptions {
    uri: string;

    speed_min: number;
    speed_max: number;
    speed_steps: number;
}

interface SpeedState {
    left: number;
    right: number;
    previousStopped?: boolean;
}

export type CtrlFunc = () => void;
export type CtrlFuncLP = {
    start: CtrlFunc;
    stop: CtrlFunc;
};

const isStopped = (speed: SpeedState) => speed.left === 0 && speed.right === 0;

export const useControl = (options: ControlOptions) => {
    const [speed, setSpeed] = useState<SpeedState>({
        left: 0,
        right: 0,
        previousStopped: true,
    });
    const api = useMemo(() => ControlApi(options.uri), [options.uri]);
    const mutate = useMemo(
        () => ({
            increase: (prev: number) =>
                prev >= options.speed_steps ? prev : prev + 1,
            decrease: (prev: number) =>
                prev <= -options.speed_steps ? prev : prev - 1,
            invert: (prev: number) => -prev,
        }),
        [options.speed_steps],
    );

    const control = useMemo(
        (): {
            speedUp: CtrlFunc;
            speedDown: CtrlFunc;
            turnLeft: CtrlFuncLP;
            turnRight: CtrlFuncLP;
            rotateLeft: CtrlFuncLP;
            rotateRight: CtrlFuncLP;
            stop: CtrlFunc;
        } => ({
            speedUp: () => {
                setSpeed(prev => ({
                    left: mutate.increase(prev.left),
                    right: mutate.increase(prev.right),
                }));
            },
            speedDown: () => {
                setSpeed(prev => ({
                    left: mutate.decrease(prev.left),
                    right: mutate.decrease(prev.right),
                }));
            },
            stop: () => {
                setSpeed({
                    left: 0,
                    right: 0,
                });
            },
            turnLeft: {
                start: () =>
                    setSpeed(prev => ({
                        ...prev,
                        left: mutate.decrease(prev.left),
                    })),
                stop: () =>
                    setSpeed(prev => ({
                        ...prev,
                        left: mutate.increase(prev.left),
                    })),
            },
            turnRight: {
                start: () =>
                    setSpeed(prev => ({
                        ...prev,
                        right: mutate.decrease(prev.right),
                    })),
                stop: () =>
                    setSpeed(prev => ({
                        ...prev,
                        right: mutate.increase(prev.right),
                    })),
            },
            rotateLeft: {
                start: () =>
                    setSpeed(prev => {
                        if (isStopped(prev)) {
                            return {
                                previousStopped: true,
                                left: mutate.decrease(prev.left),
                                right: mutate.increase(prev.right),
                            };
                        }
                        return {
                            ...prev,
                            left: mutate.invert(prev.left),
                        };
                    }),
                stop: () => {
                    setSpeed(prev => {
                        if (prev.previousStopped) {
                            return {
                                previousStopped: true,
                                left: mutate.increase(prev.left),
                                right: mutate.decrease(prev.right),
                            };
                        }
                        return {
                            ...prev,
                            left: mutate.invert(prev.left),
                        };
                    });
                },
            },
            rotateRight: {
                start: () =>
                    setSpeed(prev => {
                        if (isStopped(prev)) {
                            return {
                                previousStopped: true,
                                left: mutate.increase(prev.left),
                                right: mutate.decrease(prev.right),
                            };
                        }
                        return {
                            ...prev,
                            right: mutate.invert(prev.right),
                        };
                    }),
                stop: () =>
                    setSpeed(prev => {
                        if (prev.previousStopped) {
                            return {
                                previousStopped: true,
                                left: mutate.decrease(prev.left),
                                right: mutate.increase(prev.right),
                            };
                        }
                        return {
                            ...prev,
                            right: mutate.invert(prev.right),
                        };
                    }),
            },
        }),
        [mutate],
    );

    const convSpeed = useCallback(
        (speed: number) => {
            const step = Math.ceil(
                (options.speed_max - options.speed_min) /
                    (options.speed_steps - 1),
            );
            const regularize = (v: number) => {
                if (v > options.speed_max) return options.speed_max;
                if (v < -options.speed_max) return -options.speed_max;
                if (v > 0 && v < options.speed_min) return 0;
                if (v < 0 && v > -options.speed_min) return 0;
                return v;
            };
            const conv = () => {
                if (speed === 0) return 0;
                const rSpeed = options.speed_min + (Math.abs(speed) - 1) * step;
                return speed > 0 ? rSpeed : -rSpeed;
            };
            return regularize(conv());
        },
        [options.speed_max, options.speed_min, options.speed_steps],
    );

    const realSpeed = useMemo((): SpeedState => {
        return {
            left: convSpeed(speed.left),
            right: convSpeed(speed.right),
        };
    }, [convSpeed, speed.left, speed.right]);

    useEffect(() => {
        api.set(realSpeed).then(() => {
            console.log('speed change', speed);
        });
    }, [api, realSpeed, speed]);

    return { control, speed, options, convertedSpeed: realSpeed };
};

const ControlApi = (uri: string) => ({
    stop() {
        return fetch(`${uri}?left=0&right=0`);
    },
    set(speed: SpeedState) {
        return fetch(`${uri}?left=${speed.left}&right=${speed.right}`);
    },
});
