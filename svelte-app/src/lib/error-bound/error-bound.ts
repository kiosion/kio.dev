import Component from './error-bound.svelte';
import { createErrorBoundary } from './create-error-bound';

export default createErrorBoundary(Component);
