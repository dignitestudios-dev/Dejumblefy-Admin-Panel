"use client";

import React from "react";
import { ProgressProvider } from "@bprogress/next/app";

export default function AppProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="3px"
      color="#FB7C20"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
}
