import type { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	// @ts-ignore - Next.js attaches a Node server instance here in dev/Node runtimes
	const httpServer = res.socket.server;
	// @ts-ignore
	let io: IOServer | undefined = httpServer.io;

	if (!io) {
		io = new IOServer(httpServer, {
			path: "/socket.io",
			cors: {
				origin: "*",
			},
		});
		// @ts-ignore
		httpServer.io = io;
		// Expose globally so App Router handlers can emit
		(globalThis as any).io = io;

		io.on("connection", (socket) => {
			socket.emit("connected", { message: "Socket.IO connected" });
		});
	}

	res.status(200).end();
}
