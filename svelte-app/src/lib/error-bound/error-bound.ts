declare module './error-bound.svelte';
import Component from './error-bound.svelte';
import { createErrorBoundary } from './create-error-bound';

// @ts-expect-error Bit of a hack
export default createErrorBoundary(Component); // eslint-disable-line @typescript-eslint/no-unsafe-argument
