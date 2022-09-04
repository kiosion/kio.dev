interface DefaultGatingOptions {
  timeFrame: number;
  reqsPerTimeFrame: number;
  removeVisitsAfter: number;
  dropConnections: boolean;
}

// type VisitsMap = Record<string, DefaultGatingOptions & { lastReq: number }>;
interface VisitsMap {
  [identifier: string]: DefaultGatingOptions & {
    timeFrameStart: number;
    lastReq: number;
    reqs: number;
  };
}

const visits = {} as VisitsMap;
const defaults: DefaultGatingOptions = {
  timeFrame: 1,
  reqsPerTimeFrame: 3,
  removeVisitsAfter: 30,
  dropConnections: false
};

const gateRequest = (identifier: string, options = defaults): boolean => {
  if (!identifier) {
    return false;
  }

  const client = visits?.[identifier];
  const now = Date.now();

  if (!client) {
    visits[identifier] = Object.assign(
      {
        timeFrameStart: now,
        lastReq: now,
        reqs: 1
      },
      options
    );
    return false;
  }

  if (
    Math.ceil(now - client.timeFrameStart) >=
    client.timeFrame * (1000 * 60)
  ) {
    client.timeFrameStart = now;
    client.reqs = 1;
  } else if (client.reqs >= client.reqsPerTimeFrame) {
    return true;
  } else {
    client.reqs += 1;
  }

  client.lastReq = now;
  return false;
};

export { gateRequest };
