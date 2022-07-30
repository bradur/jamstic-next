# Jamstic-next

Collect your game jam games within a single static portfolio site hosted on Github!

[Demo (my games)](https://bradur.github.io/jamstic-next/)

Supported game jam sites:
- [Global Game Jam](https://globalgamejam.org/) (scraping)
- [LDJam](https://ldjam.com/) (API)
- [Alakajam!](https://alakajam.com/) (API)

Technologies used:
- [Next.js](https://nextjs.org/)
- [Typescript](https://www.typescriptlang.org/)

This project is a rewrite of my [jamstic](https://github.com/bradur/jamstic) project that used Svelte & Sapper & Javascript 

# How to use

1. Fork this project

2. Clone your forked project and navigate to it
```bash
$ git clone https://github.com/<your-username>/jamstic-next.git
$ cd jamstic-next
```

3. Create `config/config.json` based on `config/exampleConfig.json`

```bash
$ cp config/exampleConfig.json config/config.json
```

4. Edit the file with your details (replace all the things inside `< >`)

`config/config.json`
```json
{
  "profiles": {
    "ldjam": {
      "profileName": "<your-ldjam-username>"
    },
    "alakajam": {
      "profileName": ""
    },
    "globalgamejam": {
      "profileName": ""
    }
  },
  "repository": "",
  "deploy": {
    "branch": "gh-pages",
    "repo": "https://github.com/<your-username>/jamstic-next.git",
    "user": {
      "name": "<your-name>",
      "email": "<your-email>"
    }
  }
}
```

5. Run npm install in the cloned folder
```bash
$ npm install
```

5. Run dev and open http://localhost:3000 in your browser
```bash
$ npm run dev
```

6. If everything works, close the dev process and run the deploy script
```bash
$ npm run deploy
Export successful. Files written to ...
Deploy Complete!
```

# Blog & custom content
You may add `.json` files to `content/blog` or `custom/*` to add entries manually.

Here's an example of a custom entry:
```json
{
    "description": "Conway's Game of Life with a bit of Metaballs on the side implemented in Unity3D.",
    "url": "https://github.com/bradur/GameOfMetaballs",
    "body": "# GameOfMetaballs\n\nConway's Game of Life with a bit of Metaballs on the side implemented in Unity3D.\n\n",
    "date": 1643148000000,
    "name": "Game of Metaballs",
    "slug": "game-of-metaballs",
    "categorySlug": "other",
    "links": [
        {
            "url": "https://bradur.github.io/GameOfMetaballs/",
            "title": "WebGL"
        }
    ],
    "tags": [
        "game-of-life",
        "metaballs",
        "unity3d"
    ],
    "cover": {
        "originalUrl": "cover.gif",
        "type": "cover"
    },
    "coverColors": {
        "css": "--one: rgb(159,228,226);--two: rgb(51,108,107);--three: rgb(228,227,207);--four: rgb(104,134,124);--five: rgb(155,62,66);"
    }
}
```

If you wish to display images, you'll have to put them in `public/images/custom/*/<slug>`.