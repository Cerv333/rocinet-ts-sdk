import "dotenv/config";
import {describe, it, expect} from "vitest";
import {Rocinet} from "../src/Rocinet";

describe("Rocinet", () => {
  const rocinet = new Rocinet(process.env.ROCINET_ACCESS_TOKEN, 10);

  it("load data items", async () => {
    let counter = 0;
    const since = new Date("2025-01-01T00:00:00Z");
    const till = new Date("2025-06-15T00:00:00Z");
    for await (const item of rocinet.getDataItems<object>("cerv-business-webtrh-used", since, till)) {
      expect(item.content).toBeTypeOf("object");
      counter++
    }

    expect(counter).toBe(22);
  })


});