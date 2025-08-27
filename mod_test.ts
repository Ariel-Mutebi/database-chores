import { assertEquals } from "@std/assert";
import { executeSQLFromFile, recaseKeys } from "./mod.ts";
import { join } from "jsr:@std/path";
import { QueryResult } from "npm:pg";
import ObjectWithStringKeys from "./ObjectWithStringKeys.ts";
import 'jsr:@std/dotenv/load';

Deno.test("executeSQLFromFile", async() => {
  const result = await executeSQLFromFile(
    join(import.meta.dirname!, "example.sql"),
    { connectionString: Deno.env.get("PG_CONNECTION_STRING") }
  ) as QueryResult<ObjectWithStringKeys<string>>[] | undefined;

  if(!result) throw new Error("Return value of executeSQLFromFile is undefined.");
  assertEquals(recaseKeys(result[2].rows[0]).songName, "Jimmy Cooks");
});

Deno.test("recaseKeys", () => {
  const objectWithSnakeCaseKeys = {
    money: 0,
    very_particular_set_of_skills: []
  };
  const objectWithCamelCaseKeys = {
    money: 0,
    veryParticularSetOfSkills: []
  };
  assertEquals(recaseKeys(objectWithSnakeCaseKeys), objectWithCamelCaseKeys);
});