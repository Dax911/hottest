import { appRouter } from "@backend/router"
import * as trpcNext from "@trpc/server/adapters/next"

export default trpcNext.createsNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
