using System.Net;
using System.Text.Json;

namespace IARA.API.Middleware;

/// <summary>
/// Global exception handling middleware that catches all unhandled exceptions
/// and returns a standardized error response
/// </summary>
public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var code = HttpStatusCode.InternalServerError;
        var result = string.Empty;

        switch (exception)
        {
            case KeyNotFoundException:
                code = HttpStatusCode.NotFound;
                result = JsonSerializer.Serialize(new ErrorResponse
                {
                    StatusCode = (int)code,
                    Message = "Resource not found",
                    Detail = exception.Message
                });
                break;

            case UnauthorizedAccessException:
                code = HttpStatusCode.Unauthorized;
                result = JsonSerializer.Serialize(new ErrorResponse
                {
                    StatusCode = (int)code,
                    Message = "Unauthorized access",
                    Detail = exception.Message
                });
                break;

            case ArgumentException:
            case InvalidOperationException:
                code = HttpStatusCode.BadRequest;
                result = JsonSerializer.Serialize(new ErrorResponse
                {
                    StatusCode = (int)code,
                    Message = "Bad request",
                    Detail = exception.Message
                });
                break;

            default:
                result = JsonSerializer.Serialize(new ErrorResponse
                {
                    StatusCode = (int)code,
                    Message = "An error occurred while processing your request",
                    Detail = exception.Message
                });
                break;
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)code;

        return context.Response.WriteAsync(result);
    }
}

/// <summary>
/// Standardized error response model
/// </summary>
public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
}
