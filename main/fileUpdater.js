const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

function markMessageSent(folderName, id) {
  try {
    const csvPath = path.join(
      __dirname,
      "..",
      "python",
      "csv-data",
      folderName,
      "members.csv"
    );

    const csvRaw = fs.readFileSync(csvPath, "utf-8");
    const records = parse(csvRaw, { columns: true, skip_empty_lines: true });

    let found = false;

    const updatedRecords = records.map((row) => {
      if (row.id === id.toString()) {
        console.log(`✅ Marking ID ${id} as message_sent=true`);
        row.message_sent = "true";
        found = true;
      }
      return row;
    });

    if (!found) {
      return { success: false, error: "ID not found" };
    }

    const updatedCSV = stringify(updatedRecords, { header: true });
    fs.writeFileSync(csvPath, updatedCSV, "utf-8");

    return { success: true, updated: id };
  } catch (err) {
    console.error("Error in markMessageSent:", err);
    return { success: false, error: err.message };
  }
}

function markMessageError(folderName, id) {
  try {
    const csvPath = path.join(
      __dirname,
      "..",
      "python",
      "csv-data",
      folderName,
      "members.csv"
    );

    const csvRaw = fs.readFileSync(csvPath, "utf-8");
    const records = parse(csvRaw, { columns: true, skip_empty_lines: true });

    let found = false;

    const updatedRecords = records.map((row) => {
      if (row.id === id.toString()) {
        console.log(`⚠️ Marking ID ${id} as message_sent=false with error`);
        row.message_sent = "false";
        found = true;
      }
      return row;
    });

    if (!found) {
      return { success: false, error: "ID not found" };
    }

    const updatedCSV = stringify(updatedRecords, { header: true });
    fs.writeFileSync(csvPath, updatedCSV, "utf-8");

    return { success: true, updated: id };
  } catch (err) {
    console.error("Error in markMessageError:", err);
    return { success: false, error: err.message };
  }
}

function incrementMessagesSent(folderName) {
  try {
    const infoPath = path.join(
      __dirname,
      "..",
      "python",
      "csv-data",
      folderName,
      "info.json"
    );
    const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));

    info.sent = (typeof info.sent === "number" ? info.sent : 0) + 1;

    fs.writeFileSync(infoPath, JSON.stringify(info, null, 2), "utf-8");

    return { success: true, newSentCount: info.sent };
  } catch (err) {
    console.error("Error in incrementMessagesSent:", err);
    return { success: false, error: err.message };
  }
}
function incrementErrorCount(folderName) {
  try {
    const infoPath = path.join(
      __dirname,
      "..",
      "python",
      "csv-data",
      folderName,
      "info.json"
    );
    const info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));

    info.error = (typeof info.error === "number" ? info.error : 0) + 1;

    fs.writeFileSync(infoPath, JSON.stringify(info, null, 2), "utf-8");

    return { success: true, newSentCount: info.sent };
  } catch (err) {
    console.error("Error in incrementMessagesSent:", err);
    return { success: false, error: err.message };
  }
}

module.exports = {
  markMessageSent,
  markMessageError,
  incrementMessagesSent,
  incrementErrorCount,
};
