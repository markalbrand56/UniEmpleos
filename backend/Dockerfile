FROM golang:1.19
LABEL authors="marka"

WORKDIR /backend

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o backend .

EXPOSE 8080

CMD ["./backend"]
# docker run -p 8080:8080 backend