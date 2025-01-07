using System.Collections;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Databases;

[Table("VoteSession")]
public partial class VoteSession
{
    [Key]
    public Guid Id { get; set; }= Guid.NewGuid();
    public required string Title { get; set; }
    public bool Status { get; set; } = false;
    
    public required Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
    
    public virtual ICollection<Candidate> Candidate { get; set; } = new List<Candidate>();
}