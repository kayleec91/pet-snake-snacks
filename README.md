# Pet Snake Snacks website

This is a complete React and Vite website prepared for GitHub and Vercel. It includes:

* A feeder menu based on the supplied 2026 menu, with all prices removed
* Live and frozen availability plus age, weight, and length guidance
* Mice, rats, rabbits, guinea pigs, chicks, and quail
* A Google Sheets powered expo schedule
* A text only call to action for large live feeder preorders
* Irving shop pickup by request for orders over $30
* The official Pet Snake Snacks Facebook link
* No checkout, online payments, order form, or shipping offer
* Mobile friendly styling

The public phone number is **(469) 300-0685** and the site marks text as preferred.

The family story features Otis and Meleah using the cleaned expo photograph in `public/otis-meleah-expo.webp`.

## 1. Preview the website on your computer

Install Node.js 20 or newer. Open a terminal in this folder and run:

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local address shown in the terminal. The schedule will display a setup message until the Google Apps Script URL is added.

## 2. Add the Pet Snake Snacks tab to the existing Lone Star spreadsheet

1. Open the Google Sheet currently used for Lone Star expo data.
2. Add a new tab named exactly `Pet Snake Snacks`.
3. Open `google-sheets/Pet_Snake_Snacks_Tab.csv` from this project.
4. Copy its first row into row 1 of the new tab.
5. Delete the sample row or keep its status set to `hidden`.
6. Enter one show per row.

Use these columns exactly:

| Column | What to enter |
| --- | --- |
| id | A unique short ID such as `arlington-2026-12` |
| name | Public event name |
| city | City |
| state | Usually `TX` |
| startDate | `YYYY-MM-DD` |
| endDate | `YYYY-MM-DD` |
| venue | Venue name |
| address | Full address used for the map link |
| ticketLink | Optional organizer or event page |
| status | Use `active` to show it or `hidden` to hide it |
| featured | `TRUE` or `FALSE` |

Past shows automatically disappear after their `endDate`.

## 3. Add the Google Apps Script

The existing Lone Star spreadsheet may already have an Apps Script deployment. The safest setup is to add this website's read only schedule code to that same script project.

1. In the Google Sheet, choose **Extensions**, then **Apps Script**.
2. Add a new script file named `PetSnakeSnacks`.
3. Open `google-sheets/Pet_Snake_Snacks_Apps_Script.gs` in this project.
4. Copy its contents into the new script file.
5. If the existing script already has a `doGet()` function, do not keep two functions with the same name. Rename this file's `doGet()` to `getPetSnakeSnacksEvents()` and route the existing `doGet(e)` to it, or use a separate Apps Script project for this tab.
6. Choose **Deploy**, then **New deployment**.
7. Select **Web app**.
8. Execute as yourself and allow access to anyone.
9. Deploy and copy the URL ending in `/exec`.

The website only reads public event information. It does not write to the spreadsheet.

## 4. Create the GitHub repository

1. Sign in to GitHub and create a new empty repository named `pet-snake-snacks`.
2. Do not add a README, license, or gitignore on GitHub because this folder already contains them.
3. Run the following commands from this project folder, replacing `YOUR-USERNAME`:

```bash
git init
git add .
git commit -m "Create Pet Snake Snacks website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/pet-snake-snacks.git
git push -u origin main
```

## 5. Deploy through Vercel

1. Sign in to Vercel.
2. Choose **Add New**, then **Project**.
3. Import the new `pet-snake-snacks` GitHub repository.
4. Vercel should detect Vite automatically.
5. Confirm the build command is `npm run build` and the output directory is `dist`.
6. Add an environment variable:
   * Name: `VITE_GOOGLE_APPS_SCRIPT_URL`
   * Value: the Google Apps Script `/exec` URL
7. Deploy.

Every future push to the `main` branch will automatically update the website.

## 6. Connect a custom domain later

In Vercel, open the project and choose **Settings**, then **Domains**. Add the domain and follow Vercel's DNS instructions. Keep the default Vercel address active until the custom domain is verified.

## Updating the website

For schedule changes, edit only the `Pet Snake Snacks` Google Sheet tab. No GitHub update is needed.

For wording, menu, phone number, or design changes, edit the files in `src`, commit the changes, and push them to GitHub. Vercel will redeploy automatically.

## Suggested improvements included

* The ordering form was removed so the site cannot collect orders or payments.
* Preorders are limited to a clear text option for large live orders.
* Shipping language was replaced with expo pickup language.
* Prices were removed while useful feeder sizing information was retained.
* The schedule has helpful empty and error states so the page still looks complete if the sheet is temporarily unavailable.
* Each address opens in Google Maps instead of taking up the page with an embedded map.

Before publishing, review the family story wording and confirm whether individual owner names should appear. The current version uses general family wording so it does not publish an unconfirmed name.
