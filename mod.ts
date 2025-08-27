// @ts-types='npm:@types/pg';
import { Client } from 'npm:pg'; 
import type { PoolConfig } from "npm:pg";
import ObjectWithStringKeys from "./ObjectWithStringKeys.ts";

async function executeSQLFromFile(absolutePathToSQLFile: string, config: PoolConfig) {
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

function recaseKeys<T>(objectWithSnakeCaseKeys: ObjectWithStringKeys<T>) {
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