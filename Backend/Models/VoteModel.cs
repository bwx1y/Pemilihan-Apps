namespace Backend.Models;

public class VoteRequest
{
    public required string Title { get; set; }
    public required List<CandidateRequest> Candidate { get; set; }
}

public class CandidateRequest
{
    public required string Name { get; set; }
    public required string Fisi { get; set; }
    public required string Misi { get; set; }
    public required string FileName { get; set; }
    public required string Descripction { get; set; }
}

public class VoteStatusRequest
{
    public required bool Status { get; set; }
}

public class VoteUpdateRequest
{
    public required string Title { get; set; }
    public required List<CandidateUpdateRequest> Candidate { get; set; }
}

public class CandidateUpdateRequest
{
    public Guid? Id { get; set; }
    public required string Name { get; set; }
    public required string Fisi { get; set; }
    public required string Misi { get; set; }
    public required string FileName { get; set; }
    public required string Descripction { get; set; }
}