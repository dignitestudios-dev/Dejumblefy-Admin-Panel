import AppProgressProvider from "./progress-provider";
import ReduxProvider from "./redux-provider";
import QueryProvider from "./query-provider";
import AuthRehydrator from "./auth-rehydrator";
import SocketProvider from "./socket-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProgressProvider>
      <ReduxProvider>
        <QueryProvider>
          <AuthRehydrator>
            <SocketProvider>{children}</SocketProvider>
          </AuthRehydrator>
        </QueryProvider>
      </ReduxProvider>
    </AppProgressProvider>
  );
}
