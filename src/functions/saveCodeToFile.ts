import { v4 } from "uuid";
import { writeFileSync } from "fs";
import os from "os";
export default function SaveCodeToFile(code: string, extension: string) {
  const fileName = os.tmpdir() + "/" + v4() + "." + extension;
  writeFileSync(fileName, code, { encoding: "utf8" });
  return fileName;
}
