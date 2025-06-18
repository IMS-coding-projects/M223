# OrariAperti Frontend

This is the frontend for OrariAperti, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites

- Node.js
- npm

### Development

To start the frontend in development mode:

```bash
cd OrariAperti/frontend
mv .env.example .env
# Modify .env as needed. Check out the .env.example file for available options.
npm install
npm run dev
```

This will start the Vite development server at [http://localhost:3000](http://localhost:3000) (default).

### Building for Production

```bash
npm run build
```

The production build will be output to the `dist` directory.

## Features

- Modern React + TypeScript codebase
- Tailwind CSS for styling
- UI components by ui/Shadcn
- Responsive design
- Connects to the OrariAperti backend REST API

## Project Structure

- `src/` — React components and app code
- `index.html` — Main HTML entry point
- `index.css` — Global styles

## Linting & Formatting

- ESLint for code quality

## License

This project is licensed under the [GNU General Public License v3.0](../../LICENSE). Refer to the LICENSE file for more details.
