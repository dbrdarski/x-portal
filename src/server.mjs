import http from "http";
import serve from "./server.app.mjs";

import vhost from "vhost";
import connect from "connect";

import { port, serverEnv } from "../env.mjs";

const app = connect();

const [_, __, ...params] = process.argv;

console.log("PARAMS", params);

if (params.length) {
  // const [command] = params;
  // switch (command) {
  //   case "generate:images": {
  //     console.log("GENERATE SCRIPT");
  //     console.log("===============");
  //     generateImages(albums, imageSizes);
  //     break;
  //   }
  // }
} else {
  const video = await serve();
  app.use(vhost(serverEnv.host, video));
  http.createServer(app).listen(port);
}
