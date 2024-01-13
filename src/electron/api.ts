import { initTRPC } from "@trpc/server";
import { EventEmitter } from "events";
import superjson from "superjson";
import { selectLibraryLocationDialog } from "./library";

const ee = new EventEmitter();

const t = initTRPC.create({ isServer: true, transformer: superjson });

export const router = t.router({
  selectLibraryLocation: t.procedure.mutation(async (opts) => {
    try {
      console.log("Attempting to select library location");
      const result = selectLibraryLocationDialog();
      return result;
    } catch (e) {
      return { error: e };
    }
  }),
});

export type AppRouter = typeof router;
