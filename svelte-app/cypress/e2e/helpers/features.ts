export const setFeature = (flag: string, value: boolean) => {
  cy.window().then((win) => {
    let existing: [string, { value: boolean; updated: string }][] = [];

    try {
      existing = JSON.parse(
        atob(win.localStorage.getItem('featureFlags') || '')
      ) as [string, { value: boolean; updated: string }][];
    } catch (_e) {
      // do nothing
    }

    const existingIndex = existing.findIndex(([key]) => key === flag);
    if (existingIndex > -1) {
      existing[existingIndex] = [
        flag,
        { value, updated: Math.floor(Date.now() / 1000).toString() }
      ];
    } else {
      existing.push([
        flag,
        { value, updated: Math.floor(Date.now() / 1000).toString() }
      ]);
    }
    win.localStorage.setItem('featureFlags', btoa(JSON.stringify(existing)));
  });
};
