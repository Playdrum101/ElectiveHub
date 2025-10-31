"use client";

import { io as createClient, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getClientSocket(): Socket {
	if (!socket) {
		// Hitting the initializer route once ensures the server is up
		fetch("/api/socketio").catch(() => {});
		socket = createClient({ path: "/socket.io" });
	}
	return socket;
}
