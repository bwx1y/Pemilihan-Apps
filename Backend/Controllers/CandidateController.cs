using System.Security.Claims;
using Backend.Databases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController(VoteAppContext context) : ControllerBase
    {
        private string GetContentType(string fileExtension)
        {
            return fileExtension.ToLowerInvariant() switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream" // Default jika tidak dikenali
            };
        }
        
        [HttpPost("Photo")]
        public IActionResult AddPhoto(IFormFile file)
        {
            if (file.Length == 0)
                return BadRequest("File not valid.");
            
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(fileExtension))
                return BadRequest("Ekstensi file tidak diizinkan.");
            
            if (file.Length > 5 * 1024 * 1024) // Maksimal 5 MB
                return BadRequest("Ukuran file melebihi batas maksimum (5 MB).");

            string path = Path.Combine(Directory.GetCurrentDirectory(), "Photo");
            if (!Directory.Exists(path)) Directory.CreateDirectory(path);

            GenerateName:
            string fileName = $"{Guid.NewGuid().ToString().Replace("-", "")}-{Guid.NewGuid()}{fileExtension}";
            if (System.IO.File.Exists(Path.Combine(path, fileName))) goto GenerateName;

            using (var stream = new FileStream(Path.Combine(path, fileName), FileMode.Create))
            {
                file.CopyTo(stream);
            }
            
            return Ok(new
            {
                Message = "File created",
                FileName = fileName
            });
        }

        [HttpGet("{id}/Photo")]
        public IActionResult GetPhoto(Guid id)
        {
            var find = context.Candidate.FirstOrDefault(f => f.Id == id);
            if (find == null) return NotFound();
            
            string path = Path.Combine(Directory.GetCurrentDirectory(), "Photo", find.FileName);
            if (!System.IO.File.Exists(path)) return NotFound();
            
            string contentType = GetContentType(Path.GetExtension(path));
            var fileBytes = System.IO.File.ReadAllBytes(path);
            return File(fileBytes, contentType);
        }

        [HttpPost("{id}/Apply")]
        [Authorize(Roles = "User")]
        public IActionResult Apply(Guid id)
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();
            
            var find = context.Candidate.FirstOrDefault(f => f.Id == id);
            if (find == null) return NotFound();

            if (Guid.TryParse(userId.Value, out Guid userGuid))
            {
                var data = context.Vote.Add(new Vote
                {
                    CandidateId = id,
                    UserVoteId = userGuid,
                    CreateAt = DateTime.Now,
                });
                context.SaveChanges();

                return Ok(new
                {
                    data.Entity.Id,
                    data.Entity.CandidateId,
                    data.Entity.CreateAt,
                });
            }

            return Unauthorized();
        }
    }
}
