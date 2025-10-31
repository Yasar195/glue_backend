# build stage
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /bootstrap ./cmd/main

# final stage
FROM public.ecr.aws/lambda/provided:al2
COPY --from=builder /bootstrap /var/runtime/
CMD [ "bootstrap" ]
