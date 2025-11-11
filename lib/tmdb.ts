import assert from "assert";
import { TMDB } from "tmdb-ts";

assert(process.env.TMDB_ACCESS_TOKEN, "Missing TMDB_ACCESS_TOKEN in .env");

export default new TMDB(process.env.TMDB_ACCESS_TOKEN);
