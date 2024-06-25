# Portfolio website
Personal portfolio website used to present past projects, work experience, and links to contact me!

🔗 Visit the website at [adamoorsini.com](https://adamoorsini.com)

🛠️ The website was originally designed using static HTML and CSS with Bootstrap, but I recently converted it to Astro with Tailwind for styling.

## Design 🖌
This website's goal is to allow for a more interactive and visual presentation of my projects and experience. 

To keep the focus on the content, a simple and clean design was chosen.

### Colour 🎨
On a material dark grey background, colours were specifically chosen to allow for sufficient contrast according to material UI standards. A blue/purple accent colour (#344f97) was chosen for its contrast and for being a calming, simple colour. Otherwise, standard text colour was used since it had sufficient contrast and readability.

### Layout 📏
The three-column layout seen on larger screens was built using Tailwind to allow for a lightweight grid system. It was also chosen to have consistency when scrolling through the website, with the first column being the section name, the second column being the content, and the third column being the project name.

## Content 📜
Each Project and Experience is defined using a Markdown file, and rendered in the DOM using a layout defined in Astro. The Markdown files can be found in the [content folder](src/content) if you're interested.

The Projects and Experience sections have brief descriptions of each of their items. This consists of 5-6 sentences describing the item, goal, and method of working on the project. 

Each Project or Experience item has a GIF or image showcasing it. GIFs allowed for 15-second videos that are very lightweight on the website, and will keep the attention of the viewer. It is the perfect way to introduce an item quickly.

The skills subsection lists any programming languages, technical skills, and/or soft skills used in the project or work experience. This makes it easy to quickly screen the skills obtained throughout my career. Each skill has the name and a possible logo representing it (usually just for technologies used).

