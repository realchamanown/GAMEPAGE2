/*
 * Game data for the store mockup.
 * Edit this file to change the gallery, tags and requirements without touching the page code.
 * To swap a placeholder image, replace the file in assets/ (keep the same name) or change the path here.
 */
window.GAME = {
  title: "Split It Out",

  // Gallery: first item can be a trailer (type "video" shows a play badge; no video file yet).
  media: [
    { type: "video", src: "assets/key 2.png", label: "Trailer slot (placeholder: no trailer produced yet)" },
    { type: "image", src: "assets/screenshots/Screenshot 2026-09-26 214136.png", label: "The Coral Ghetto (placeholder)" },
    { type: "image", src: "assets/screenshots/Screenshot 2026-09-26 233045.png", label: "Sand-spit combat (placeholder)" },
    { type: "image", src: "assets/screenshots/Screenshot 2026-09-27 150203.png", label: "Sorting station (placeholder)" },
    { type: "image", src: "assets/screenshots/Screenshot 2026-09-27 150350.png", label: "Upgrade vending machine (placeholder)" },
    { type: "image", src: "assets/screenshots/ss_05.jpg", label: "Co-op escape (placeholder)" },
    { type: "image", src: "assets/screenshots/ss_06.jpg", label: "Don Hermit, concept (placeholder)" }
  ],

  // Tags shown in the summary panel. planned: true marks features that are not built yet.
  tags: [
    { name: "Indie" }, { name: "Online Co-op" }, { name: "Action Roguelike" },
    { name: "Underwater" }, { name: "Adventure" }, { name: "Cute" },
    { name: "Exploration" }, { name: "Low Poly" }, { name: "3D" },
    { name: "Progression", planned: true }
  ],

  // System requirements. "TBD" values are rendered as placeholders.
  sysreq: {
    minimum: [
      ["OS", "Windows 10/11 64-bit"], ["Processor", "TBD"], ["Memory", "TBD"],
      ["Graphics", "TBD"], ["DirectX", "TBD"], ["Network", "Broadband Internet connection"],
      ["Storage", "TBD"]
    ],
    recommended: [
      ["OS", "Windows 10/11 64-bit"], ["Processor", "TBD"], ["Memory", "TBD"],
      ["Graphics", "TBD"], ["DirectX", "TBD"], ["Network", "Broadband Internet connection"],
      ["Storage", "TBD"]
    ]
  }
};
