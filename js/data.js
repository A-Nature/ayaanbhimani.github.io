/*
  data.js
  ---------------------------------------------------------------------------
  Single source of truth for all content on the site: projects, experience,
  skills, and social links. The layout/render code in main.js reads
  from these arrays/objects, so adding a new project or job means editing
  ONLY this file, no HTML or layout changes required.

  Media slots:
    Each project and experience entry has a `media` object describing where
    an image/video goes. Drop files into /images/projects or
    /images/experience and set the `src` field. Until then, `src` is null
    and the slot renders nothing at all (no placeholder box).

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
    location: "London, Ontario, Canada"
  },

  about: {
    // Rendered as one <p> per paragraph, see renderAbout() in main.js.
    bio: [
      "I'm a Software Engineering student at the University of Waterloo with a passion for game development, systems programming, and building things from scratch.",
      "Ever since I was young, I've loved coding. I used to make all sorts of unique games in Scratch, and that passion never stopped.",
      "Over the past few years I've taught myself C++, Unreal Engine, Python, and Java through hands-on projects. From a real multiplayer game to Minecraft mods, I'm drawn to cool projects that force me to learn but also let me express my creativity. I love understanding why something works but also building it from the ground up."
    ]
  },

  // -------------------------------------------------------------------
  // Projects — rendered as plain text tiles in a grid.
  //   `downloads` — [{ label, path }], e.g. source zips, packaged .jar
  //                 builds. Drop the file in /files/projects and add an
  //                 entry, no other code changes needed.
  // -------------------------------------------------------------------
  projects: [
    {
      id: "erm",
      name: "ERM",
      description: "Multiplayer social deduction game built in Unreal Engine 5, set on an abandoned Earth. Players take on one of three roles (Rogues, Frontliners, Trackers), each with distinct mechanics layering deception, investigation, and teamwork. Inspired by Mafia, Among Us, and Dead by Daylight. Full gameplay programming, multiplayer replication, role assignment, and round progression built largely from scratch, along with all 3D models, animations, sound design, music, and UI.",
      tags: ["Unreal Engine 5", "C++/Blueprints", "Game System Design", "Asset Creation"],
      links: [
        { label: "GitHub", url: "https://github.com/A-Nature/ERM" }
      ],
      downloads: [
        // e.g. { label: "Source Code (.zip)", path: "files/projects/erm-source.zip" }
      ],
      media: {
        type: "image", // "image" | "video"
        src: null, // e.g. "images/projects/erm-01.jpg". Leave null to hide the media slot entirely.
        alt: "ERM gameplay screenshot"
        // Capture ideas: in-editor screenshot of the abandoned-Earth environment, the role-reveal/voting UI,
        // a short clip of a round with 2+ players, or a diagram of how the three roles interact.
      },
      reflection: "" // TODO(Ayaan): the friend leaving, having to take over Blender work, quitting and coming back, what that taught you
    },
    {
      id: "minecraft-mods",
      name: "Minecraft Mods",
      description: "Two Minecraft mods built in Java for Forge 1.7.10 as part of a summer coding camp. Ayaan's Replicator Mod is a WorldEdit-style copy/paste tool. PrehistoriCraft, still a work in progress, adds custom dinosaur entities modeled in Blockbench, with a two-version plan: a 1.7.10 camp build and a future 1.20.1+ CurseForge release using GeckoLib.",
      tags: ["Java", "Minecraft Forge", "Blockbench", "GeckoLib"],
      links: [],
      downloads: [
        { label: "Ayaan's Replicator Mod (.jar)", path: "files/projects/replicator-mod-1.0.0.jar" }
        // e.g. { label: "PrehistoriCraft (.jar)", path: "files/projects/prehistoricraft.jar" }
      ],
      media: {
        type: "image",
        src: null, // e.g. "images/projects/minecraft-mods-01.jpg". Leave null to hide the media slot entirely.
        alt: "Minecraft mod screenshot"
        // Capture ideas: before/after of the Replicator Mod copy-pasting a structure, a clip of it in action,
        // a Blockbench screenshot of the dinosaur model mid-creation, or the entity spawned in-game.
      },
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "boid-sim",
      name: "Boid Simulation",
      description: "2D boid/fish schooling simulation built in C++ with raylib, with runtime weight controls for live tuning of flocking behavior. Currently being extended with a neuroevolution/genetic algorithm layer.",
      tags: ["C++", "raylib", "Simulation", "Genetic Algorithms"],
      links: [
        { label: "GitHub", url: "https://github.com/A-Nature/boidsim" }
      ],
      downloads: [
        // e.g. { label: "Source Code (.zip)", path: "files/projects/boid-sim-source.zip" }
      ],
      media: {
        type: "video",
        src: null, // e.g. "images/projects/boid-sim.mp4". Leave null to hide the media slot entirely.
        alt: "Boid simulation demo"
        // Capture ideas: a screen recording of the flock in motion (a still image undersells it),
        // the runtime weight-control UI in use, or a fitness-over-generations chart once neuroevolution lands.
      },
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "tower-defense",
      name: "Out of Control (Tower Defense)",
      description: "Simple, Helldivers 2 inspired tower defense game. Primitive and incomplete, was mostly just a school project, but learned more about asset design and game systems. A unique part to code was the targeting system for the turrets which was cool to learn.",
      tags: ["C++", "raylib", "Game Design"],
      links: [
        { label: "GitHub", url: "https://github.com/A-Nature/outofcontrol" }
      ],
      downloads: [
        // e.g. { label: "Source Code (.zip)", path: "files/projects/out-of-control-source.zip" }
      ],
      media: {
        type: "image",
        src: null, // e.g. "images/projects/tower-defense-01.jpg". Leave null to hide the media slot entirely.
        alt: "Out of Control gameplay screenshot"
        // Capture ideas: mid-wave screenshot with towers, enemies, and UI visible, a clip of an enemy's
        // death animation, or the upgrade/economy UI.
      },
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "stratagem-pad",
      name: "Helldivers Stratagem Pad",
      description: "A custom hardware controller inspired by the stratagem input system from Helldivers 2. A microcontroller reads swipe input from a touch surface and runs the sequence through a small state machine to match it against a set of stratagem codes, then lights up a display to show the result in real time. The case was designed in Tinkercad and printed on a Bambu Lab printer, with a battery built in so the whole thing runs untethered. Still in progress.",
      tags: ["Embedded Systems", "C/C++", "Gesture Recognition", "3D Printing"],
      links: [],
      downloads: [
        // e.g. { label: "Firmware Source (.zip)", path: "files/projects/stratagem-pad-source.zip" }
      ],
      media: {
        type: "image",
        src: null, // e.g. "images/projects/stratagem-pad-01.jpg". Leave null to hide the media slot entirely.
        alt: "Stratagem pad prototype"
        // Capture ideas: the assembled pad, the bare board/wiring before the case went on, a clip of a
        // swipe being read and the matched stratagem lighting up.
      },
      reflection: "" // TODO(Ayaan)
    },
    {
      id: "helldivers-helmet",
      name: "Helldivers Helmet",
      description: "A large Helldivers 2 helmet, printed in several sections on a Bambu Lab printer since it was too big for one piece. Most of the real work was dialing in print settings so the sections did not warp or fail partway through, then sanding, gluing everything together, and painting the final piece. A physical build and fabrication project that took a lot of patience across a long multi-step process.",
      tags: ["3D Printing", "Bambu Lab", "Prop Making", "Painting"],
      links: [],
      downloads: [],
      media: {
        type: "image",
        src: null, // e.g. "images/projects/helldivers-helmet-01.jpg". Leave null to hide the media slot entirely.
        alt: "Helldivers helmet build"
        // Capture ideas: the printed sections before assembly, mid-paint, and the finished helmet.
      },
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
        media: { type: "image", src: null, alt: "Brick Works Academy" },
        reflection: "" // TODO(Ayaan)
      },
      {
        id: "work-ja-swo",
        role: "Camp Counsellor",
        place: "JA South Western Ontario",
        dates: "August 2025",
        description: "Led structured entrepreneurship workshops for youth covering core business fundamentals including budgeting, marketing, and financial planning. Supervised and mentored camper teams as they developed their own businesses from the ground up, offering consistent guidance and encouragement throughout. Fostered a positive learning environment where campers felt confident to think creatively and collaborate with one another.",
        downloads: [],
        media: { type: "image", src: null, alt: "JA South Western Ontario" },
        reflection: ""
      },
      {
        id: "work-havens",
        role: "Event Server",
        place: "Haven's Creamery",
        dates: "June 2025 – August 2025",
        description: "Served customers at high-volume ice cream events across London, delivering a positive and memorable experience to every guest. Stayed composed and professional throughout fast-paced, demanding shifts while maintaining a strong standard of service quality. Built confidence in customer service and communication, and a reliable ability to stay focused when it counts.",
        downloads: [],
        media: { type: "image", src: null, alt: "Haven's Creamery" },
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
        media: { type: "image", src: null, alt: "Brick Works Academy Summer Camp" },
        reflection: ""
      },
      {
        id: "vol-peace-camp",
        role: "Camp Counsellor",
        place: "London Interfaith Peace Camp",
        dates: "August 2024",
        description: "Oversaw the well-being of campers, ensuring a safe and friendly environment, while planning, organizing, and leading engaging activities.",
        downloads: [],
        media: { type: "image", src: null, alt: "London Interfaith Peace Camp" },
        reflection: ""
      },
      {
        id: "vol-childrens-museum",
        role: "Gallery Attendant",
        place: "London Children's Museum",
        dates: "March 2023 – September 2023",
        description: "Talked to, assisted, and guided families visiting the museum. Worked with museum staff to keep exhibits organized and help prepare for special occasions.",
        downloads: [],
        media: { type: "image", src: null, alt: "London Children's Museum" },
        reflection: ""
      }
    ],

    extracurricular: [
      {
        id: "ex-reswipe",
        role: "VP of Marketing",
        place: "Junior Achievement: ReSwipe",
        dates: "October 2025 – May 2026",
        description: "Collaborated with a group of peers to build a profitable student company, helping it win Outstanding Company of the Year in Southwestern Ontario. Created and ran the company's social media accounts, keeping a consistent posting schedule that grew the account past 800 followers and thousands of views, and won the regional Social Media Challenge. Led all marketing and branding, and planned events and promotions for customers, which led to winning VP of Marketing of the Year in Southwestern Ontario.",
        downloads: [
          { label: "Marketing Portfolio (.pdf)", path: "files/experience/reswipe-marketing-portfolio.pdf" },
          { label: "ReSwipe Final Report (.pdf)", path: "files/experience/reswipe-final-report.pdf" }
        ],
        media: { type: "image", src: null, alt: "Junior Achievement: ReSwipe" },
        reflection: ""
      },
      {
        id: "ex-bagnetic",
        role: "Team Member",
        place: "Junior Achievement: Bagnetic / Spoonique",
        dates: "October 2023 – April 2025",
        description: "Collaborated with a group of peers across two years to build a profitable student company, first as Bagnetic and then as Spoonique. Carried out various roles within the company, including marketing and production.",
        downloads: [],
        media: { type: "image", src: null, alt: "Junior Achievement: Bagnetic / Spoonique" },
        reflection: ""
      },
      {
        id: "ex-oakridge-steam",
        role: "Logistics Manager",
        place: "Oakridge STEAM IC Chapter",
        dates: "September 2025 – June 2026",
        description: "Created forms and spreadsheets to organize member information for the chapter. Helped plan events for the team and kept members updated on deadlines and upcoming activities.",
        downloads: [],
        media: { type: "image", src: null, alt: "Oakridge STEAM IC Chapter" },
        reflection: ""
      },
      {
        id: "ex-oakbotics",
        role: "Team Member",
        place: "Oakbotics (Oakridge Robotics Team)",
        dates: "September 2022 – June 2026",
        description: "Wrote code with teammates for a competition robot based on each year's challenge parameters. Took part in team events and competitions, building lasting connections with fellow team members.",
        downloads: [],
        media: { type: "image", src: null, alt: "Oakbotics" },
        reflection: ""
      },
      {
        id: "ex-scouting",
        role: "Member",
        place: "Al-Mahdi Scouting Association",
        dates: "September 2021 – June 2026",
        description: "Learned practical survival and life skills, including personal finance management and how to build a fire. Worked with fellow Scouts to build a well-integrated, productive team environment.",
        downloads: [],
        media: { type: "image", src: null, alt: "Al-Mahdi Scouting Association" },
        reflection: ""
      }
    ]
  },

  skills: [
    {
      category: "Languages",
      items: ["C++", "Java", "Python", "JavaScript"]
    },
    {
      category: "Engines & Tools",
      items: ["Unreal Engine 5", "Minecraft Forge", "GeckoLib", "Blockbench", "Blender", "raylib"]
    },
    {
      category: "Systems & Simulation",
      items: ["Multiplayer Networking/Replication", "Genetic Algorithms/Neuroevolution"]
    },
    {
      // Skills built through jobs, volunteering, and leadership roles, not
      // just coding projects. See `experience` above for where these came from.
      category: "Work & Leadership",
      items: ["Marketing & Branding", "Public Speaking", "Team Leadership", "Youth Mentorship", "Customer Service", "Event Logistics"]
    }
  ],

  contact: {
    email: "ayaan.b@outlook.com",
    github: "https://github.com/A-Nature",
    linkedin: "https://www.linkedin.com/in/ayaan-bhimani-803662407/",
    instagram: "https://www.instagram.com/ayaanb08"
  }
};
