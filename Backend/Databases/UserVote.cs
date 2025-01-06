using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Databases;

[Table("UserVote")]
public partial class UserVote
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    [MaxLength(100)]
    public required string Code { get; set; }
    public required string FirstName { get; set; }
    public string? LastName { get; set; }
    
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
