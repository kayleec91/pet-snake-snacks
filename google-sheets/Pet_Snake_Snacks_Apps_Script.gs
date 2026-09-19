/* Add this constant with the other sheet constants. */
const SHEET_PET_SNAKE_SNACKS = "Pet Snake Snacks";

/*
Add this block inside the existing doGet(e), after the events action:

if (action === "petSnakeSnacksEvents") {
  return jsonResponse(getPetSnakeSnacksEvents());
}
*/

/* Add this function anywhere outside doGet(e). */
function getPetSnakeSnacksEvents() {
  const sheet = getSheet(SHEET_PET_SNAKE_SNACKS);
  const rows = getRows(sheet);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return rows
    .filter(row =>
      String(row.status || "")
        .trim()
        .toLowerCase() === "active"
    )
    .map(row => {
      const startDate = String(row.startDate || "").trim();
      const endDate = String(row.endDate || startDate).trim();
      const featuredText = String(row.featured || "").trim().toLowerCase();

      return {
        id: String(row.id || "").trim(),
        name: String(row.name || "Reptile Expo").trim(),
        city: String(row.city || "").trim(),
        state: String(row.state || "").trim(),
        startDate: startDate,
        endDate: endDate,
        venue: String(row.venue || "").trim(),
        address: String(row.address || "").trim(),
        ticketLink: String(row.ticketLink || "").trim(),
        status: "active",
        featured: row.featured === true || ["true", "yes", "1"].includes(featuredText)
      };
    })
    .filter(event => event.startDate && event.endDate)
    .filter(event => {
      const endDate = parseSheetDate(event.endDate);
      if (!endDate) return false;
      endDate.setHours(23, 59, 59, 999);
      return endDate >= today;
    })
    .sort((a, b) =>
      parseSheetDate(a.startDate) - parseSheetDate(b.startDate)
    );
}
