// Copyright (c) 2025 Ariel Mutebi

// @ts-types="npm:@types/pg@^8.15.5";
import { Client } from "npm:pg@^8.16.3"; 
import type { PoolConfig, QueryResult } from "npm:pg@^8.16.3";
import type ObjectWithStringKeys from "./ObjectWithStringKeys.ts";

/**
 * Executes SQL code from a file using a PostgreSQL client.
 *
 * @async
 * @param {string} absolutePathToSQLFile - The absolute path to the SQL file to execute.
 * @param {PoolConfig} config - The configuration object for the PostgreSQL client.
 * @returns {Promise<QueryResult<ObjectWithStringKeys<any>> | undefined>} 
 *   A promise that resolves with the query result if successful, or `undefined` if an error occurs.
 *
 * @example
 * ```ts
 * import { executeSQLFromFile } from "jsr:@ariel/database-chores";
 *
 * const result = await executeSQLFromFile(
 *   join(import.meta.dirname!, "example.sql"),
 *   { connectionString: Deno.env.get("PG_CONNECTION_STRING") }
 * );
 * console.log(result?.rows);
 * ```
 */

// deno-lint-ignore no-explicit-any
export async function executeSQLFromFile(absolutePathToSQLFile: string, config: PoolConfig): Promise<QueryResult<ObjectWithStringKeys<any>> | undefined> {
  try{
    console.log("Reading from SQL file...");
    const sql = await Deno.readTextFile(absolutePathToSQLFile);
    console.log("Done.")

    console.log("Executing SQL through client...");
    const client = new Client(config);
    await client.connect();
    const result = await client.query(sql);
    await client.end();
    console.log("Done.")
    return result;
  } catch(error) {
    console.error(error);
  }
};

function snakeCaseToCamelCase(snakeCaseString: string) {
  const splitUpString = snakeCaseString.split("_");
  const splitUpCamelCase = splitUpString.map((substring, index) => index > 0 ? substring.slice(0, 1).toLocaleUpperCase() + substring.slice(1) : substring);
  const joinedCamelCase = splitUpCamelCase.join("");
  return joinedCamelCase;
};

/**
 * Converts all keys of an object from `snake_case` to `camelCase`.
 *
 * @template T
 * @param {ObjectWithStringKeys<T>} objectWithSnakeCaseKeys - The object whose keys are in snake_case.
 * @returns {ObjectWithStringKeys<T>} A new object with all keys converted to camelCase.
 *
 * @example
 * ```ts
 * const snakeObj = { first_name: "Alice", last_name: "Smith" };
 * const camelObj = recaseKeys(snakeObj);
 * console.log(camelObj); // { firstName: "Alice", lastName: "Smith" }
 * ```
 */
export function recaseKeys<T>(objectWithSnakeCaseKeys: ObjectWithStringKeys<T>): ObjectWithStringKeys<T> {
  const objectWithCamelCaseKeys: ObjectWithStringKeys<T> = {};
  for (const key of Object.keys(objectWithSnakeCaseKeys)) {
    if(key.includes("_")) {
      objectWithCamelCaseKeys[snakeCaseToCamelCase(key)] = objectWithSnakeCaseKeys[key];
    } else {
      objectWithCamelCaseKeys[key] = objectWithSnakeCaseKeys[key];
    };
  };
  return objectWithCamelCaseKeys;
};