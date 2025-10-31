import type { Server as IOServer } from "socket.io";

export function getIO(): IOServer | null {
	return ((globalThis as any).io as IOServer | undefined) ?? null;
}
