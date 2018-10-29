const { generateDueDate } = require("./utils");

describe("utils", () => {
  describe("generateDueDate", () => {
    it("should return the 7th of the following month", () => {
      expect(generateDueDate("2018-10-01T00:00:00.000Z")).toBe(
        "2018-11-07T00:00:00.000Z"
      );
    });

    it("should handle the end of the year", () => {
      expect(generateDueDate("2018-12-01T00:00:00.000Z")).toBe(
        "2019-01-07T00:00:00.000Z"
      );
    });
  });
});
