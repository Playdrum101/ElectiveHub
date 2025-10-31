"use client";

import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";

export default function TestConnection() {
  const [status, setStatus] = useState("Testing...");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const result = await fetch("/api/test-connection");
      const data = await result.json();
      setStatus(data.message || "Connected!");
    } catch (error) {
      setStatus("Connection failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}

