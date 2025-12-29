# Wedding Invitation - Ivana & Vladyslav

This project is the digital wedding invitation for Ivana & Vladyslav, to be celebrated on September 26, 2026, at Mesón San Vicente.

## Features

- **Responsive Design:** Adapted for mobile and desktop devices.
- **Theme:** Romantic style with cherry blossom (Sakura) decoration.
- **RSVP Form:**
  - Attendance confirmation.
  - Plus one option (+1).
  - Children counter.
- **Integration:**
  - Data submission to Google Sheets (configured in `script.js`).
  - Rich preview for WhatsApp (Open Graph).

## Technologies Used

- HTML5
- CSS3 (CSS Variables, Flexbox)
- JavaScript (Vanilla)
- Google Fonts (Cinzel, Great Vibes, Lato)
- Material Icons

## How to View Locally

Simply open the `index.html` file in your favorite web browser.

For a better experience (and to avoid CORS restrictions with some browsers), it is recommended to use a simple local server. If you have Python installed:

```bash
# Python 3
python -m http.server
```

Then open `http://localhost:8000` in your browser.

## Deployment

This project is configured to be deployed on **GitHub Pages**.

1. Ensure the files are on the main branch (or the one configured for Pages).
2. Go to the repository settings on GitHub -> Pages.
3. Select the branch and the root folder (`/`).
4. Done! Your invitation will be online.
