using System.Security.Claims;
using Backend.Databases;
using Backend.Extensions;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;
using LoginRequest = Backend.Models.LoginRequest;
using RegisterRequest = Backend.Models.RegisterRequest;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(VoteAppContext context, IConfiguration config) : ControllerBase
    {
        private readonly string _secret = config["JWT:Key"]!;
        private readonly int _exp = Convert.ToInt32(config["JWT:Expired"]);
        
        [HttpPost("Login")]
        public IActionResult Login(LoginRequest request)
        {
            if (request.Username.IsNullOrEmpty() || request.Password.IsNullOrEmpty())
            {
                return BadRequest(new { message = "Username or password is missing." });
            }
            
            var findUser = context.User.FirstOrDefault(x => x.Username == request.Username && x.Password == request.Password.ToSha256());
            if (findUser == null) return BadRequest(new { message = "Username or password is incorrect." });
            
            return Ok(new
            {
                Token = findUser.GenerateToken(_secret, _exp),
            });
        }

        [HttpPost("Login-User")]
        public IActionResult LoginUser(LoginUserRequest request)
        {
            if (request.Code.IsNullOrEmpty())
            {
                return BadRequest(new { message = "Code is missing." });
            }
            
            var findUser = context.UserVote.FirstOrDefault(x => x.Code == request.Code);
            if (findUser == null) return BadRequest(new { message = "Code is incorrect." });
            
            return Ok(new { Token = findUser.GenerateToken(_secret, _exp) });
        }

        [HttpPost("Register")]
        public IActionResult Register(RegisterRequest request)
        {
            if (request.Username.IsNullOrEmpty() || request.Password.IsNullOrEmpty() ||
                request.FirstName.IsNullOrEmpty())
            {
                return BadRequest(new { message = "Username or password or first name is missing." });
            }
            
            var findUser = context.User.FirstOrDefault(x => x.Username == request.Username);
            if (findUser != null) return BadRequest(new { message = "Username already exists." });
            
            context.User.Add(new User
            {
                Username = request.Username,
                Password = request.Password.ToSha256(),
                FirstName = request.FirstName,
                LastName = request.LastName,
            });
            context.SaveChanges();
            return Ok(new { message = "User created successfully." });
        }

        [HttpGet("Me")]
        [Authorize]
        public IActionResult Me()
        {
            var role = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role);
            if (role == null) return Unauthorized();

            var userId = HttpContext.User.Claims.FirstOrDefault(f => f.Type == ClaimTypes.Sid);
            if (userId == null) return Unauthorized();

            if (Guid.TryParse(userId.Value, out Guid id))
            {
                if (role.Value == "Admin")
                {
                    var user = context.User.FirstOrDefault(x => x.Id == id);
                    if (user == null) return Unauthorized();
                    
                    return Ok(new { user.FirstName, user.LastName, user.Username  });
                }

                if (role.Value == "User")
                {
                    var user = context.UserVote.FirstOrDefault(x => x.Id == id);
                    if (user == null) return Unauthorized();

                    return Ok(new { user.FirstName, user.LastName, user.Code });
                }
            }
            
            return Unauthorized();
        }
    }
}
