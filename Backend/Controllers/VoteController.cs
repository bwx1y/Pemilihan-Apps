using System.Security.Claims;
using Backend.Databases;
using Backend.Extensions;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController(VoteAppContext context) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetAll()
        {
            var roleUser = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Role);
            if (roleUser == null) return Unauthorized();
            var data = context.VoteSession.Include(f => f.Candidate).ThenInclude(f => f.Vote).AsQueryable();
            
            if (roleUser.Value == "Admin")
            {
                var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
                if (userId == null) return Unauthorized();

                if (Guid.TryParse(userId.Value, out Guid userGuid))
                {
                    data = data.Where(f => f.UserId == userGuid);
                    return Ok(data.ToList().Select(f => new
                    {
                        f.Id,
                        f.Title,
                        f.Status,
                        FollowerCount = f.Candidate.Sum(x => x.Vote.Count())
                    }).ToList());
                }
            }

            if (roleUser.Value == "User")
            {
                var groupId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.GroupSid);
                if (groupId == null) return Unauthorized();
                
                var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
                if (userId == null) return Unauthorized();

                if (Guid.TryParse(groupId.Value, out Guid groupGuid))
                {
                    Guid sId = Guid.Parse(userId.Value);
                    data = data.Where(f => f.UserId == groupGuid);
                    var result = data.ToList().Select(f => new
                    {
                        f.Id,
                        f.Title,
                        Status = f.Candidate.Any(x => x.Vote.Any(v => v.UserVoteId == sId)),
                        FollowDate = f.Candidate.FirstOrDefault(x => x.Vote.Any(v => v.UserVoteId == sId)) != null ? f.Candidate.First(x => x.Vote.Any(v => v.UserVoteId == sId)).Vote.First(x => x.UserVoteId == sId).CreateAt.ToString(@"dd-MMM-yyyy hh\:mm") : null,
                    }).ToList();
                    return Ok(result);
                }
            }
            
            return Unauthorized();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,User")]
        public IActionResult GetById(Guid id)
        {
            var find = context.VoteSession.Include(f => f.Candidate).FirstOrDefault(f => f.Id == id);
            if (find == null) return NotFound();

            return Ok(new
            {
                find.Id,
                find.Title,
                Candidate = find.Candidate.Select(f => new
                {
                    f.Id,
                    f.Name,
                    f.Fisi,
                    f.Misi,
                    f.Descripction,
                }).ToList()
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Post(VoteRequest request)
        {
            if (request.Title.IsNullOrEmpty() || request.Candidate.Count(f =>
                    f.Misi.IsNotNullOrEmpty() && f.Fisi.IsNotNullOrEmpty() && f.Name.IsNotNullOrEmpty() &&
                    f.FileName.IsNotNullOrEmpty()) == 0)
            {
                return BadRequest(new { message = "Title or candidate is required" });
            }
            
            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();
            if (Guid.TryParse(userId.Value, out Guid userGuid))
            {

                var data = context.VoteSession.Add(new VoteSession
                {
                    Title = request.Title,
                    UserId = userGuid,
                    Candidate = request.Candidate.Select(f => new Candidate
                    {
                        Name = f.Name,
                        Fisi = f.Fisi,
                        Misi = f.Misi,
                        Descripction = f.Descripction,
                        FileName = f.FileName
                    }).ToList(),
                });
                context.SaveChanges();

                return Ok(new
                {
                    data.Entity.Id,
                    data.Entity.Title,
                    data.Entity.Status,
                });
            }

            return Unauthorized();
        }

        [HttpPut("{id}/Status")]
        [Authorize(Roles = "Admin")]
        public IActionResult SetStatus(Guid id, VoteStatusRequest request)
        {
            var find = context.VoteSession.FirstOrDefault(f => f.Id == id);
            if (find == null) return NotFound();
            
            find.Status = request.Status;
            context.VoteSession.Update(find);
            context.SaveChanges();
            
            return Ok(new { message = "Success set to status" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Update(Guid id, VoteUpdateRequest request)
        {
            if (request.Title.IsNullOrEmpty() || request.Candidate.Count(f =>
                    f.Misi.IsNotNullOrEmpty() && f.Fisi.IsNotNullOrEmpty() && f.Name.IsNotNullOrEmpty() &&
                    f.FileName.IsNotNullOrEmpty()) == 0)
            {
                return BadRequest(new { message = "Title or candidate is required" });
            }
            
            var find = context.VoteSession.Include(f => f.Candidate).FirstOrDefault(f => f.Id == id);
            if (find == null) return NotFound();
            
            find.Title = request.Title;

            foreach (Candidate candidate in find.Candidate.ToList())
            {
                if (request.Candidate.FirstOrDefault(f => f.Id == candidate.Id) == null)
                {
                    context.Candidate.Remove(candidate);
                }
            }
            
            context.Candidate.AddRange(request.Candidate.Where(f => f.Id == null).Select(x => new Candidate
            {
                Name = x.Name,
                Fisi = x.Fisi,
                Misi = x.Misi,
                Descripction = x.Descripction,
                FileName = x.FileName,
                VoteSessionId = find.Id
            }).ToList());
            context.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(Guid id)
        {
            var find = context.VoteSession.Include(f =>f.Candidate).ThenInclude(f => f.Vote).FirstOrDefault(f => f.Id == id);
            if (find == null) return NotFound();

            if (find.Candidate.Sum(x => x.Vote.Count()) != 0)
            {
                return BadRequest(new { Message = "Not Allow Delete" });
            }

            foreach (Candidate candidate in find.Candidate.ToList())
            {
                string filePath = Path.Combine(Directory.GetCurrentDirectory(),"Photo", candidate.FileName);
                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            
            context.VoteSession.Remove(find);
            context.SaveChanges();
            
            return Ok(new { message = "Success delete" });
        }
    }
}
