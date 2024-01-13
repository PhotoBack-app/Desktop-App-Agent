import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { ipcLink } from "electron-trpc/renderer";
import superjson from "superjson";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppRouter } from "../electron/api";

const trpcReact = createTRPCReact<AppRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      links: [ipcLink()],
      transformer: superjson,
    })
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Debug />
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}

function Debug() {
  const selectLibrary = trpcReact.selectLibraryLocation.useMutation();
  const onPress = () => {
    console.log("selectLibrary");
    selectLibrary.mutate();
  };
  return (
    <div>
      <h2>Debug</h2>
      <button onClick={onPress}>Select Library</button>
      <br />
      {selectLibrary.status}
      <br />
      <pre>{JSON.stringify(selectLibrary.data, null, 2)}</pre>
      <br />
    </div>
  );
}

const domNode = document.getElementById("react-root");
if (!domNode) {
  throw new Error("No react root found");
}
const root = createRoot(domNode);
root.render(<App />);
