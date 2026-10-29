# DigiBlue: Water in the Moroccan Countryside

An interactive scroll story about rural water access in the Moroccan countryside, built for the [DigiBlue](https://bonolab.com/digiblue/) initiative by BonoLab.

The story follows real experiences from my grandparents' village, where some families still travel by donkey to collect fresh water. It connects daily life there to where the water comes from and how drought and climate change affect it.

Created by Mohammed Zaouk.

## Status

In progress. Planned submission: early November 2026.

## Features

- Scroll-driven storytelling with background color shifts (dry sand to water blue)
- Photos and short videos with subtitles
- Languages: English, with Arabic and French planned (including right-to-left layout)
- Mobile-first, with reduced-motion support

## Tech stack

- React, TypeScript and Vite
- React Router
- GSAP with ScrollTrigger
- Plain CSS, one file per component
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/   Header, Footer and shared pieces
  pages/        Story page
  content/      Text for each language (JSON)
  context/      App-wide state such as the selected language
  styles/       Global styles and color variables
  assets/       Images and videos bundled by Vite
public/
  favicon/      Favicons
  media/        Photos, videos and subtitles (.vtt)
```

## Content and sources

Text, image paths and video paths live in `src/content/` so the media can be swapped without changing code. Sources for facts and statistics, and credits for any third-party material, are listed at the end of the story.

All photos and videos of the village are my own. Location data is removed from images before publishing, and people appearing on camera have given their permission.

## Credits

- Initiative: [DigiBlue](https://bonolab.com/digiblue/) by [BonoLab](https://bonolab.com/)
- Story, development and filming: Mohammed Zaouk

## License

All rights reserved for the story content (text, photos and videos). Code is shared for reference only until a license is added.