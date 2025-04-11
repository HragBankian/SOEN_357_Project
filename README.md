# OmniFit - Omnivox 3000
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Running the Project

Note that you must run the frontend and the backend of the project simultaneously. In our case, for the backend, the port was set to 7113 in the .env.local file.

## Running the Frontend

After cloning the project, be sure to create a valid .env.local under `/frontend` like so:

```sh
NEXT_PUBLIC_API_URL=https://localhost:7113
```

Be sure that this port matches the port your backend instance is running on.

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running the Backend

1. Download Visual Studio Community Edition - https://visualstudio.microsoft.com/downloads/. Download asp .net within Visual Studio as well.

2. You **may** have to download SDK 8.0.403 - https://dotnet.microsoft.com/en-us/download/dotnet/8.0.

3. Clone the project onto your computer.

4. Open the project using Visual Studio, by opening  SOEN_357_Project\backend\backend.sln

5. Open a terminal in the directory run the command: dotnet restore

6. In the same directory, run the command: setx ASPNETCORE_ENVIRONMENT "Development"

7. Restart your Visual Studio

8. Run the project.
