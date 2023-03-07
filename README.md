# Boilerplate NextJS

This NextJS boilerplate aims to be a starting point for developers at Capsule Corp Labs in order to save them time.

## Packages used


[TernoaJS SDK](https://github.com/capsule-corp-ternoa/ternoa-js) to interact with the Ternoa blockchain.

[Prettier](https://prettier.io/), to enforce proper code writing style and a consistent file format.

[ESLint](https://eslint.org/), a static code analyser to find problems in your code.

[Tailwind](https://tailwindcss.com/), an utility-first CSS framework.

[CVA](https://github.com/joe-bell/cva), to include type safeness for CSS and to be able to conditionally apply classes. See [this excellent talk on it](https://www.youtube.com/watch?v=T-Zv73yZ_QI) to learn more. There is also an example in ```src/components/ui/HeadingOne.tsx```

[WalletConnect libraries](https://walletconnect.com/), for the wallet connection.


## Packages you could add for your project

[Radix UI](https://www.radix-ui.com/) an UI component library for building high-quality, accessible web apps.

[React Wrap Balancer](https://vercel.com/blog/react-wrap-balancer) to improve titles readability.

[tanstack/react-query](https://tanstack.com/query/v4/docs/react/overview/), a library to fetch and cache properly GraphQL APIs. Example: the Ternoa indexer

## How to run

_[pnpm](https://pnpm.io/)_ is the package manager of choice for speed and efficiency.
See the [benchmarks](https://pnpm.io/benchmarks).

You have two choices to run it:

### With Docker

1. In the terminal type:

`docker-compose up -d`

2. Access the frontend with:

`http://localhost:3000`

### Without Docker

1. Install dependencies

`pnpm i`

2. Launch the frontend with:

`pnpm dev`

3. Access the frontend with:

``http://localhost:3000```

## Tests

### Context

[Vitest](https://vitest.dev/) is used under the hood.

Tests are located in the `src` folder, in the `tests` subdirectory.

### How to run

To run tests you have 2 options :

1. Run tests without watch mode

`pnpm test`

2. Run tests with watch mode

`pnpm test:watch`
