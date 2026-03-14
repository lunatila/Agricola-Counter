import { Dimensions } from 'react-native';

/** Baseline width in dp — Samsung Tab S9 portrait. Increase to make phone elements larger; decrease to make them smaller. */
export const BASE_WIDTH = 600;

/** Pre-computed scale factor at bundle load time. react-native guarantees Dimensions is ready before any JS runs. */
const _factor = Dimensions.get('window').width / BASE_WIDTH;

/**
 * Scale a pixel value proportionally to the current screen width.
 * On the baseline tablet (800 dp) the value is unchanged.
 * On smaller screens (e.g. phones) it scales down proportionally.
 */
export const s = (size: number): number => Math.round(size * _factor);
