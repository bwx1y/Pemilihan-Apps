using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Databases;

[Table("Candidate")]
public class Candidate
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    
    [Column(TypeName = "TEXT")]
    public required string Fisi { get; set; }
    [Column(TypeName = "TEXT")]
    public required string Misi { get; set; }
    [Column(TypeName = "TEXT")]
    public required string FileName { get; set; }
    [Column(TypeName = "TEXT")]
    public required string Descripction { get; set; }
    
    public required Guid VoteSessionId { get; set; }
    public virtual VoteSession VoteSession { get; set; } = null!;
    
    public virtual ICollection<Vote> Vote { get; set; } = new List<Vote>();
}