const PET_SNAKE_SNACKS_SHEET = 'Pet Snake Snacks';

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PET_SNAKE_SNACKS_SHEET);

  if (!sheet) {
    return jsonResponse({ error: 'Pet Snake Snacks sheet not found', events: [] });
  }

  const values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return jsonResponse({ events: [] });

  const headers = values.shift().map(header => header.trim());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const events = values
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => Object.fromEntries(headers.map((header, index) => [header, String(row[index] || '').trim()])))
    .filter(event => event.status.toLowerCase() === 'active')
    .filter(event => {
      if (!event.endDate) return true;
      const end = new Date(event.endDate + 'T23:59:59');
      return isNaN(end.getTime()) || end >= today;
    })
    .map(event => ({
      ...event,
      featured: ['true', 'yes', '1'].includes(event.featured.toLowerCase())
    }))
    .sort((a, b) => String(a.startDate).localeCompare(String(b.startDate)));

  return jsonResponse({ events });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
