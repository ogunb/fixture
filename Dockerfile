FROM node:16.17-alpine as builder
WORKDIR /fixture

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

FROM node:16.17-alpine as runner
WORKDIR /fixture
COPY --from=builder /fixture/package.json .
COPY --from=builder /fixture/package-lock.json .
COPY --from=builder /fixture/next.config.js ./
COPY --from=builder /fixture/public ./public
COPY --from=builder /fixture/.next/standalone ./
COPY --from=builder /fixture/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
