"use client";

import { AuthProvider } from "../lib/context/auth-context.jsx";
import DialogProvider from "../components/ui/DynamicDialogModals.jsx";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <DialogProvider>{children}</DialogProvider>
    </AuthProvider>
  );
}
