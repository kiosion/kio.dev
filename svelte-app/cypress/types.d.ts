import type { CyHttpMessages } from 'cypress/types/net-stubbing';

export interface DocumentsSetupParams {
  delay?: number;
  num?: number;
  many?: boolean;
}

export interface ReturnDocumentsParams {
  req: CyHttpMessages.IncomingHttpRequest;
  delay: number;
  num?: number;
}

export interface AboutSetupParams {
  url?: string;
  delay?: number;
  content?: boolean;
}
