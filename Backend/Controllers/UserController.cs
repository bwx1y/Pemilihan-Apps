using System.Security.Claims;
using Backend.Databases;
using Backend.Extensions;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(VoteAppContext context) : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult Index(string? search)
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();

            if (Guid.TryParse(userId.Value, out Guid userGuid))
            {
                var data = context.UserVote.Where(f => f.UserId == userGuid).AsQueryable();
                
                if (!string.IsNullOrEmpty(search))
                {
                    data = data.Where(f => f.FirstName.Contains(search) || f.Code.Contains(search));
                }
                
                return Ok(data.Select(f => new
                {
                    f.Id,
                    f.FirstName,
                    f.LastName,
                    f.Code
                }).ToList());
            }

            return Unauthorized();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Index(Guid id)
        {
            var data = context.UserVote.FirstOrDefault(x => x.Id == id);
            if (data == null) return NotFound();
            
            return Ok(new
            {
                data.Id,
                data.FirstName,
                data.LastName,
                data.Code
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult Post(UserRequest request)
        {
            if (request.Code.IsNullOrEmpty() || request.FirstName.IsNullOrEmpty())
            {
                return BadRequest(new { message = "Code or first name is required" });
            }
            
            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();

            if (Guid.TryParse(userId.Value, out Guid userGuid))
            {
                var findUser = context.UserVote.FirstOrDefault(f => f.Code == request.Code);
                if (findUser != null) return BadRequest(new { message = "Code is avaliable" });

                var data = context.UserVote.Add(new UserVote
                {
                    UserId = userGuid,
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Code = request.Code
                });
                context.SaveChanges();
                
                return Ok(new
                {
                    data.Entity.Id,
                    data.Entity.FirstName,
                    data.Entity.LastName,
                    data.Entity.Code
                });
            }

            return Unauthorized();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Put(Guid id, UserRequest request)
        {
            if (request.Code.IsNullOrEmpty() || request.FirstName.IsNullOrEmpty())
            {
                return BadRequest(new { message = "Code or first name is required" });
            }
            
            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();

            if (Guid.TryParse(userId.Value, out Guid userGuid))
            {
                var findUser = context.UserVote.FirstOrDefault(f => f.Id == id);
                if (findUser == null) return NotFound();
                
                findUser.FirstName = request.FirstName;
                findUser.LastName = request.LastName;
                findUser.Code = request.Code;
                var data = context.UserVote.Update(findUser);

                return Ok(new
                {
                    data.Entity.Id,
                    data.Entity.FirstName,
                    data.Entity.LastName,
                    data.Entity.Code
                });
            }
            return Unauthorized();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(Guid id)
        {
            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();
            
            if (Guid.TryParse(userId.Value, out Guid userGuid))
            {
                var findUser = context.UserVote.FirstOrDefault(f => f.Id == id);
                if (findUser == null) return NotFound();
                
                context.UserVote.Remove(findUser);
                context.SaveChanges();
                
                return Ok(new { message = "User has been deleted" });
            }
            
            return Unauthorized();
        }
    }
}