// Copyright (c) 2025 Ariel Mutebi :)

// @ts-types="npm:@types/pg@^8.15.5";
import { Client } from "npm:pg@^8.16.3"; 
import type { PoolConfig, QueryResult } from "npm:pg@^8.16.3";
import type ObjectWithStringKeys from "./ObjectWithStringKeys.ts";

// deno-lint-ignore no-explicit-any
async function executeSQLFromFile(absolutePathToSQLFile: string, config: PoolConfig): Promise<QueryResult<ObjectWithStringKeys<any>> | undefined> {
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

function recaseKeys<T>(objectWithSnakeCaseKeys: ObjectWithStringKeys<T>): ObjectWithStringKeys<T> {
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

export { executeSQLFromFile, recaseKeys };