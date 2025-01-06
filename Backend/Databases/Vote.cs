using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Databases;

[Table("Vote")]
public partial class Vote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public required Guid UserVoteId { get; set; }
    public virtual UserVote UserVote { get; set; } = null!;
    
    public required Guid CandidateId { get; set; }
    public virtual Candidate Candidate { get; set; } = null!;
    
    public DateTime CreateAt { get; set; } = DateTime.Now;
}