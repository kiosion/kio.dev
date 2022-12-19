export const setFeature = (flag: string, value: boolean) => {
  cy.window().then((win) => {
    let existing: [string, boolean][] = [];

    try {
      existing = JSON.parse(
        atob(win.localStorage.getItem('featureFlags') || '')
      ) as [string, boolean][];
    } catch (_e) {
      // do nothing
    }

    const existingIndex = existing.findIndex(([key]) => key === flag);
    if (existingIndex > -1) {
      existing[existingIndex] = [flag, value];
    } else {
      existing.push([flag, value]);
    }
    win.localStorage.setItem('featureFlags', btoa(JSON.stringify(existing)));
  });
};
