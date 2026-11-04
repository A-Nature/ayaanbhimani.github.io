/*
  data.js
  ---------------------------------------------------------------------------
  Single source of truth for all content on the site: projects, experience,
  skills, and social links. The layout/render code in main.js reads
  from these arrays/objects, so adding a new project or job means editing
  ONLY this file, no HTML or layout changes required.

  Media slots:
    Each project and experience entry has a `media` array of
    { type, src, alt } objects (type is "image" or "video") describing where
    images/videos go. Drop files into /images/projects or /images/experience
    and set `src`. An entry with no src set (or an empty array) renders
    nothing at all (no placeholder box). More than one item with a src set
    renders as a small thumbnail strip; clicking any image/video opens the
    shared lightbox viewer (js/lightbox.js), with arrow-key/button
    navigation across that entry's media.

  Downloads:
    Each project and experience entry also has a `downloads` array for
    attachable files: source code, packaged builds (.jar, .zip), PDFs, a
    marketing portfolio, whatever. Drop files into /files/projects or
    /files/experience and add a { label, path } entry. An empty array
    renders nothing, so it's safe to leave as [] until you have something
    to attach.
*/

const SITE_DATA = {

  hero: {
    name: "Ayaan Bhimani",
    subtitle: "Software Engineering Student, University of Waterloo",
    location: "Waterloo, Ontario, Canada"
  },

  about: {
    // Catalogue records, in the order they happened. `era` is the short label
    // on each card; `text` is Ayaan's own wording.
    records: [
      {
        era: "Intro",
        text: "I've been coding since grade 5, when I discovered Scratch and started making little games just to see if I could. It turned out I loved it, and I haven't really stopped since."
      },
      {
        era: "Growing",
        text: "Once I'd outgrown Scratch, I moved on to text-based languages and got hooked on how much more control they gave me. I started modding games I loved, which taught me how to read other people's code and bend it to my own ideas. By high school I was building complete games, in class and on my own time. Somewhere along the way I decided I wanted to study Software Engineering."
      },
      {
        era: "Modern",
        text: "These days I take on larger projects across games, systems and hardware, and I teach myself whatever each one needs, whether that's networking, a new engine or a microcontroller. Every project teaches me something I didn't expect, and I like sticking with a problem until I understand why it works. I love figuring out how things work and building them from the ground up."
      },
      {
        era: "Future",
        text: "I'm now at my dream school, the University of Waterloo, for Software Engineering, and I'm looking for co-op roles, currently for summer 2027. Here I'm learning how real software gets built, working on projects with other people, and building things of my own on the side. I want to keep growing as an engineer, take on bigger problems, and learn from the people I work with."
      }
    ],

    // Photos of Ayaan, laid on the desk beside the records and aged by CSS.
    //   record   which record (0 = first) the photo sits beside
    //   side     "left" or "right" of the desk (the record takes the other side)
    //   caption  optional handwriting on the print
    //   ratio / pos  optional CSS aspect-ratio / object-position re-crop
    // Leave the list empty and nothing renders.
    photos: [
      { src: "images/about/me-1.jpg", alt: "Ayaan smiling in a grey hooded top and cap, with a young elephant walking behind", caption: "2019", record: 0, side: "right" },
      { src: "images/about/me-2.webp", alt: "Ayaan giving two thumbs up on the Toronto Islands shore, with the Toronto skyline and CN Tower behind", caption: "2026", record: 2, side: "left", ratio: "1 / 1", pos: "44% 50%" }
    ]
  },

  // -------------------------------------------------------------------
  // Projects — rendered as "fossil" cards grouped into strata layers by
  // `year` (newest on top), in the Projects section. Projects with
  // `status: "in-progress"` sit in their own "Still Excavating" layer on
  // top, regardless of year. See renderProjects() in main.js.
  //   `description` — the short summary, always visible in the window.
  //   `technical` — the longer, in-depth write-up, in a dropdown that starts closed
  //                 (blank line between paragraphs).
  //   `reflection` — Ayaan's own words, also a closed dropdown. Empty renders nothing.
  //   `downloads` — [{ label, path }], e.g. source zips, packaged .jar
  //                 builds. Drop the file in /files/projects and add an
  //                 entry, no other code changes needed.
  // -------------------------------------------------------------------
  projects: [
    {
      id: "erm",
      fossil: "footprint", // drawn on the card, see js/fossils.js
      name: "ERM",
      dates: "November 2024 – Present",
      year: 2024, // used to sort into strata layers in the Projects section
      status: "in-progress", // ongoing, so it sits in the "Still Excavating" layer
      description: "A multiplayer social deduction game built in Unreal Engine 5, set on an abandoned Earth. There are three roles, and each one plays differently.",
      technical: "Built in Unreal Engine 5 with C++ and Blueprints, on a dedicated server where the server is the authority. Role assignment, round progression and win conditions are decided on the server and replicated to every player. The Rogues want to eliminate everyone else so the rogue virus can spread. The Frontliners reinforce the firewall structures, which they can activate, and do specific tasks to hold them. The Trackers use a range of abilities to find out who has been hit with the virus.\n\nI wrote the gameplay systems, the replication and the round flow, and made the 3D models, animations, sound design, music and UI as well. Replication of player interactions was the hardest part. Players moving on each other's screens came together fairly early, but getting animations to play when they interacted took far longer. The simplest interaction I built is a punch that only works in the lobby, just for fun, and getting it to hit the right player took a long time.",
      tags: ["Unreal Engine 5", "C++/Blueprints", "Game System Design", "Asset Creation"],
      links: [
        { label: "GitHub", url: "https://github.com/A-Nature/ERM" }
      ],
      downloads: [
        // e.g. { label: "Source Code (.zip)", path: "files/projects/erm-source.zip" }
      ],
      media: [{
        type: "image", // "image" | "video"
        src: null, // e.g. "images/projects/erm-01.jpg". Leave null to hide the media slot entirely.
        alt: "ERM gameplay screenshot"
        // Capture ideas: in-editor screenshot of the abandoned-Earth environment, the role-reveal/voting UI,
        // a short clip of a round with 2+ players, or a diagram of how the three roles interact.
      }],
      reflection: "" // TODO(Ayaan): the friend leaving, having to take over Blender work, quitting and coming back, what that taught you
    },
    {
      id: "replicator-mod",
      fossil: "bone", // drawn on the card, see js/fossils.js
      name: "Ayaan's Replicator Mod",
      dates: "July 2026",
      year: 2026,
      description: "A copy/paste building tool for Minecraft 1.7.10 (Forge), written in Java to improve building for the campers at the summer camp I worked at. Built for multiplayer, with a clipboard for each player and undo.",
      technical: "A Forge 1.7.10 mod in Java. Everything that changes the world happens on the server, and the client only asks for it with packets, so players on the same server can't overwrite each other. Each player has their own clipboard state and selection, kept in a clipboard storage and an active-clipboard manager. A copy records the selected blocks into a saved clipboard that can be named, listed and switched between. It doesn't copy what is inside chests. Pasting supports rotation, and every paste is recorded in a per-player undo stack so it can be reversed.\n\nThe network layer is a small set of packets. They save a clipboard, activate one, set the rotation and undo, and there are responses that send the clipboard list and the materials a build needs back to the client. On the client there are key bindings, a preview of where the paste will land, a checklist overlay for the required materials in survival mode, and screens for naming and picking clipboards. It runs through two items, an Infinity Copier and an Infinity Replicator.\n\nThe controls are simple. With the Copier, right-click a block to set the first corner, then shift-right-click a block to set the second corner, which opens a prompt to name and save the selection as a clipboard. With the Replicator, right-click to paste at that spot, and shift-right-click to open the menu of saved clipboards and pick one. R rotates the paste, and X undoes it.",
      tags: ["Java", "Minecraft Forge", "Packet Networking"],
      links: [],
      downloads: [
        { label: "Ayaan's Replicator Mod (.jar)", path: "files/projects/replicator-mod-1.0.0.jar" }
      ],
      media: [{
        type: "image",
        src: null, // e.g. "images/projects/replicator-mod-01.jpg". Leave null to hide the media slot entirely.
        alt: "Replicator Mod screenshot"
        // Capture ideas: before/after of a structure being copy-pasted, a short clip of it in action,
        // or two players using it at once to show the per-player clipboards.
      }],
      reflection: "This is the kind of project that I started from a tiny spark of motivation and finished within a few weeks. It started when I noticed the kids at the summer camp I was working at often had a hard time making large builds in survival mode in Minecraft. Parts of the builds were often repetitive, but with a version of the popular “WorldEdit” addon available for the older education-edition license that the camp owned (specifically, 1.7.10), I took it upon myself to build the tool myself. It allowed me to learn an entirely new language, Java, and have some fun with it at the same time."
    },
    {
      id: "planet-pioneers",
      fossil: "ammonite", // drawn on the card, see js/fossils.js
      name: "Planet Pioneers",
      dates: "January 2025",
      year: 2025,
      description: "A cookie-clicker style game in C++ and raylib. You click in space to earn Stardust and spend it on four planets and their upgrades. It was my Grade 11 culminating project, and I drew every sprite.",
      technical: "Written in C++ with raylib, built around two structs, a Planet and a Button, and reusable functions for drawing planets and upgrade buttons and for handling upgrade and planet purchases. The functions take the balance and the income values by reference, so a purchase changes the game state directly. There are four planets to unlock in order. Each has two structures, one that raises Stardust per second and one that raises Stardust per click, and they stay locked until you own the planet. Every purchase raises the next price by 20%, and each structure has a maximum count.\n\nPlanets are drawn dark until you can afford them and in full colour once you own them, and hovering one shows its description, cost and unlock requirements. Each click spawns 24 particles with random velocities and colours that fade out over two seconds, and plays a click sound over background music. The game renders at 1920x1080 and scales to fit any screen, with F for fullscreen. The sprites were drawn in Libresprite.",
      credits: "I made the game and every planet and upgrade sprite. I did not make raylib, or the Raylib C++ Starter Template for VS Code by Nick Koumaris (MIT licence, included in the download) that the project started from, which is at https://github.com/educ8s/Raylib-CPP-Starter-Template-for-VSCODE",
      tags: ["C++", "raylib", "Libresprite", "Game Design"],
      links: [],
      downloads: [
        { label: "Playable demo and source (.zip, Windows, run main.exe)", path: "files/projects/planet-pioneers-demo.zip" }
      ],
      // Only used for the card on the Projects grid.
      thumbnail: { src: "images/projects/planet-pioneers-thumb.webp", alt: "Three planets covered in pixel-art buildings and upgrades against a dark nebula" },
      media: [
        { type: "video", src: "images/projects/planet-pioneers-demo.mp4", alt: "A run of Planet Pioneers, clicking in space to earn Stardust, then hovering over the planets", caption: "The game in action, clicking in space to earn Stardust and then checking the planets" },
        { type: "video", src: "images/projects/planet-pioneers-tour.mp4", alt: "Hovering over each planet in Planet Pioneers to read its description", caption: "A tour of the planets. Hovering over one shows its description, cost and unlock requirements." },
        { type: "video", src: "images/projects/planet-pioneers-purchasing.mp4", alt: "Buying planets with Stardust in Planet Pioneers", caption: "Buying planets with Stardust. When bought, they go from dark to full colour." },
        { type: "video", src: "images/projects/planet-pioneers-max-out.mp4", alt: "Buying structures until they reach their maximum in Planet Pioneers", caption: "Buying structures until each one hits its maximum, when it greys out in the upgrades list" },
        { type: "video", src: "images/projects/planet-pioneers-particles.mp4", alt: "Click particles in Planet Pioneers", caption: "The random particle effects with 24 randomly coloured particles per click that fade out over two seconds" }
      ],
      reflection: "When we got this project, I wanted to make a polished product. We had more time and I had a better base in coding. The game is simple, but it's stable and has a clear progression system. There are four purchasable planets, each with two structures you can buy: one raises Stardust (the in-game currency) per second, and the other raises it per click. I also coded a random particle system as a visual feature, which took a lot of testing and debugging. Planet Pioneers taught me many coding skills like organizing a game with structs and reusable functions, passing data by reference, handling textures, sound and music in raylib, and balancing a progression system. And, it was a blast to make. You may notice some unfamiliar names in the planet names or descriptions, which were the names of my friends in the class that I wanted to feature. Creating this game really built up my passion for coding and game development, as I got to see various functions and systems work together to make the game flow. It was also a great creative outlet to generate interesting ideas. All in all, Planet Pioneers is a creation that I am very proud of making and that I love to look back on."
    },
    {
      id: "platformer-demo",
      fossil: "fern", // drawn on the card, see js/fossils.js
      name: "Split-Screen Platformer Demo",
      dates: "January 2024",
      year: 2024,
      description: "A two-player platformer demo in Python and Pygame, with a jungle on top and a cave below, inspired by Fireboy and Watergirl. Only the jungle is playable, because of time constraints and because it was only meant to be a demo.",
      technical: "Built in Python with Pygame. The level is drawn from full-screen picture layers for the background, foreground, interactable parts and ladders. The jungle and the cave are part of that artwork, one picture split down the middle, not two separate screens. There is one level, with difficulty options, movement, death and moving enemies. The playable character is a frog and the enemies are crocodiles, both animated from sprite frames I drew.\n\nCollision works on rectangles. Each frame, the player's rectangle is checked against the rectangle of each block, platform and ladder, and against each enemy for death. When the player overlaps a ladder, gravity stops, and W moves them up slowly and S moves them down, so climbing replaces jumping. The ladder check runs before the jump. Enemies walk back and forth between two points at a speed set by the difficulty. Only the jungle side responds to input, and the cave is visual only, built so it can be used later. The background, platforms, ladders, trees, signs, font and music came from other sources and are credited in the window.",
      credits: "I made the character art (the frog, the crocodile and the other creatures) and the menu art. I did not make the background art, the static objects (platforms, ladders, trees, signs), the font (Grand9K Pixel) or the music.",
      tags: ["Python", "Pygame", "Game Design"],
      links: [],
      downloads: [
        { label: "Playable demo (.zip, needs Python and Pygame)", path: "files/projects/platformer-demo.zip" }
      ],
      // Only used for the card on the Projects grid (cropped to the frog and the crocodile).
      thumbnail: { src: "images/projects/platformer-thumb.png", alt: "The pixel-art frog player facing a dark crocodile enemy" },
      media: [
        { type: "image", src: "images/projects/platformer-level.webp", alt: "The jungle level of the platformer demo, with mossy platforms, ladders and signposts, the frog player at the far left and crocodile enemies on the platforms", caption: "The demo's one jungle level. The frog starts on the left and crocodile enemies patrol the platforms", pixel: true },
        { type: "video", src: "images/projects/platformer-full-demo.mp4", alt: "Full demo video of the platformer", caption: "Full demo video of the platformer" },
        { type: "video", src: "images/projects/platformer-deaths-demo.mp4", alt: "Demo of deaths and other mechanics in the platformer", caption: "A demo of the deaths and other mechanics" },
        { type: "image", src: "images/projects/platformer-frog.png", alt: "Close-up of the pixel-art frog player character", caption: "The frog, the player character I drew", pixel: true },
        { type: "video", src: "images/projects/platformer-player-animations.mp4", alt: "Showcase of the frog player's animations", caption: "The frog's animations for idle, walk and jump" },
        { type: "video", src: "images/projects/platformer-enemy-animations.mp4", alt: "Showcase of the crocodile enemy's animations", caption: "The crocodile enemy's animations for idle and walk" }
      ],
      reflection: "This was a game I mostly had fun with in class. Grade 10 computer science was a fairly introductory Python course, so it’s not my most polished project. I think I could have finished the game with enough time, but because the class had limited time and the project was only to make a working demo, I never touched it again. This project is still my first, fully made by me, project that could be publishable as a title if finished. I had a ton of fun making it and it holds a special place in my heart as my first game development experience."
    },
    {
      id: "jwe-mods",
      fossil: "egg", // drawn on the card, see js/fossils.js
      name: "Jurassic World Evolution Mods",
      dates: "2021",
      year: 2021,
      description: "Custom mods for Jurassic World Evolution with around 3,000 downloads in total on Nexus Mods. The main ones are two new species, Lapparentosaurus and Spinops, each with its own model, genome, profile and skins.",
      technical: "The mods run on ACSE, the Awesome Cobra Script Extender, with the game logic written in Lua in Notepad++. For each new species I started from an existing in-game model, opened and repacked the game files with Cobra Tools, edited the model in Blender and textured it in Substance Painter. The species were added to the game's data so each has its own genome and profile and shows up in the Genome Library next to the base-game dinosaurs, with a range of skin variants, as if it shipped with the game.\n\nLapparentosaurus is the most popular, with around 1.7k downloads, and Spinops follows with around 1.2k. Before those I made smaller mods, starting with Anaturaptor as a first test, then a Fiercer Sinoceratops with larger horns, a bigger crest and a new colour scheme.",
      credits: "I did not make the Awesome Cobra Script Extender (ACSE) by harlequinzeg0 and ilodev, which the mods are scripted on top of, or Cobra Tools by OpenNaja, used to open and edit the game's files. The original models I started from belong to Jurassic World Evolution by Frontier Developments. I made the edited models, the skins, and the new species' setup in the game.",
      tags: ["Lua", "ACSE", "Blender", "Substance Painter", "Notepad++", "Cobra Tools"],
      links: [
        { label: "Lapparentosaurus", url: "https://www.nexusmods.com/jurassicworldevolution/mods/1194" },
        { label: "Spinops", url: "https://www.nexusmods.com/jurassicworldevolution/mods/1305" },
        { label: "Fiercer Sinoceratops", url: "https://www.nexusmods.com/jurassicworldevolution/mods/1064" },
        { label: "Anaturaptor", url: "https://www.nexusmods.com/jurassicworldevolution/mods/968" }
      ],
      downloads: [],
      // Lapparentosaurus leads (best mod), then Spinops, then the earlier reskins.
      media: [
        { type: "image", src: "images/projects/jwe-lapparentosaurus-blue.webp", alt: "A blue-grey spotted Lapparentosaurus stretching its long neck above the trees", caption: "Lapparentosaurus, a new species I built for the game, in a blue-grey spotted skin" },
        { type: "image", src: "images/projects/jwe-lapparentosaurus-profile.webp", alt: "Lapparentosaurus herd by a lake with the in-game profile panel open", caption: "A blue and yellow variant in a herd, with its unique profile in the game panel" },
        { type: "image", src: "images/projects/jwe-lapparentosaurus-tan.webp", alt: "A tan, leopard-spotted Lapparentosaurus with a dark red head", caption: "A tan, spotted variant with a darker, red-crowned head" },
        { type: "image", src: "images/projects/jwe-lapparentosaurus-genome.webp", alt: "The Genome Library with Lapparentosaurus selected among the base game dinosaurs", caption: "Lapparentosaurus in the game's dinosaur library, sitting alongside the base game's dinosaurs with its own genome traits" },
        { type: "image", src: "images/projects/jwe-spinops-lake.webp", alt: "A Spinops wading through a lake, with a dark red frill and two tall spikes", caption: "Spinops, my second new species, wading through a lake in a red and orange skin" },
        { type: "image", src: "images/projects/jwe-spinops-herd.webp", alt: "Three Spinops in a paddock, each with a different skin", caption: "A Spinops herd showing the orange-brown and charcoal variants" },
        { type: "image", src: "images/projects/jwe-sinoceratops.webp", alt: "A Sinoceratops with enlarged horns and a red and yellow face, next to a pink one", caption: "Fiercer Sinoceratops, with larger horns, a bigger crest and a new colour scheme" },
        { type: "image", src: "images/projects/jwe-anaturaptor.webp", alt: "A small raptor with a purple tail and rose-coloured throat standing in grass", caption: "Anaturaptor, a remodel and reskin of the velociraptor." }
      ],
      reflection: "These mods were a leap into a jungle of code I had never really experienced. Lua scripts in Notepad++ scared me at first, but thankfully an online tutorial for creating a new species in Jurassic World Evolution guided me through the entire coding process. I can't say I actually learned much about how to code from this project, but more so I learned how to use a text editor efficiently and also how code looks at large scales. It was also my first time making assets in Blender and Substance Painter. However, the sight of such complex systems made me more interested in learning about it. Lapparentosaurus is my favourite and most detailed mod, and I think it has stunning skin colours and a great model. Overall, it was really for my own entertainment to make and publish my own mods, and they did gain some real retention from the game's community, especially the Lapparentosaurus, which was encouraging and made me feel proud of myself."
    },
    {
      id: "boid-sim",
      fossil: "fish", // drawn on the card, see js/fossils.js
      name: "Boid Simulation",
      dates: "July 2026",
      year: 2026,
      description: "A 2D fish-schooling simulation in C++ and raylib, with the three classic boid rules written from scratch and weights you can tune while it runs.",
      technical: "Written in C++ with raylib, running 100 fish at 1920x1080. Each frame, every fish looks at the others and applies the three boid rules. Separation pushes it away from anything inside 45 pixels, and the push gets stronger the closer the neighbour is. Alignment steers it toward the average heading of nearby fish. Cohesion pulls it toward the centre of the group. Every fish moves at a constant speed and only its direction changes, and the fish sprite is rotated to face where it is going. The three weights can be changed while it runs and are shown on screen as SEP, ALIGN and COH, so you can watch the flock change as you tune them. Checking every fish against every other is O(n²), which is fine at this size.",
      tags: ["C++", "raylib", "Simulation"],
      links: [
        { label: "GitHub", url: "https://github.com/A-Nature/boidsim" }
      ],
      downloads: [
        // e.g. { label: "Source Code (.zip)", path: "files/projects/boid-sim-source.zip" }
      ],
      media: [{
        type: "video",
        src: null, // e.g. "images/projects/boid-sim.mp4". Leave null to hide the media slot entirely.
        alt: "Boid simulation demo"
        // Capture ideas: a screen recording of the flock in motion (a still image undersells it),
        // the runtime weight-control UI in use, or a fitness-over-generations chart once neuroevolution lands.
      }],
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "tower-defense",
      fossil: "ammonite", // drawn on the card, see js/fossils.js
      name: "Out of Control (Tower Defense)",
      dates: "May – June 2026",
      year: 2026,
      description: "A simple tower defense game inspired by Helldivers 2, made in C++ with raylib for a school project. It is a demo, with two finished enemies and one turret, all fully animated.",
      technical: "Written in C++ with raylib. The game runs in waves. Enemies move along a path and you place turrets to stop them. Each turret picks the nearest enemy and locks onto it until it goes out of range, which was the most interesting part to code. There are only two finished enemy sprites and one turret, but all of them are fully animated, so it is very much a demo. I made the art, and the project taught me a lot about asset design and how a game's systems fit together.",
      tags: ["C++", "raylib", "Game Design"],
      links: [
        { label: "GitHub", url: "https://github.com/A-Nature/outofcontrol" }
      ],
      downloads: [
        // e.g. { label: "Source Code (.zip)", path: "files/projects/out-of-control-source.zip" }
      ],
      media: [{
        type: "image",
        src: null, // e.g. "images/projects/tower-defense-01.jpg". Leave null to hide the media slot entirely.
        alt: "Out of Control gameplay screenshot"
        // Capture ideas: mid-wave screenshot with towers, enemies, and UI visible, a clip of an enemy's
        // death animation, or the upgrade/economy UI.
      }],
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "stratagem-pad",
      fossil: "trilobite", // drawn on the card, see js/fossils.js
      name: "Helldivers Stratagem Pad",
      dates: "August 2026 – Present",
      year: 2026,
      status: "in-progress", // sits in the "Still Excavating" layer regardless of year
      description: "A wrist-mounted controller for Helldivers 2 stratagems. Swipe a code on the pad and it lights up the result. ESP32-S3 firmware, a case I designed and printed, and a built-in battery.",
      technical: "An ESP32-S3 development board runs custom C/C++ firmware that reads swipe gestures and matches them against a set of stratagem codes, then shows the result on a display in real time. The case was modelled in Tinkercad and printed on a Bambu Lab printer, with a battery inside so it runs untethered. It is still in progress.",
      tags: ["Embedded Systems", "ESP32-S3", "C/C++", "3D Printing"],
      links: [],
      downloads: [
        // e.g. { label: "Firmware Source (.zip)", path: "files/projects/stratagem-pad-source.zip" }
      ],
      media: [{
        type: "image",
        src: null, // e.g. "images/projects/stratagem-pad-01.jpg". Leave null to hide the media slot entirely.
        alt: "Stratagem pad prototype"
        // Capture ideas: the assembled pad, the bare board/wiring before the case went on, a clip of a
        // swipe being read and the matched stratagem lighting up.
      }],
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "helldivers-helmet",
      fossil: "shell", // drawn on the card, see js/fossils.js
      name: "Helldivers Helmet",
      dates: "July – September 2026",
      year: 2026,
      description: "A wearable Helldivers 2 helmet that I 3D printed in pieces, then primed, painted and weathered myself, with a vacuum-formed, tinted visor.",
      technical: "The model is a purchased print file, Hero of the Federation, from Galactic Armory. I printed it in about 15 pieces, including the small details, on a Bambu A1 mini in several colours of PLA, which meant tuning settings, maintaining the printer and recovering from failed prints. The pieces were joined with Gorilla Glue and hot glue, then filled with filler primer and Bondo Spot Putty and sanded smooth. Painting went in layers, using masking tape and saran wrap for the black, grey and gold spray coats, a stencil for the gold details, and acrylic splatter for the terminid blood weathering. The visor was vacuum-formed from an acrylic sheet over a mold using an oven, and tinted with window tint film. The build took over 30 hours of work.",
      credits: "The 3D print files are the Helldivers 2 Helmet, Hero of the Federation, from Galactic Armory, which I bought. Helldivers 2 and its designs belong to Arrowhead Game Studios. The printing, assembly, painting and visor are my own work. The store page is at https://galacticarmory.net/products/helldivers-2-helmet-hero-of-the-federation-3d-print-files",
      tags: ["3D Printing", "Bambu Lab", "Prop Making", "Painting", "Vacuum Forming"],
      links: [],
      downloads: [],
      // Only used for the card on the Projects grid.
      thumbnail: { src: "images/projects/helmet-thumb.webp", alt: "A person wearing the finished helmet next to a Helldiver cosplayer" },
      media: [
        { type: "image", src: "images/projects/helmet-9337.webp", alt: "The finished Helldivers helmet, worn beside a Helldiver cosplayer", caption: "The finished helmet, worn beside a Helldiver cosplayer" },
        { type: "image", src: "images/projects/helmet-8525.webp", alt: "The first few helmet pieces glued and taped together, painted blue and red", caption: "The first few pieces glued and taped together" },
        { type: "image", src: "images/projects/helmet-8542.webp", alt: "More helmet pieces glued together, held up in front of a mirror", caption: "More pieces glued on" },
        { type: "image", src: "images/projects/helmet-8556.webp", alt: "The full helmet shape with some primer and spot putty applied", caption: "The full shape, with some primer and spot putty" },
        { type: "image", src: "images/projects/helmet-8562.webp", alt: "The helmet with its first full coat of primer, sitting on a rock in the grass", caption: "The first full primer coat" },
        { type: "image", src: "images/projects/helmet-8570.webp", alt: "The helmet with a Bondo coat applied and partly sanded", caption: "The Bondo coat and sanding" },
        { type: "image", src: "images/projects/helmet-8584.webp", alt: "The helmet with a full coat of grey primer on a bed", caption: "A full primer coat" },
        { type: "image", src: "images/projects/helmet-8595.webp", alt: "Small helmet detail pieces, primed white on a sheet of paper", caption: "The small details, primed" },
        { type: "image", src: "images/projects/helmet-8609.webp", alt: "The primed helmet sitting in the grass", caption: "Primer coat on the outside" },
        { type: "image", src: "images/projects/helmet-8610.webp", alt: "The helmet with its full black coat", caption: "The full black coat" },
        { type: "image", src: "images/projects/helmet-8613.webp", alt: "The helmet with the grey coat added", caption: "The grey coat added" },
        { type: "image", src: "images/projects/helmet-8615.webp", alt: "The helmet with the gold coat added", caption: "The gold coat added" },
        { type: "image", src: "images/projects/helmet-8629.webp", alt: "The painted helmet with small details glued on, a stencilled emblem and painted weathering chips", caption: "Small details painted and glued on, stencil added and weathering chips painted" },
        { type: "video", src: "images/projects/helmet-blood-coat.mp4", alt: "The helmet turned in hand after the final paint coat, with splatters of terminid blood", caption: "The final paint coat and the first layer of ‘terminid blood’" }
      ],
      reflection: "I’ve always sucked at art. Painting, drawing, making crafts, and paying attention to small details has never been my strong suit. But when my friend told me to join him and make a custom helmet, I thought I’d try it. I had a lot of concerns and worries with the project. Could my printer even handle anything of this size? How does the painting work? Will my helmet break? The good thing is my friend had done tons of research beforehand, and assured me it would turn out okay. So we found 3D files online of our chosen helmets (mine being ‘The Hero of the Federation’ from Helldivers 2) and the journey began. There were some scary parts, like failed 3D prints at 2 am, running out of paint, terrifyingly large (less than a centimeter) gaps between parts, and a freshly-painted helmet falling onto grass. But it turned out amazing, and the final product is absolutely the physical project I am most proud of. It has no connection to software (other than optimizing my 3D printer), but the most valuable part of this project was showing myself that I am capable of more than I think I am if I just push myself and try it."
    }
  ],

  // -------------------------------------------------------------------
  // Experience — grouped by tab. Each tab is a chronological list
  // (top = most recent). Rendered as a vertical timeline. Descriptions
  // sourced from Ayaan's resume and LinkedIn. `media` and `downloads`
  // both default empty/null, most entries won't need them, but they're
  // there for the ones that do (e.g. a ReSwipe marketing portfolio).
  // -------------------------------------------------------------------
  experience: {
    work: [
      {
        id: "work-brickworks",
        role: "Camp Counsellor & Health and Safety Coordinator",
        place: "Brick Works Academy",
        dates: "July 2026 – August 2026",
        description: "Led daily STEAM-based activities for campers, teaching technical computer skills and foundational programming concepts. Guided campers through simple coding using programmable turtles in Minecraft, building logic and sequencing skills in a hands-on way, and wove in science and engineering concepts through Minecraft-based building and design challenges. Created Minecraft mods from scratch for the camp using Java. Acted as Health and Safety Coordinator alongside counsellor duties, keeping the camp environment safe and organized.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Brick Works Academy" }],
        reflection: "" // TODO(Ayaan)
      },
      {
        id: "work-ja-swo",
        role: "Camp Counsellor",
        place: "JA South Western Ontario",
        dates: "August 2025",
        description: "Led structured entrepreneurship workshops for youth covering core business fundamentals including budgeting, marketing, and financial planning. Supervised and mentored camper teams as they developed their own businesses from the ground up, offering consistent guidance and encouragement throughout. Fostered a positive learning environment where campers felt confident to think creatively and collaborate with one another.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "JA South Western Ontario" }],
        reflection: ""
      },
      {
        id: "work-havens",
        role: "Event Server",
        place: "Haven's Creamery",
        dates: "June 2025 – August 2025",
        description: "Served customers at high-volume ice cream events across London, delivering a positive and memorable experience to every guest. Stayed composed and professional throughout fast-paced, demanding shifts while maintaining a strong standard of service quality. Built confidence in customer service and communication, and a reliable ability to stay focused when it counts.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Haven's Creamery" }],
        reflection: ""
      }
    ],

    volunteer: [
      {
        id: "vol-brickworks",
        role: "Camp Volunteer",
        place: "Brick Works Academy Summer Camp",
        dates: "July 2025",
        description: "Assisted camp counsellors with various tasks while engaging with campers. Observed counsellors to better understand camp dynamics, and acted as a role model to children by providing guidance and helping resolve conflicts.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Brick Works Academy Summer Camp" }],
        reflection: ""
      },
      {
        id: "vol-peace-camp",
        role: "Camp Counsellor",
        place: "London Interfaith Peace Camp",
        dates: "August 2024",
        description: "Oversaw the well-being of campers, ensuring a safe and friendly environment, while planning, organizing, and leading engaging activities.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "London Interfaith Peace Camp" }],
        reflection: ""
      },
      {
        id: "vol-childrens-museum",
        role: "Gallery Attendant",
        place: "London Children's Museum",
        dates: "March 2023 – September 2023",
        description: "Talked to, assisted, and guided families visiting the museum. Worked with museum staff to keep exhibits organized and help prepare for special occasions.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "London Children's Museum" }],
        reflection: ""
      }
    ],

    extracurricular: [
      {
        id: "ex-reswipe",
        role: "VP of Marketing",
        place: "Junior Achievement: ReSwipe",
        dates: "October 2025 – Present",
        description: "Collaborated with a group of peers to build a profitable student company that went on to win the Canadian Company of the Year Championship, with a shot at representing Canada at the global championship this year. Created and ran the company's social media accounts, keeping a consistent posting schedule that grew the account past 800 followers and thousands of views, and won the regional Social Media Challenge. Led all marketing, branding, and events, which led to winning VP of Marketing of the Year in Southwestern Ontario.",
        downloads: [
          { label: "Marketing Portfolio (.pdf)", path: "files/experience/reswipe-marketing-portfolio.pdf" },
          { label: "ReSwipe Final Report (.pdf)", path: "files/experience/reswipe-final-report.pdf" }
        ],
        media: [{ type: "image", src: null, alt: "Junior Achievement: ReSwipe" }],
        reflection: ""
      },
      {
        id: "ex-camp-noor",
        role: "Summer Camp Organizer",
        place: "Camp Noor, Al Mahdi Islamic Community Centre",
        dates: "May 2025 – Present",
        description: "Helped plan and run Camp Noor, a children's summer camp. Came up with activity ideas, helped coordinate logistics, and created organizational forms to keep operations running smoothly. Worked with the rest of the team to build the camp experience from the ground up so campers had a structured, enjoyable, and memorable time. Gained hands-on experience in event planning and program design.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Camp Noor" }],
        reflection: ""
      },
      {
        id: "ex-bagnetic",
        role: "Team Member",
        place: "Junior Achievement: Bagnetic / Spoonique",
        dates: "October 2023 – April 2025",
        description: "Collaborated with a group of peers across two years to build a profitable student company, first as Bagnetic and then as Spoonique. Carried out various roles within the company, including marketing and production.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Junior Achievement: Bagnetic / Spoonique" }],
        reflection: ""
      },
      {
        id: "ex-oakridge-steam",
        role: "Logistics Manager",
        place: "Oakridge STEAM IC Chapter",
        dates: "September 2025 – June 2026",
        description: "Created forms and spreadsheets to organize member information for the chapter. Helped plan events for the team and kept members updated on deadlines and upcoming activities.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Oakridge STEAM IC Chapter" }],
        reflection: ""
      },
      {
        id: "ex-oakbotics",
        role: "Team Member",
        place: "Oakbotics (Oakridge Robotics Team)",
        dates: "September 2022 – June 2026",
        description: "Wrote the autonomous and driver-controlled sections of the competition robot in Java alongside teammates, contributing to the team's qualification for the 2025 FIRST Championship in Houston. Took part in team events and competitions throughout, building lasting connections with fellow team members.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Oakbotics" }],
        reflection: ""
      },
      {
        id: "ex-scouting",
        role: "Member",
        place: "Al-Mahdi Scouting Association",
        dates: "September 2021 – June 2026",
        description: "Learned practical survival and life skills, including personal finance management and how to build a fire. Worked with fellow Scouts to build a well-integrated, productive team environment.",
        downloads: [],
        media: [{ type: "image", src: null, alt: "Al-Mahdi Scouting Association" }],
        reflection: ""
      }
    ]
  },

  // Skills. The technical groups follow the resume (Languages, Tools, Systems, Game
  // Development), so keep the two in step. Each skill can list where it was used.
  // In `uses`, `project` or `experience` (an id) opens that window, `education: true`
  // jumps to Education, and `url` opens a link. A skill with no uses is a plain tag.
  skills: [
    {
      category: "Languages",
      items: [
        { name: "Python", uses: [{ label: "LeetCode", url: "https://github.com/A-Nature/leetcode_collection" }, { label: "Platformer Demo", project: "platformer-demo" }] },
        { name: "C++", uses: [{ label: "LeetCode", url: "https://github.com/A-Nature/leetcode_collection" }, { label: "Planet Pioneers", project: "planet-pioneers" }, { label: "Boid Simulation", project: "boid-sim" }, { label: "Out of Control", project: "tower-defense" }, { label: "ERM", project: "erm" }] },
        { name: "C", uses: [{ label: "Stratagem Pad", project: "stratagem-pad" }, { label: "University of Waterloo", education: true }] },
        { name: "Java", uses: [{ label: "Replicator Mod", project: "replicator-mod" }, { label: "Oakbotics", experience: "ex-oakbotics" }] },
        { name: "Lua", uses: [{ label: "Jurassic Mods", project: "jwe-mods" }] }
      ]
    },
    {
      category: "Tools",
      items: [
        { name: "Git", uses: [{ label: "ERM", project: "erm" }, { label: "Boid Simulation", project: "boid-sim" }, { label: "Out of Control", project: "tower-defense" }] },
        { name: "GitHub", uses: [{ label: "LeetCode", url: "https://github.com/A-Nature/leetcode_collection" }, { label: "ERM", project: "erm" }, { label: "Boid Simulation", project: "boid-sim" }, { label: "Out of Control", project: "tower-defense" }] },
        { name: "Cobra Tools", uses: [{ label: "Jurassic Mods", project: "jwe-mods" }] }
      ]
    },
    {
      category: "Systems",
      items: [
        { name: "Packet-based Protocols", uses: [{ label: "Replicator Mod", project: "replicator-mod" }, { label: "ERM", project: "erm" }] },
        { name: "Data Serialization (NBT)", uses: [{ label: "Replicator Mod", project: "replicator-mod" }] },
        { name: "Client-Server Networking", uses: [{ label: "ERM", project: "erm" }, { label: "Replicator Mod", project: "replicator-mod" }] },
        { name: "Multiplayer Replication", uses: [{ label: "ERM", project: "erm" }] }
      ]
    },
    {
      category: "Game Development",
      items: [
        { name: "Unreal Engine 5", uses: [{ label: "ERM", project: "erm" }] },
        { name: "raylib", uses: [{ label: "Planet Pioneers", project: "planet-pioneers" }, { label: "Boid Simulation", project: "boid-sim" }, { label: "Out of Control", project: "tower-defense" }] },
        { name: "Game Modding", uses: [{ label: "Replicator Mod", project: "replicator-mod" }, { label: "Jurassic Mods", project: "jwe-mods" }] },
        { name: "Minecraft Forge", uses: [{ label: "Replicator Mod", project: "replicator-mod" }] }
      ]
    },
    {
      category: "Asset Creation",
      items: [
        { name: "Blender", uses: [{ label: "ERM", project: "erm" }, { label: "Jurassic Mods", project: "jwe-mods" }] },
        { name: "Libresprite", uses: [{ label: "Planet Pioneers", project: "planet-pioneers" }] }
      ]
    },
    {
      category: "Fabrication & Embedded",
      items: [
        { name: "Embedded Systems (ESP32)", uses: [{ label: "Stratagem Pad", project: "stratagem-pad" }] },
        { name: "Tinkercad", uses: [{ label: "Stratagem Pad", project: "stratagem-pad" }] },
        { name: "3D Printing", uses: [{ label: "Helmet", project: "helldivers-helmet" }, { label: "Stratagem Pad", project: "stratagem-pad" }] }
      ]
    },
    {
      category: "Work & Leadership",
      // Skills built through jobs, volunteering, and leadership roles, not
      // just coding projects. See `experience` above for where these came from.
      items: [
        { name: "Marketing & Branding", uses: [{ label: "ReSwipe", experience: "ex-reswipe" }] },
        { name: "Public Speaking", uses: [{ label: "ReSwipe", experience: "ex-reswipe" }] },
        { name: "Team Leadership", uses: [{ label: "ReSwipe", experience: "ex-reswipe" }, { label: "Oakridge STEAM", experience: "ex-oakridge-steam" }] },
        { name: "Youth Mentorship", uses: [{ label: "Brick Works Academy", experience: "work-brickworks" }, { label: "Camp Noor", experience: "ex-camp-noor" }, { label: "Interfaith Peace Camp", experience: "vol-peace-camp" }] },
        { name: "Customer Service", uses: [{ label: "Haven's Creamery", experience: "work-havens" }] },
        { name: "Event Logistics", uses: [{ label: "Oakridge STEAM", experience: "ex-oakridge-steam" }, { label: "Camp Noor", experience: "ex-camp-noor" }] },
        "Problem Solving Under Pressure"
      ]
    }
  ],

  // A line under the skills that points to practice work. Leave `url` empty and nothing renders.
  skillsPractice: {
    text: "I also practise problem solving on LeetCode.",
    label: "LeetCode solutions on GitHub",
    url: "https://github.com/A-Nature/leetcode_collection"
  },

  // Kept intentionally short, this is mostly here for completeness.
  education: [
    {
      id: "edu-uwaterloo",
      institution: "University of Waterloo",
      program: "Honours Software Engineering",
      short: "Waterloo",
      start: "2026-09-01",
      end: "2031-06-30",
      expected: true, // the end date is the expected graduation
      dates: "September 2026 – Expected June 2031",
      awards: [
        "W.J. Beynon Memorial Entrance Scholarship, awarded to one incoming Engineering student each year",
        "President's Scholarship of Distinction, an automatic entrance award for a 95%+ admission average"
      ]
    },
    {
      id: "edu-oakridge",
      institution: "Oakridge Secondary School",
      program: "Ontario Secondary School Diploma",
      short: "Oakridge",
      start: "2022-09-01",
      end: "2026-06-30",
      dates: "September 2022 – June 2026",
      awards: [
        "Academic Excellence, Grades 9-12 (80%+ average)",
        "Grade 11 English Subject Award"
      ]
    }
  ],

  contact: {
    email: "ayaan.b@outlook.com",
    github: "https://github.com/A-Nature",
    linkedin: "https://www.linkedin.com/in/ayaan-bhimani/",
    instagram: "https://www.instagram.com/ayaanb08",
    resume: "files/ayaan-bhimani-resume.pdf"
  }
};
