import assert from 'assert';
import { TMDB } from 'tmdb-ts';

assert(process.env.TMDB_ACCESS_TOKEN, 'Missing TMDB_ACCESS_TOKEN in .env');

const tmdb = new TMDB(process.env.TMDB_ACCESS_TOKEN);

export { tmdb };
export type * from 'tmdb-ts';
