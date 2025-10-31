package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(ctx context.Context, request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	// Log the incoming request
	requestJSON, _ := json.Marshal(request)
	fmt.Printf("Processing request data: %s\n", string(requestJSON))

	switch request.RequestContext.HTTP.Method {
	case "GET":
		return handleGet(request)
	case "POST":
		return handlePost(request)
	default:
		return events.APIGatewayV2HTTPResponse{
			Body:       fmt.Sprintf("Method not allowed: %s", request.RequestContext.HTTP.Method),
			StatusCode: 405,
		}, nil
	}
}

func handleGet(request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return events.APIGatewayV2HTTPResponse{
		Body:       "Hello from GET route",
		StatusCode: 200,
	}, nil
}

func handlePost(request events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return events.APIGatewayV2HTTPResponse{
		Body:       fmt.Sprintf("Hello from POST route with body: %s", request.Body),
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handler)
}