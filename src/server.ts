import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import { app } from "./app.js";

const PORT: number = 3000;

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
