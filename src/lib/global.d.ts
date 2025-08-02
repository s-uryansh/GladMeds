declare global {
  namespace globalThis {
    var mongoose: {
      conn: typeof import('mongoose') | null;
      promise: Promise<typeof import('mongoose')> | null;
    };
  }
}
