using Microsoft.EntityFrameworkCore;

namespace Backend.Databases;

public class VoteAppContext(DbContextOptions<VoteAppContext> options): DbContext(options)
{
    public DbSet<Candidate> Candidate { get; set; }
    public DbSet<User> User { get; set; }
    public DbSet<UserVote> UserVote { get; set; }
    public DbSet<Vote> Vote { get; set; }
    public DbSet<VoteSession> VoteSession { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Vote>()
            .HasOne(v => v.UserVote)
            .WithMany(uv => uv.Votes)
            .HasForeignKey(v => v.UserVoteId)
            .OnDelete(DeleteBehavior.Restrict);
        
        base.OnModelCreating(modelBuilder);
    }
}