import app from "./app";
import { port } from "./utils/constants";

const PORT = port;
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
