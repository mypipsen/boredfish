# boredfish

## How to install
```sh
fnm use
npm ci
cp .env.example .env
npx @better-auth/cli@latest secret
npx prisma generate
npx prisma db push
npx prisma db seed
```
