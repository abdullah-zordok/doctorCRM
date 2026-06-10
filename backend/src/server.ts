import { env } from "./config/env";
import { app } from "./app";

app.listen(env.PORT, () => {
  console.log(`Backend listening on port ${env.PORT}`);
});
