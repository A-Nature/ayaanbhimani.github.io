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
        era: "Grade 5",
        text: "Ever since I was young, I've loved coding. It started in grade 5, when I was introduced to Scratch coding at school. I instantly fell in love with it and excelled at it. I quickly accelerated through Scratch coding, and before long, I was making my own maze and choose-your-own-adventure games. My teacher saw this passion, so she gave me the option to try harder prompts for our projects and she even let me answer my classmates\u2019 questions to help her out. After some time, I explored beyond the bubble of scratch. It started with Python, which I learned alongside my friend whose dad taught us the Python basics."
      },
      {
        era: "Grade 8",
        text: "When I was in Grade 8, my Python knowledge had extended quite a bit, and I was also dipping my toes in other coding languages. At the time, I loved the game \u2018Jurassic World Evolution\u2019, especially when it was played with community-made mods. And so, I went ahead and made my own mods, learning with lua and how to publish my creations. At this point, I knew I wanted to pursue a life in coding. My final goal and dream at this point, was to attend the University of Waterloo for Software Engineering."
      },
      {
        era: "High school",
        text: "When high school hit, my computer science classes elevated my knowledge in Python and C++, allowing me to create various terminal based programs, but more interestingly, 3 unique games. A platformer in Python/Pygame, a clicker game in C++/Raylib, and a tower defense game in C++/Raylib. This is where my game development journey started to pick up."
      },
      {
        era: "Grade 11 onward",
        text: "In early grade 11, I started to build my own game in Unreal Engine 5, a project that is still ongoing today. Over the past few years I've taught myself C++, Unreal Engine, Python, and Java through hands-on projects. From a real multiplayer game to Minecraft mods, I'm drawn to cool projects that force me to learn but also let me express my creativity. I love understanding why something works but also building it from the ground up."
      },
      {
        era: "Today",
        text: "And that brings us here, I\u2019m living 14 year-old me\u2019s dream of attending the University of Waterloo for Software Engineering, with a passion for game development, systems programming, and building things from scratch."
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
      { src: "images/about/me-2.webp", alt: "Ayaan giving two thumbs up on the Toronto Islands shore, with the Toronto skyline and CN Tower behind", caption: "2026", record: 4, side: "left", ratio: "1 / 1", pos: "44% 50%" }
    ]
  },

  // -------------------------------------------------------------------
  // Projects — rendered as "fossil" cards grouped into strata layers by
  // `year` (newest on top), in the Projects section. Projects with
  // `status: "in-progress"` sit in their own "Still Excavating" layer on
  // top, regardless of year. See renderProjects() in main.js.
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
      description: "Multiplayer social deduction game built in Unreal Engine 5, set on an abandoned Earth. Players take on one of three roles (Rogues, Frontliners, Trackers), each with distinct mechanics layering deception, investigation, and teamwork. Inspired by Mafia, Among Us, and Dead by Daylight. Full gameplay programming, multiplayer replication, role assignment, and round progression built largely from scratch, along with all 3D models, animations, sound design, music, and UI.",
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
      description: "A Minecraft mod built in Java for Forge 1.7.10 as part of a summer coding camp. It's a copy/paste tool for building, designed for multiplayer: a packet-based system with per-player clipboard state and undo support.",
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
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "platformer-demo",
      fossil: "fern", // drawn on the card, see js/fossils.js
      name: "Split-Screen Platformer Demo",
      dates: "2023",
      year: 2023,
      description: "A two-player platformer demo I made for grade 10 computer science, in Python with Pygame. The idea was a split-screen game in the spirit of Fireboy and Watergirl, but with the two halves completely separate: one player in a jungle, the other in a cave, who would eventually be able to reach into each other's worlds. Since it was a demo, it has a single level with difficulty options, movement, death, and moving enemies (frogs in the jungle). Only one player is playable, and the cave side is visual only, built to be used later.",
      tags: ["Python", "Pygame", "Game Design"],
      links: [],
      downloads: [],
      media: [
        // Demo clips and screenshots are coming, e.g.
        // { type: "video", src: "images/projects/platformer-demo.mp4", alt: "Platformer demo gameplay", caption: "..." }
      ],
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "jwe-mods",
      fossil: "egg", // drawn on the card, see js/fossils.js
      name: "Jurassic World Evolution Mods",
      dates: "2021",
      year: 2021,
      description: "Custom mods for Jurassic World Evolution, and my first real step into code. The two that took the most work were the new species I added to the game, Lapparentosaurus and Spinops, whose models I designed myself based on similar dinosaurs. Lapparentosaurus is my best mod: a giant sauropod with its own genome, profile and comfort requirements in the game's Genome Library, plus a range of skin variants (environment skins for jungle, steppe, tundra, alpine and arid habitats, and hatchery skins). Before those I started smaller, with reskins and remodels of existing dinosaurs: Anaturaptor as a first test, then a Fiercer Sinoceratops with larger horns, a bigger crest and new colours. Along the way I learned Lua in Notepad++, my first asset design in Blender and Substance Painter, and how to code around a dependency, ACSE (the Awesome Cobra Script Extender).",
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
        { type: "image", src: "images/projects/jwe-lapparentosaurus-blue.webp", alt: "A blue-grey spotted Lapparentosaurus stretching its long neck above the trees", caption: "Lapparentosaurus, a new species I built for the game, in its blue-grey spotted skin" },
        { type: "image", src: "images/projects/jwe-lapparentosaurus-profile.webp", alt: "Lapparentosaurus herd by a lake with the in-game profile panel open", caption: "A blue and yellow skin variant in a herd, with its profile and comfort requirements in the game panel" },
        { type: "image", src: "images/projects/jwe-lapparentosaurus-tan.webp", alt: "A tan, leopard-spotted Lapparentosaurus with a dark red head", caption: "A tan, spotted variant with a darker, red-crowned head" },
        { type: "image", src: "images/projects/jwe-lapparentosaurus-genome.webp", alt: "The Genome Library with Lapparentosaurus selected among the base game dinosaurs", caption: "Lapparentosaurus in the Genome Library, sitting alongside the base game's dinosaurs with its own genome traits" },
        { type: "image", src: "images/projects/jwe-spinops-lake.webp", alt: "A Spinops wading through a lake, with a dark red frill and two tall spikes", caption: "Spinops, my second new species, wading through a lake in a dark red and orange skin" },
        { type: "image", src: "images/projects/jwe-spinops-herd.webp", alt: "Three Spinops in a paddock, each with a different skin", caption: "A Spinops herd in the paddock, showing the orange-brown and charcoal skin variants" },
        { type: "image", src: "images/projects/jwe-sinoceratops.webp", alt: "A Sinoceratops with enlarged horns and a red and yellow face, next to a pink one", caption: "Fiercer Sinoceratops, with larger horns, a bigger crest and a red and yellow colour scheme" },
        { type: "image", src: "images/projects/jwe-anaturaptor.webp", alt: "A small raptor with a purple tail and rose-coloured throat standing in grass", caption: "Anaturaptor, my first test: a reskin in purple and rose" }
      ],
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "boid-sim",
      fossil: "fish", // drawn on the card, see js/fossils.js
      name: "Boid Simulation",
      dates: "July 2026",
      year: 2026,
      description: "2D boid/fish schooling simulation built in C++ with raylib, implementing the three classic boid rules (separation, alignment, and cohesion) from scratch, with runtime weight controls for live tuning of flocking behavior. Currently being extended with a neuroevolution/genetic algorithm layer.",
      tags: ["C++", "raylib", "Simulation", "Genetic Algorithms"],
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
      dates: "2026",
      year: 2026,
      description: "Simple, Helldivers 2 inspired tower defense game. Primitive and incomplete, was mostly just a school project, but learned more about asset design and game systems. A unique part to code was the targeting system for the turrets which was cool to learn.",
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
      description: "A wrist-mounted hardware controller inspired by the stratagem input system from Helldivers 2. An ESP32-S3 development board runs custom firmware that reads swipe gestures and matches them against a set of stratagem codes, then lights up a display to show the result in real time. The case was self-designed in Tinkercad and printed on a Bambu Lab printer, with a battery built in so the whole thing runs untethered. Still in progress.",
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
      dates: "2026",
      year: 2026,
      description: "A large Helldivers 2 helmet, printed in several sections on a Bambu Lab printer since it was too big for one piece. Most of the real work was dialing in print settings so the sections did not warp or fail partway through, then sanding, gluing everything together, and painting the final piece. A physical build and fabrication project that took a lot of patience across a long multi-step process.",
      tags: ["3D Printing", "Bambu Lab", "Prop Making", "Painting"],
      links: [],
      downloads: [],
      media: [{
        type: "image",
        src: null, // e.g. "images/projects/helldivers-helmet-01.jpg". Leave null to hide the media slot entirely.
        alt: "Helldivers helmet build"
        // Capture ideas: the printed sections before assembly, mid-paint, and the finished helmet.
      }],
      reflection: "" // TODO(Ayaan)
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
        description: "Led daily STEAM-based activities for campers, teaching technical computer skills and foundational programming concepts. Guided campers through simple coding using programmable turtles in Minecraft, building logic and sequencing skills in a hands-on way, and wove in science and engineering concepts through Minecraft-based building and design challenges. Created Minecraft mods from scratch for the camp using Java and Blockbench. Acted as Health and Safety Coordinator alongside counsellor duties, keeping the camp environment safe and organized.",
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

  skills: [
    {
      category: "Languages",
      items: ["Python", "C++", "C", "Java"]
    },
    {
      category: "Tools",
      items: ["Git", "GitHub", "Docker"]
    },
    {
      category: "Systems",
      items: ["Packet-based Protocols", "Data Serialization (NBT)", "UART Communication", "Multiplayer Replication", "Genetic Algorithms/Neuroevolution"]
    },
    {
      category: "Game Development",
      items: ["Unreal Engine 5", "raylib", "Minecraft Forge"]
    },
    {
      category: "Fabrication & Embedded",
      items: ["Embedded Systems (ESP32)", "Tinkercad", "Blockbench", "Blender", "3D Printing"]
    },
    {
      // Skills built through jobs, volunteering, and leadership roles, not
      // just coding projects. See `experience` above for where these came from.
      category: "Work & Leadership",
      items: ["Marketing & Branding", "Public Speaking", "Team Leadership", "Youth Mentorship", "Customer Service", "Event Logistics", "Problem Solving Under Pressure"]
    }
  ],

  // Kept intentionally short, this is mostly here for completeness.
  education: [
    {
      id: "edu-uwaterloo",
      institution: "University of Waterloo",
      program: "Honours Software Engineering",
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
