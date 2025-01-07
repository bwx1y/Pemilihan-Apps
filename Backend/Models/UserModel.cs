using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class UserRequest
{
    [MaxLength(100, ErrorMessage = "Maximum length is 100")]
    public required string Code { get; set; }
    public required string FirstName { get; set; }
    public string? LastName { get; set; }
}