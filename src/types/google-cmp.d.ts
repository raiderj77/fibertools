interface GoogleTcData {
  listenerId?: number;
  gdprApplies?: boolean;
  eventStatus?: string;
  purpose?: {
    consents?: Record<number, boolean>;
  };
}

interface GoogleTcfApi {
  (
    command: "addEventListener",
    version: number,
    callback: (tcData: GoogleTcData | null, success: boolean) => void,
  ): void;
  (
    command: "removeEventListener",
    version: number,
    callback: (success: boolean) => void,
    listenerId: number,
  ): void;
}

type GoogleFcCallback =
  | (() => void)
  | {
      CONSENT_API_READY: () => void;
    };

interface GoogleFcApi {
  callbackQueue?: GoogleFcCallback[];
  showRevocationMessage?: () => void;
}

interface Window {
  __tcfapi?: GoogleTcfApi;
  googlefc?: GoogleFcApi;
}
