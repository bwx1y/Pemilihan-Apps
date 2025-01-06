using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Databases;

[Table("User")]
public partial class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Username { get; set; }
    public required string Password { get; set; }
    
    public virtual ICollection<UserVote> UserVote { get; set; } = new List<UserVote>(); 
    public virtual ICollection<VoteSession> VoteSession { get; set; } = new List<VoteSession>();
}